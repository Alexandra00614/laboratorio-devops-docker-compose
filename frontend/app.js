const recordForm = document.getElementById("recordForm");
const nombreInput = document.getElementById("nombre");
const descripcionInput = document.getElementById("descripcion");
const formMessage = document.getElementById("formMessage");
const apiStatus = document.getElementById("apiStatus");
const recordsList = document.getElementById("recordsList");
const submitButton = document.getElementById("submitButton");

// Comprobar conexión con el backend y la base de datos
async function checkConnection() {
    try {
        const response = await fetch("/api/health");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje || "No se pudo conectar con la base de datos.");
        }

        apiStatus.textContent = "Conexión correcta con el servidor y la base de datos.";
        return true;
    } catch (error) {
        apiStatus.textContent = "Error de conexión: " + error.message;
        return false;
    }
}

// Consultar y mostrar los registros guardados
async function loadRecords() {
    try {
        const response = await fetch("/api/records");

        if (!response.ok) {
            throw new Error("No se pudieron consultar los registros.");
        }

        const records = await response.json();

        recordsList.replaceChildren();

        if (records.length === 0) {
            const message = document.createElement("p");
            message.textContent = "Todavía no hay registros guardados.";
            recordsList.appendChild(message);
            return;
        }

        records.forEach((record) => {
            const card = document.createElement("article");
            card.className = "record-card";

            const title = document.createElement("h3");
            title.textContent = record.nombre;

            const description = document.createElement("p");
            description.textContent = record.descripcion;

            const date = document.createElement("small");
            date.textContent = "Fecha: " + (record.creado_en || "No disponible");

            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(date);

            recordsList.appendChild(card);
        });
    } catch (error) {
        recordsList.replaceChildren();

        const message = document.createElement("p");
        message.textContent = error.message;
        recordsList.appendChild(message);
    }
}

// Guardar un registro nuevo
recordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (!nombre || !descripcion) {
        formMessage.textContent = "Completa el nombre y la descripción.";
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";
    formMessage.textContent = "";

    try {
        const response = await fetch("/api/records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || "No se pudo guardar el registro.");
        }

        formMessage.textContent = "¡Registro guardado correctamente!";

        // Vaciar los campos solo después de confirmar el guardado.
        recordForm.reset();

        // Actualizar la lista para mostrar el registro nuevo.
        await loadRecords();
    } catch (error) {
        formMessage.textContent = "Error al guardar: " + error.message;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar registro";
    }
});

// Iniciar la página
async function initializeApp() {
    const connected = await checkConnection();

    if (connected) {
        await loadRecords();
    } else {
        recordsList.replaceChildren();

        const message = document.createElement("p");
        message.textContent = "No se pueden cargar los registros hasta recuperar la conexión.";
        recordsList.appendChild(message);
    }
}

initializeApp();