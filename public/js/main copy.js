// Modificar la respuesta del servidor para enviar JSON
const server = http.createServer(async (req, res) => {
    // Habilita CORS para solicitudes desde localhost:1313
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1313');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde a las solicitudes de tipo OPTIONS para preflight requests
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    try {
        if (req.url === '/') {
            const auth = await authorize();
            const events = await listEvents(auth);

            // Responde con los eventos en formato JSON
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(events));  // Devuelve los eventos como JSON
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('¡Hola, has llegado a mi servidor Node.js!\n');
        }
    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Error al obtener los eventos: ' + error.message);
    }
});
