const video = document.getElementById('video');
const audio = document.getElementById('audio');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let stream;

startButton.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length > 0) {
            audio.srcObject = new MediaStream(audioTracks);
        } else {
            console.error('No audio tracks found.');
        }
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
