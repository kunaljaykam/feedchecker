const video = document.getElementById('video');
const audio = document.getElementById('audio');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const startAudioButton = document.getElementById('startAudioButton');
const stopAudioButton = document.getElementById('stopAudioButton');
let stream;
let audioStream;

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
    } catch (error) {
        console.error('Error accessing audio devices.', error);
    }
});

stopAudioButton.addEventListener('click', () => {
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audio.srcObject = null;
    }
});
