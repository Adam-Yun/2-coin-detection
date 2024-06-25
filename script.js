const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const saveButton = document.getElementById('save');
const retakeButton = document.getElementById('retake');
const gallery = document.getElementById('gallery');
const toggleCameraButton = document.getElementById('toggleCamera');
const upload = document.getElementById('upload')
const checkConnection = document.getElementById('connectionCheck')
const url = 'https://9d98-2001-f40-90b-261a-6d1f-7d57-f96d-2ec4.ngrok-free.app'

let stream;

function connectionCheck(){

    fetch(url + '/connectionCheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsData)
        body: "JS Connection Check"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Var data is the data from python server
        console.log(data)
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function startCamera() {
    try {

        // const constraints = {
        //     video: true
        // };

        const constraints = {
            video: {
                // facingMode: 'environment', // 'user' for front camera, 'environment' for back camera
                // width: { min: 640, ideal: 1280, max: 1920 },
                // height: { min: 480, ideal: 720, max: 1080 },
                
                facingMode: { ideal: 'environment' },
                focusDistance: { min: 0.05, ideal: 0.12, max: 0.3 }
            }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.style.display = 'block';
        toggleCameraButton.textContent = 'Turn Off Camera';
        captureButton.style.display = 'inline-block';
    } catch (error) {
        console.error('Error accessing the camera: ', error);
    }
}

function stopCamera() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        video.style.display = 'none';
        toggleCameraButton.textContent = 'Turn On Camera';
        captureButton.style.display = 'none';
    }
}

toggleCameraButton.addEventListener('click', () => {
    if (stream) {
        stopCamera();
        stream = null;
    } else {
        startCamera();
    }
});

captureButton.addEventListener('click', () => {
    captureButtonFunction();
});

retakeButton.addEventListener('click', () => {
    video.style.display = 'block';
    canvas.style.display = 'none';
    saveButton.style.display = 'none';
    retakeButton.style.display = 'none';
    captureButton.style.display = 'inline-block';
});

saveButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = dataURL;
    gallery.appendChild(img);

    // Save the data URL to local storage
    let images = JSON.parse(localStorage.getItem('images')) || [];
    images.push(dataURL);
    localStorage.setItem('images', JSON.stringify(images));

    // Reset to capturing mode
    retakeButton.click();
});

window.addEventListener('load', () => {
    // Load saved images from local storage
    let images = JSON.parse(localStorage.getItem('images')) || [];
    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        gallery.appendChild(img);
    });
});

upload.addEventListener('click', () => {

    // const width = 1920;
    // const height = 1080;

    const width = 1000;
    const height = 800;

    canvas.width = width;
    canvas.height = height;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 encoded image
    image_quality = 1;
    const imageData = canvas.toDataURL('image/jpeg',image_quality);

    fetch(url + '/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_data: imageData })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

});

checkConnection.addEventListener('click', () => {
    connectionCheck()
});

function captureButtonFunction(){
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip the context horizontally
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    video.style.display = 'none';
    canvas.style.display = 'block';
    saveButton.style.display = 'inline-block';
    retakeButton.style.display = 'inline-block';
    captureButton.style.display = 'none';
}