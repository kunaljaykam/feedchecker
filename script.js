const video = document.getElementById('video');
const audio = document.getElementById('audio');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const startAudioButton = document.getElementById('startAudioButton');
const stopAudioButton = document.getElementById('stopAudioButton');
let stream;
let audioStream;
let audioContext;
let sourceNode;
let delayNode;
let gainNode;

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

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (sourceNode) sourceNode.disconnect();
        if (delayNode) delayNode.disconnect();
        if (gainNode) gainNode.disconnect();

        sourceNode = audioContext.createMediaStreamSource(audioStream);
        delayNode = audioContext.createDelay();
        delayNode.delayTime.value = 0.5; // Set the delay time in seconds
        gainNode = audioContext.createGain();
        gainNode.gain.value = 1.0; // Set the volume (gain)

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
