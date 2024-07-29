const video = document.getElementById('video');
const audio = document.getElementById('audio');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const startAudioButton = document.getElementById('startAudioButton');
const stopAudioButton = document.getElementById('stopAudioButton');
const speedHeader = document.getElementById('speed-header');
let stream;
let audioStream;
let audioContext;
let sourceNode;
let delayNode;
let gainNode;

async function measureSingleRequestSpeed(testFileUrl, fileSizeInBytes) {
    const startTime = new Date().getTime();
    const response = await fetch(testFileUrl);
    const endTime = new Date().getTime();

    if (!response.ok) {
        throw new Error('Failed to download the test file.');
    }

    const durationInSeconds = (endTime - startTime) / 1000;
    const speedBps = fileSizeInBytes / durationInSeconds;
    return speedBps / (1024 * 1024); // Convert to Mbps
}

async function measureInternetSpeed() {
    const fileSizeInBytes = 1 * 1024 * 1024; // Size of the test file in bytes (1MB)
    const testFileUrl = `https://elasticbeanstalk-us-west-2-357568096535.s3.amazonaws.com/png-1mb.png?rand=${Math.random()}`;

    const numRequests = 5;
    let totalSpeedMbps = 0;

    for (let i = 0; i < numRequests; i++) {
        const speedMbps = await measureSingleRequestSpeed(testFileUrl, fileSizeInBytes);
        totalSpeedMbps += speedMbps;
    }

    const averageSpeedMbps = totalSpeedMbps / numRequests;
    return averageSpeedMbps;
}

async function updateSpeedHeader() {
    try {
        const speedMbps = await measureInternetSpeed();
        speedHeader.textContent = `Your internet speed is approximately ${speedMbps.toFixed(2)} Mbps.`;
    } catch (error) {
        speedHeader.textContent = 'Unable to determine internet speed.';
    }
}

// Check internet speed on page load
window.addEventListener('load', updateSpeedHeader);

startButton.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        audio.srcObject = stream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
});

stopButton.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        audio.srcObject = null;
    }
});

startAudioButton.addEventListener('click', async () => {
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audio.srcObject = audioStream;
        audio.play();

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (sourceNode) sourceNode.disconnect();
        if (delayNode) delayNode.disconnect();
        if (gainNode) gainNode.disconnect();

        sourceNode = audioContext.createMediaStreamSource(audioStream);
        delayNode = audioContext.createDelay();
        delayNode.delayTime.value = 0.5;
        gainNode = audioContext.createGain();
        gainNode.gain.value = 1.0;

        sourceNode.connect(delayNode);
        delayNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
    } catch (error) {
        console.error('Error accessing audio devices.', error);
    }
});

stopAudioButton.addEventListener('click', () => {
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audio.srcObject = null;

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }

        if (sourceNode) sourceNode.disconnect();
        if (delayNode) delayNode.disconnect();
        if (gainNode) gainNode.disconnect();

        sourceNode = null;
        delayNode = null;
        gainNode = null;
    }
});
