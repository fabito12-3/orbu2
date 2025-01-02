// Lista de las imágenes que rotarán
const images = [
    'samaria_2_1920.jpg',
    'samaria_3_1920.jpg',
    'samaria_4_1920.jpg',
    'samaria_5_1920.jpg',
    'samaria_6_1920.jpg',
    'samaria_7_1920.jpg',
    'samaria_8_1920.jpg',
    'samaria_9_1920.jpg',
    'samaria_10_1920.jpg',
    'samaria_11_1920.jpg',
    'samaria_12_1920.jpg'
];


// Lista de los textos que rotarán
const texts = [
    'Club de playa en el exclusivo sector de pozos colorados',
    'Excelente piscina de entrenamiento.',
    'Zonas de recreacion y relajacion.',
    'Comparte con los mas pequeños de tu familia.',
    'Entrena y no pierdas tu linea',
    'Jacuzzi para todos.',
    'Disfruta de un relajante masaje.',
    'Kioskos frente al mar',
    'Sauna para 15 personas.',
    'Deja fluir y que los niños se diviertan.',
    'Reserva con nosotros.'
];

// Contador para la imagen y texto actuales
let currentIndex = 0;
const totalImages = images.length;

// Variable para verificar si las imágenes están cargadas
let imagesLoaded = 0;

// Función para precargar todas las imágenes
function preloadImages() {
    for (let i = 0; i < totalImages; i++) {
        const img = new Image();
        img.src = '/images/' + images[i];

        // Cuando una imagen se carga, incrementamos el contador
        img.onload = function() {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                // Cuando todas las imágenes estén cargadas, mostramos el banner
                document.getElementById('banner').style.opacity = 1;
                startImageRotation();
            }
        };
    }
}

// Función para cambiar la imagen y el texto
function changeContent() {
    const imgElement = document.getElementById('banner-image');
    const textElement = document.getElementById('banner-text');

    // Cambiar la imagen
    imgElement.src = '/images/' + images[currentIndex];

    // Cambiar el texto
    textElement.textContent = texts[currentIndex];

    // Incrementar el índice para la siguiente imagen y texto
    currentIndex = (currentIndex + 1) % images.length;  // Reinicia cuando llega al final
}

// Función para comenzar la rotación de imágenes cada 2 segundos
function startImageRotation() {
    setInterval(changeContent, 2000); // 2000 ms = 2 segundos
}

// Iniciar la precarga de las imágenes
preloadImages();
