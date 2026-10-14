
# Despliegue y Redes de una Arquitectura Multi-Servicio con Docker Compose

## 1. Introducción

En este laboratorio se desarrolló una aplicación web compuesta por tres servicios: frontend, backend y base de datos. El entorno se configuró utilizando Docker y Docker Compose para facilitar la creación, ejecución y comunicación entre los contenedores.

La aplicación permite registrar información mediante una interfaz web, enviar los datos al backend y almacenarlos en una base de datos PostgreSQL.

## 2. Objetivos

- Configurar redes personalizadas para separar las capas de la aplicación.
- Implementar persistencia de datos mediante un volumen nombrado de Docker.
- Gestionar las credenciales de la base de datos mediante variables de entorno.
- Desplegar y comprobar el funcionamiento de una arquitectura de múltiples servicios.

## 3. Tecnologías utilizadas

- Docker Desktop: ejecución y administración de contenedores.
- Docker Compose: configuración y coordinación de los servicios.
- Nginx: publicación de la interfaz web y redirección de solicitudes al backend.
- Python y Flask: desarrollo de la API.
- PostgreSQL: almacenamiento persistente de los registros.
- Visual Studio Code: edición de los archivos del proyecto.

## 4. Arquitectura del sistema

La aplicación está compuesta por tres servicios:

### Frontend

Contiene la interfaz web desarrollada con HTML, CSS y JavaScript. Se ejecuta mediante Nginx y es accesible desde el navegador utilizando la dirección http://localhost en el puerto 80.

### Backend

Desarrollado en Python con Flask. Recibe las solicitudes del frontend, procesa los datos y se comunica con PostgreSQL para consultar y guardar registros.

### Base de datos

Utiliza PostgreSQL para almacenar los registros de la aplicación. Los datos se conservan mediante un volumen nombrado de Docker.

### Comunicación entre servicios

Se configuraron dos redes bridge personalizadas:

- `frontend-net`: conecta el frontend con el backend.
- `backend-net`: conecta el backend con PostgreSQL.

El frontend no está conectado directamente a la red de la base de datos. Por lo tanto, las solicitudes de la interfaz deben pasar por el backend.

## 5. Estructura del proyecto

```text
laboratorio-docker/
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── style.css
    ├── app.js
    ├── Dockerfile
    └── nginx.conf
```

## 6. Configuración de Docker Compose

El archivo `docker-compose.yml` define los tres servicios de la aplicación, sus dependencias, las redes de comunicación y el volumen persistente de PostgreSQL.

Las credenciales y el nombre de la base de datos se configuran mediante variables de entorno definidas en el archivo `.env`, evitando escribir directamente esos valores en el archivo de orquestación.

El volumen `postgres_data` permite conservar los datos de PostgreSQL cuando se detienen y eliminan los contenedores sin eliminar el volumen.

## 7. Instrucciones de ejecución

Para ejecutar el laboratorio se deben seguir los siguientes pasos:

1. Instalar y abrir Docker Desktop.
2. Abrir una terminal en la carpeta raíz del proyecto.
3. Verificar que el archivo `.env` esté configurado con las variables necesarias.
4. Construir las imágenes e iniciar los servicios mediante el comando:

```powershell
docker compose up -d --build
```

5. Comprobar el estado de los contenedores:

```powershell
docker compose ps
```

6. Abrir la aplicación web desde el navegador:

```text
http://localhost
```

7. Para detener los servicios, ejecutar:

```powershell
docker compose down
```

Este último comando no elimina el volumen nombrado de PostgreSQL.

## 8. Pruebas de funcionamiento

### 8.1. Estado de los contenedores

Se utiliza el comando `docker compose ps` para verificar que los servicios frontend, backend y base de datos se encuentren en ejecución. También se comprueba el estado de salud de PostgreSQL.

### 8.2. Conexión con el backend y la base de datos

Se realizan solicitudes a los siguientes endpoints:

- `http://localhost/api/health`: comprueba la conexión del backend con PostgreSQL.
- `http://localhost/api/records`: consulta los registros almacenados.

La respuesta correcta del endpoint de salud confirma que el backend puede comunicarse con la base de datos.

### 8.3. Registro de información desde el frontend

Se diligencia el formulario de la aplicación web y se guarda un registro de prueba. La interfaz muestra un mensaje de confirmación y presenta el registro guardado con su descripción y fecha de creación.

### 8.4. Persistencia de los datos

Para comprobar la persistencia, se guarda un registro y se ejecuta el comando `docker compose down`. Posteriormente, se vuelve a iniciar el entorno con `docker compose up -d`.

Después de iniciar los servicios, se consulta nuevamente la lista de registros. Si el registro creado previamente continúa disponible, se confirma que los datos se conservaron en el volumen nombrado de PostgreSQL.

## 9. Evidencias del laboratorio

En esta sección se deben insertar las capturas de pantalla que demuestran la configuración y el funcionamiento del entorno.

- Evidencia 1. Verificación de las versiones de Docker y Docker Compose.
- Evidencia 2. Estructura de carpetas y archivos del proyecto.
- Evidencia 3. Estado de los tres contenedores mediante `docker compose ps`.
- Evidencia 4. Configuración del archivo `docker-compose.yml`.
- Evidencia 5. Prueba de conexión con el backend y PostgreSQL.
- Evidencia 6. Registro creado desde la interfaz web.
- Evidencia 7. Consulta de los datos almacenados en PostgreSQL.
- Evidencia 8. Logs del backend.
- Evidencia 9. Prueba de persistencia después de detener y reiniciar los servicios.
- Evidencias adicionales. Capturas de los archivos Dockerfile, código del backend y configuración del frontend.

## 10. Conclusiones

El desarrollo del laboratorio permitió implementar una aplicación web con una arquitectura de tres servicios utilizando Docker Compose.

Se configuraron redes personalizadas para separar las capas de la aplicación, un volumen nombrado para conservar los datos y variables de entorno para gestionar la configuración de PostgreSQL.

Las pruebas de funcionamiento permiten verificar la comunicación entre el frontend y el backend, así como el almacenamiento de los registros en la base de datos. La prueba de persistencia permite comprobar que los datos se mantienen después de detener y volver a iniciar los servicios.

## 11. Consideraciones de seguridad

El archivo `.env` contiene la configuración sensible necesaria para ejecutar el proyecto y no debe publicarse si incluye contraseñas reales. Para compartir el laboratorio se utiliza `.env.example` como plantilla, sin secretos reales.
