
# Despliegue y Redes de una Arquitectura Multi-Servicio con Docker Compose

## 1. Introducción

En este laboratorio se desarrolló una aplicación web compuesta por tres servicios: frontend, backend y base de datos. El entorno se configuró utilizando Docker y Docker Compose para facilitar la creación, ejecución y comunicación entre los contenedores.

La aplicación permite registrar información mediante una interfaz web, enviar los datos al backend y almacenarlos en una base de datos PostgreSQL. Además, se implementaron redes personalizadas y un volumen nombrado para separar la comunicación entre los servicios y conservar la información almacenada.

## 2. Objetivos

- Configurar redes personalizadas para separar las capas de la aplicación.
- Implementar persistencia de datos mediante un volumen nombrado de Docker.
- Gestionar las credenciales de la base de datos mediante variables de entorno.
- Desplegar y comprobar el funcionamiento de una arquitectura de múltiples servicios.
- Verificar la comunicación entre el frontend, el backend y PostgreSQL.

## 3. Tecnologías utilizadas

- **Docker Desktop:** ejecución y administración de contenedores.
- **Docker Compose:** configuración y coordinación de los servicios.
- **Nginx:** publicación de la interfaz web y redirección de solicitudes al backend.
- **Python y Flask:** desarrollo de la API.
- **PostgreSQL:** almacenamiento persistente de los registros.
- **HTML, CSS y JavaScript:** desarrollo de la interfaz web.
- **Visual Studio Code:** edición de los archivos del proyecto.

## 4. Arquitectura del sistema

La aplicación está compuesta por tres servicios principales.

### 4.1. Frontend

Contiene la interfaz web desarrollada con HTML, CSS y JavaScript. Se ejecuta mediante Nginx y es accesible desde el navegador utilizando la dirección http://localhost a través del puerto 80.

El frontend permite ingresar información mediante un formulario y consultar los registros almacenados. Las solicitudes dirigidas a la API se envían a través de Nginx hacia el backend.

### 4.2. Backend

Está desarrollado en Python con Flask. Recibe las solicitudes del frontend, procesa la información y se comunica con PostgreSQL para consultar y guardar registros.

La API dispone de los siguientes endpoints:

- `GET /api/health`: verifica el estado de la conexión entre el backend y PostgreSQL.
- `GET /api/records`: consulta los registros almacenados.
- `POST /api/records`: permite guardar un nuevo registro.

### 4.3. Base de datos

Se utiliza PostgreSQL para almacenar los registros de la aplicación. La información se conserva mediante un volumen nombrado de Docker, lo que permite mantener los datos aunque los contenedores se detengan y se eliminen.

### 4.4. Comunicación entre servicios

Se configuraron dos redes bridge personalizadas:

- **frontend-net:** conecta el frontend con el backend.
- **backend-net:** conecta el backend con PostgreSQL.

El frontend no está conectado directamente a la red de la base de datos. Por lo tanto, las solicitudes de la interfaz deben pasar por el backend para consultar o guardar información.

Esta configuración separa la comunicación de las capas de la aplicación y evita que el frontend tenga acceso directo al servicio de base de datos mediante las redes definidas.

## 5. Estructura del proyecto

El proyecto se organiza de la siguiente manera:

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

Descripción de los archivos principales:

- **docker-compose.yml:** define los servicios, las redes, las variables de entorno, las dependencias y el volumen.
- **.env:** contiene las variables de configuración utilizadas durante la ejecución.
- **.env.example:** proporciona una plantilla de las variables necesarias, sin incluir contraseñas reales.
- **.gitignore:** evita que archivos sensibles y archivos temporales se incluyan en Git.
- **backend/app.py:** contiene la lógica de la API desarrollada con Flask.
- **backend/Dockerfile:** define la construcción de la imagen del backend.
- **backend/requirements.txt:** especifica las dependencias de Python.
- **frontend/index.html:** contiene la estructura de la interfaz web.
- **frontend/style.css:** define los estilos de la interfaz.
- **frontend/app.js:** gestiona las solicitudes a la API y las acciones del formulario.
- **frontend/Dockerfile:** define la construcción de la imagen del frontend.
- **frontend/nginx.conf:** configura Nginx para servir la interfaz y redirigir las solicitudes de la API.

## 6. Configuración de Docker Compose

El archivo `docker-compose.yml` define los tres servicios de la aplicación: `frontend`, `backend` y `db`.

El servicio frontend publica el puerto 80 del contenedor en el puerto 80 del equipo anfitrión. El backend procesa las solicitudes de la API y se conecta con PostgreSQL a través de la red `backend-net`.

La base de datos utiliza la imagen `postgres:16-alpine`. También dispone de una comprobación de salud que permite verificar cuándo está preparada para recibir conexiones.

### 6.1. Redes personalizadas

Se definieron dos redes de tipo bridge:

- `frontend-net`
- `backend-net`

El frontend pertenece únicamente a `frontend-net`. El backend pertenece a ambas redes, mientras que PostgreSQL pertenece únicamente a `backend-net`.

Esta distribución permite separar la comunicación entre la interfaz web y la base de datos.

### 6.2. Variables de entorno

Las credenciales y el nombre de la base de datos se configuran mediante variables de entorno definidas en el archivo `.env`.

Estas variables incluyen:

- `POSTGRES_DB`: nombre de la base de datos.
- `POSTGRES_USER`: usuario de PostgreSQL.
- `POSTGRES_PASSWORD`: contraseña de PostgreSQL.

El archivo `.env` permite mantener los valores de configuración fuera del archivo de orquestación. Para compartir el proyecto se incluye `.env.example` como plantilla, sin secretos reales.

### 6.3. Volumen nombrado

Se configuró el volumen `postgres_data` para almacenar los datos de PostgreSQL fuera del ciclo de vida de los contenedores.

Al ejecutar `docker compose down`, los contenedores y las redes del proyecto se eliminan, pero el volumen nombrado se conserva porque no se utiliza la opción `-v`.

Cuando los servicios se vuelven a iniciar, PostgreSQL utiliza el volumen existente y puede recuperar los registros almacenados previamente.

## 7. Instrucciones de ejecución

Para ejecutar el laboratorio se deben seguir los siguientes pasos.

### 7.1. Preparar el entorno

1. Instalar y abrir Docker Desktop.
2. Abrir Visual Studio Code o una terminal en la carpeta raíz del proyecto.
3. Verificar que el archivo `.env` exista y contenga las variables necesarias para configurar PostgreSQL.
4. Comprobar que Docker Desktop esté iniciado.

### 7.2. Construir e iniciar los servicios

Desde la carpeta raíz del proyecto, ejecutar:

```powershell
docker compose up -d --build
```

Este comando construye las imágenes necesarias e inicia los contenedores en segundo plano.

### 7.3. Comprobar los contenedores

Ejecutar:

```powershell
docker compose ps
```

Este comando permite consultar el estado de los servicios frontend, backend y base de datos. PostgreSQL debe alcanzar el estado `healthy` cuando su comprobación de salud sea satisfactoria.

### 7.4. Abrir la aplicación

Abrir el navegador y acceder a:

http://localhost

Desde la interfaz se puede diligenciar el formulario para crear un registro y consultar la información guardada.

### 7.5. Detener los servicios

Para detener y eliminar los contenedores del proyecto, ejecutar:

```powershell
docker compose down
```

Este comando no elimina el volumen nombrado `postgres_data`, por lo que la información de PostgreSQL se conserva.

## 8. Pruebas de funcionamiento

### 8.1. Estado de los contenedores

Se utilizó el comando `docker compose ps` para verificar que los tres servicios estuvieran en ejecución.

La comprobación permitió observar los contenedores del frontend, el backend y PostgreSQL. La base de datos alcanzó el estado `healthy`.

### 8.2. Conexión con el backend y PostgreSQL

Se consultó el endpoint de salud mediante el siguiente comando:

```powershell
Invoke-RestMethod http://localhost/api/health
```

La respuesta obtenida confirmó que el backend estaba conectado correctamente con PostgreSQL.

También se consultaron los registros almacenados mediante:

```powershell
Invoke-RestMethod http://localhost/api/records
```

La consulta permitió verificar la información registrada en la base de datos.

### 8.3. Registro de información desde el frontend

Se accedió a la aplicación desde el navegador mediante `http://localhost`.

A través del formulario se creó un registro de prueba con el nombre **Prueba Docker** y la descripción **Registro de prueba del laboratorio**.

La interfaz mostró un mensaje de confirmación y presentó el registro guardado con su fecha de creación.

Posteriormente, se consultaron los registros mediante el endpoint `/api/records`, comprobando que la información se encontraba almacenada en PostgreSQL.

### 8.4. Persistencia de los datos

Para comprobar la persistencia, primero se consultaron los registros existentes. Después, se detuvieron y eliminaron los contenedores mediante:

```powershell
docker compose down
```

A continuación, se volvieron a iniciar los servicios:

```powershell
docker compose up -d
```

Se verificó el estado de los contenedores con:

```powershell
docker compose ps
```

Finalmente, se consultaron nuevamente los registros:

```powershell
Invoke-RestMethod http://localhost/api/records
```

El registro de prueba continuó disponible después de recrear los contenedores. Esto permitió comprobar que el volumen nombrado `postgres_data` conservó la información almacenada.

## 9. Resultados de las pruebas

Las pruebas realizadas permitieron verificar el funcionamiento de los tres servicios definidos en Docker Compose.

Se comprobó que el frontend estuviera disponible desde el navegador, que el backend pudiera comunicarse con PostgreSQL y que la aplicación permitiera crear y consultar registros.

También se verificó la configuración de las redes personalizadas y la utilización de variables de entorno para configurar la base de datos.

Finalmente, la prueba de persistencia confirmó que los datos continuaron disponibles después de detener y volver a iniciar los servicios, sin eliminar el volumen nombrado de PostgreSQL.

## 10. Conclusiones

El desarrollo del laboratorio permitió implementar una aplicación web con una arquitectura de tres servicios utilizando Docker Compose.

Se configuraron redes personalizadas para separar las capas de la aplicación, un volumen nombrado para conservar los datos y variables de entorno para gestionar la configuración de PostgreSQL.

Las pruebas permitieron verificar la comunicación entre el frontend y el backend, el almacenamiento de los registros en PostgreSQL y la persistencia de la información después de detener y reiniciar los servicios.

Con esta implementación se aplicaron conceptos fundamentales de DevOps relacionados con la contenerización, la orquestación de servicios, la configuración de redes y la persistencia de datos.

## 11. Consideraciones de seguridad

El archivo `.env` contiene la configuración necesaria para ejecutar el proyecto y no debe publicarse si incluye contraseñas reales.

Para compartir el laboratorio se utiliza `.env.example` como plantilla de configuración, sin secretos reales. El archivo `.gitignore` incluye la regla `.env` para evitar que las credenciales se agreguen accidentalmente al repositorio.

Además, la base de datos no publica directamente su puerto en el equipo anfitrión mediante la configuración de Docker Compose. El acceso desde la aplicación se realiza a través del backend y de la red interna correspondiente.
