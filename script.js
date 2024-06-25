const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const saveButton = document.getElementById('save');
const retakeButton = document.getElementById('retake');
const gallery = document.getElementById('gallery');
const toggleCameraButton = document.getElementById('toggleCamera');
const upload = document.getElementById('upload')
const checkConnection = document.getElementById('connectionCheck')

let stream;

function connectionCheck(){

    const url = 'https://879d-2001-f40-90b-261a-9d50-fc47-e9f4-aaf7.ngrok-free.app'

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
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
    
    url = 'https://879d-2001-f40-90b-261a-9d50-fc47-e9f4-aaf7.ngrok-free.app';

    const width = 1920;
    const height = 1080;

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




// function sendData(imageData){

//     // const url = 'https://01ed-2001-f40-90b-261a-c40e-51ae-5b6a-2675.ngrok-free.app';
//     const url = 'https://2db8-2001-f40-90b-261a-c1c0-46d9-22f2-6885.ngrok-free.app'
//     // const jsData = {Data: imageData};

//     // /predictStock
//     fetch(url + '/printHelloWorld', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         // body: JSON.stringify(jsData)
//         body: imageData
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Var data is the data from python server
//         // canvas_to_stock(JSON.parse(data));
//         console.log(data)
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }
// sendButton.addEventListener('click', () => {
//     console.log('Send Data')
//     const dataURL = canvas.toDataURL('image/png');
//     const img = document.createElement('img');
//     img.src = dataURL;
//     gallery.appendChild(img);

//     // Save the data URL to local storage
//     let images = JSON.parse(localStorage.getItem('images')) || [];
//     images.push(dataURL);
//     data = JSON.stringify(images)
//     // console.log(data)
//     sendData(data)
// });


// function sendData(imageData){

//     // const url = 'https://01ed-2001-f40-90b-261a-c40e-51ae-5b6a-2675.ngrok-free.app';
//     const url = 'https://2db8-2001-f40-90b-261a-c1c0-46d9-22f2-6885.ngrok-free.app'
//     // const jsData = {Data: imageData};

//     // /predictStock
//     fetch(url + '/sendImage', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         // body: JSON.stringify(jsData)
//         body: imageData
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Var data is the data from python server
//         // canvas_to_stock(JSON.parse(data));
//         console.log(data)
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// function sendData(imageData){
//     const url = 'https://2db8-2001-f40-90b-261a-c1c0-46d9-22f2-6885.ngrok-free.app/sendImage';

//     fetch(url,  {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         // body: JSON.stringify({ imageData: imageData }) // Send imageData as JSON
//         body: imageData // Send imageData as JSON
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json(); // Assuming server responds with JSON
//     })
//     .then(data => {
//         console.log('Received response from server:', data);
//         // Handle the response data as needed
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }