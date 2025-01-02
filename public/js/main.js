document.addEventListener("DOMContentLoaded", function() {
    const eventsContainer = document.getElementById('events');

    // Realizamos la llamada al servidor Node.js
    fetch('http://localhost:3000')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los eventos');
            }
            return response.json();  // Obtener la respuesta como JSON
        })
        .then(data => {
            // Transformamos los intervalos en el formato que necesitas
            const transformedData = transformIntervals(data.intervalos);

            // Mostrar el JSON transformado de los eventos
            eventsContainer.innerHTML = `
                <h3>Eventos:</h3>
                <pre>${JSON.stringify(transformedData, null, 2)}</pre>
            `;
        })
        .catch(error => {
            console.error('Error al obtener los eventos:', error);
            eventsContainer.textContent = 'Hubo un error al cargar los eventos.';
        });
});

// Función para transformar los intervalos de fecha en el formato deseado
function transformIntervals(intervalos) {
    // Aquí simplemente devolvemos el array tal cual lo deseas
    return intervalos.map(interval => {
        return {
            "inicio": interval.inicio,
            "fin": interval.fin
        };
    });
}
