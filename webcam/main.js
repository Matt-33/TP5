const webcamSelect = document.getElementById('webcamSelect');
const validateWebcamButton = document.getElementById('validateWebcam');
const videoElement = document.getElementById('video');
const takePhotoButton = document.getElementById('takePhoto');
const photoElement = document.getElementById('photo');
const savePhotoButton = document.getElementById('savePhoto');

let videoStream;
let currentDeviceId = null;

// Fonction pour lister les webcams
async function getWebcams() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        console.log('Webcams détectées :', videoDevices);  // Debug pour vérifier les webcams

        if (videoDevices.length === 0) {
            console.warn('Aucune webcam détectée.');
        }

        videoDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label || `Webcam ${webcamSelect.length + 1}`;
            webcamSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des webcams :', error);
    }
}

// Demander l'autorisation de la webcam
async function requestPermissions() {
    try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Permission caméra accordée');
        getWebcams();  // Charger les webcams après avoir obtenu la permission
    } catch (error) {
        console.error('Erreur lors de la demande de permissions :', error);
    }
}

// Fonction pour démarrer le flux vidéo
async function startVideo(deviceId) {
    console.log('Démarrage du flux vidéo pour la webcam avec ID :', deviceId);

    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop()); // Stopper l'ancien flux s'il existe
    }

    const constraints = {
        video: {
            deviceId: deviceId ? { exact: deviceId } : undefined
        }
    };

    try {
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = videoStream;
        console.log('Flux vidéo démarré avec succès.');
        takePhotoButton.disabled = false; // Activer le bouton "Prendre une photo"
    } catch (error) {
        console.error('Erreur lors du démarrage du flux vidéo :', error);
    }
}

// Prendre une photo
function takePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');
    
    // Dessiner l'image de la vidéo dans le canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Récupérer les pixels de l'image
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Appliquer le filtre noir et blanc
    for (let i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        
        // Calcul du niveau de gris
        const gray = 0.3 * red + 0.59 * green + 0.11 * blue;
        
        // Appliquer le niveau de gris sur les 3 canaux (rouge, vert, bleu)
        pixels[i] = gray;     // Rouge
        pixels[i + 1] = gray; // Vert
        pixels[i + 2] = gray; // Bleu
    }

    // Remettre les pixels modifiés dans le canvas
    context.putImageData(imageData, 0, 0);

    // Mettre à jour l'image source avec l'image noir et blanc
    photoElement.src = canvas.toDataURL('image/png');
    photoElement.style.display = 'block';
    savePhotoButton.style.display = 'inline';
}

// Sauver la photo en téléchargement
function savePhoto() {
    const link = document.createElement('a');
    link.href = photoElement.src;
    link.download = 'photo.png';
    link.click();
}

// Événements
validateWebcamButton.addEventListener('click', () => {
    currentDeviceId = webcamSelect.value;
    console.log('Webcam sélectionnée :', currentDeviceId);
    if (currentDeviceId) {
        startVideo(currentDeviceId);
    } else {
        console.error('Aucune webcam sélectionnée.');
    }
});

takePhotoButton.addEventListener('click', takePhoto);
savePhotoButton.addEventListener('click', savePhoto);

// Charger les webcams à l'ouverture de la page en demandant la permission
requestPermissions();