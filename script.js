// Variables globales
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let stream = null;
let isCameraReady = false;

// Elementos DOM
const captureBtn = document.getElementById('captureBtn');
const galleryBtn = document.getElementById('galleryBtn');
const resultContainer = document.getElementById('resultContainer');
const newPhotoBtn = document.getElementById('newPhotoBtn');
const cameraContainer = document.getElementById('cameraContainer');

// Iniciar cámara al cargar
async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });
        
        video.srcObject = stream;
        isCameraReady = true;
        console.log('📷 Cámara lista');
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        alert('Por favor, permite el acceso a la cámara para usar la app.');
    }
}

// Capturar foto
function capturePhoto() {
    if (!isCameraReady) {
        alert('Espera a que la cámara esté lista...');
        return;
    }

    // Configurar canvas para captura
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir a imagen
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    analyzePlant(imageData);
}

// Simular análisis de planta (con IA real, aquí iría la llamada a API)
function analyzePlant(imageData) {
    // Mostrar loading
    captureBtn.disabled = true;
    captureBtn.textContent = '🔄 Analizando...';

    // Simular análisis (en producción, esto sería una llamada a API de IA)
    setTimeout(() => {
        const results = generateFakeDiagnosis();
        showResults(results);
        
        captureBtn.disabled = false;
        captureBtn.textContent = '📸 Tomar Foto';
    }, 2000);
}

// Generar diagnóstico simulado
function generateFakeDiagnosis() {
    const statuses = [
        {
            icon: '✅',
            title: 'Planta Saludable',
            description: 'Tu planta está en excelentes condiciones.',
            light: 'Buena',
            moisture: 'Adecuada',
            leaves: 'Verdes'
        },
        {
            icon: '⚠️',
            title: 'Necesita Atención',
            description: 'La planta muestra signos de estrés hídrico.',
            light: 'Excesiva',
            moisture: 'Baja',
            leaves: 'Amarillentas'
        },
        {
            icon: '🔴',
            title: 'Estado Crítico',
            description: 'Revisa urgentemente las condiciones de la planta.',
            light: 'Insuficiente',
            moisture: 'Muy Alta',
            leaves: 'Marchitas'
        }
    ];

    // Seleccionar aleatoriamente para la demo
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// Mostrar resultados
function showResults(data) {
    document.getElementById('statusIcon').textContent = data.icon;
    document.getElementById('statusTitle').textContent = data.title;
    document.getElementById('statusDescription').textContent = data.description;
    document.getElementById('lightStatus').textContent = data.light;
    document.getElementById('moistureStatus').textContent = data.moisture;
    document.getElementById('leavesStatus').textContent = data.leaves;

    cameraContainer.style.display = 'none';
    resultContainer.style.display = 'block';
}

// Seleccionar de galería (para iOS)
function selectFromGallery() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                analyzePlant(imageData);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Nueva foto
function resetApp() {
    cameraContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    // Reiniciar cámara
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    initCamera();
}

// Event listeners
captureBtn.addEventListener('click', capturePhoto);
galleryBtn.addEventListener('click', selectFromGallery);
newPhotoBtn.addEventListener('click', resetApp);

// Iniciar
initCamera();

// Registrar Service Worker (para PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('📱 Service Worker registrado');
            })
            .catch(err => {
                console.error('Error al registrar Service Worker:', err);
            });
    });
}

// Detectar iOS para mejor UX
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
if (isIOS) {
    document.querySelector('header p').textContent = '📱 Toma una foto para diagnosticar tu planta';
}