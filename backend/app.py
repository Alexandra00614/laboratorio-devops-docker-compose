
import os
import time

from flask import Flask, jsonify, request
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)


def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.environ["POSTGRES_DB"],
        user=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"],
        connect_timeout=3,
    )


def initialize_database():
    for attempt in range(20):
        try:
            with get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS registros (
                            id SERIAL PRIMARY KEY,
                            nombre VARCHAR(120) NOT NULL,
                            descripcion TEXT NOT NULL,
                            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )
                    """)
            print("Base de datos inicializada correctamente.")
            return
        except psycopg2.Error as error:
            print(f"Esperando PostgreSQL: {error}")
            time.sleep(2)

    raise RuntimeError("No fue posible conectar con PostgreSQL.")


@app.get("/api/health")
def health():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")

        return jsonify({
            "estado": "correcto",
            "mensaje": "Backend conectado a PostgreSQL"
        })

    except psycopg2.Error:
        return jsonify({
            "estado": "error",
            "mensaje": "No hay conexión con la base de datos"
        }), 503


@app.get("/api/records")
def list_records():
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, nombre, descripcion,
                to_char(creado_en, 'YYYY-MM-DD HH24:MI:SS') AS creado_en
                FROM registros
                ORDER BY id DESC
            """)
            records = cur.fetchall()

    return jsonify(records)


@app.post("/api/records")
def create_record():
    data = request.get_json(silent=True) or {}

    nombre = str(data.get("nombre", "")).strip()
    descripcion = str(data.get("descripcion", "")).strip()

    if not nombre or not descripcion:
        return jsonify({
            "error": "Completa el nombre y la descripción."
        }), 400

    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO registros (nombre, descripcion)
                VALUES (%s, %s)
                RETURNING id, nombre, descripcion,
                to_char(creado_en, 'YYYY-MM-DD HH24:MI:SS') AS creado_en
            """, (nombre, descripcion))

            record = cur.fetchone()

    return jsonify(record), 201


if __name__ == "__main__":
    initialize_database()
    app.run(host="0.0.0.0", port=5000)
