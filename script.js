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

// Notification elements
const checkNotificationPermissionBtn = document.getElementById('checkNotificationPermission');
const requestNotificationPermissionBtn = document.getElementById('requestNotificationPermission');
const testNotificationBtn = document.getElementById('testNotification');
const notificationStatus = document.getElementById('notificationStatus');

// Browser features elements
const cookieStatus = document.getElementById('cookieStatus');
const javascriptStatus = document.getElementById('javascriptStatus');
const localStorageStatus = document.getElementById('localStorageStatus');
const webrtcStatus = document.getElementById('webrtcStatus');
const webglStatus = document.getElementById('webglStatus');
const geolocationStatus = document.getElementById('geolocationStatus');
const checkGeolocationBtn = document.getElementById('checkGeolocation');
const audioOutputStatus = document.getElementById('audioOutputStatus');
const checkAudioDevicesBtn = document.getElementById('checkAudioDevices');

// async function measureSingleRequestSpeed(testFileUrl, fileSizeInBytes) {
//     const startTime = new Date().getTime();
//     const response = await fetch(testFileUrl);
//     const endTime = new Date().getTime();

//     if (!response.ok) {
//         throw new Error('Failed to download the test file.');
//     }

//     const durationInSeconds = (endTime - startTime) / 1000;
//     const speedBps = fileSizeInBytes / durationInSeconds;
//     return speedBps / (1024 * 1024); // Convert to Mbps
// }

// async function measureInternetSpeed() {
//     const fileSizeInBytes = 1 * 1024 * 1024; // Size of the test file in bytes (1MB)
//     const testFileUrl = `https://elasticbeanstalk-us-west-2-357568096535.s3.amazonaws.com/png-1mb.png?rand=${Math.random()}`;

//     const numRequests = 5;
//     let totalSpeedMbps = 0;

//     for (let i = 0; i < numRequests; i++) {
//         const speedMbps = await measureSingleRequestSpeed(testFileUrl, fileSizeInBytes);
//         totalSpeedMbps += speedMbps;
//     }

//     const averageSpeedMbps = totalSpeedMbps / numRequests;
//     return averageSpeedMbps;
// }

// async function updateSpeedHeader() {
//     try {
//         const speedMbps = await measureInternetSpeed();
//         speedHeader.textContent = `Your internet speed is approximately ${speedMbps.toFixed(2)} Mbps.`;
//     } catch (error) {
//         speedHeader.textContent = 'Unable to determine internet speed.';
//     }
// }

// // Check internet speed on page load
// window.addEventListener('load', updateSpeedHeader);

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

// Notification functions
function checkNotificationPermission() {
    if (!('Notification' in window)) {
        notificationStatus.textContent = 'Notifications not supported in this browser';
        return;
    }
    
    notificationStatus.textContent = `Current permission: ${Notification.permission}`;
}

async function requestPermission() {
    if (!('Notification' in window)) {
        notificationStatus.textContent = 'Notifications not supported in this browser';
        return;
    }
    
    try {
        const permission = await Notification.requestPermission();
        notificationStatus.textContent = `Permission: ${permission}`;
    } catch (error) {
        notificationStatus.textContent = `Error requesting permission: ${error}`;
    }
}

function testNotification() {
    if (!('Notification' in window)) {
        notificationStatus.textContent = 'Notifications not supported in this browser';
        return;
    }
    
    if (Notification.permission !== 'granted') {
        notificationStatus.textContent = 'Permission not granted. Please request permission first.';
        return;
    }
    
    try {
        // Create audio for notification - iPhone-like text message sound
        const audio = new Audio();
        // iPhone SMS notification sound (base64 encoded)
        audio.src = 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGFtZQAAAA8AAAAeAAAgPgAGBgYGBgYGBgYGIiIiIiIiIiIiIjQ0NDQ0NDQ0NDRGRkZGRkZGRkZGWFhYWFhYWFhYWGpqampqampqamqAgICAgICAgICAlpaWlpaWlpaWlqioqKioqKioqKi6urq6urq6urq6zMzMzMzMzMzMzN7e3t7e3t7e3t7e8PDw8PDw8PDw8P////////8AAAA5TEFNRTMuOTlyAaUAAAAALlgAABRAJASwQgAAQAAAID49CzzQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kMQAAAeIHEtQSACJ3KL6h2FAEHme3Wb3IJFrCBIZvtgIMm2Aha9lzOUoiQdFxDCLu00K1PrMoaVNLH45FIlTLvnY+iko1dqkXfPf8gPfl++CgKnPLyPHvKCpz56/LwUFTnQKCp/5fH4KG7oFBUAAAAAAfPQ62MbwzaOOp9EMPikAAzaRiIrjahZtWe7sBaWRwFoKFszeFYzXvLcQeHhzMmmlqHImUv2lql65ak1MpVkdR8ZmcFYQgRNRzz4EfUEpADiiBARbdRIREAAZuJwXCgAEAAgAEADxAPgAB//+gPgACIf/9AgICf/+AgIC//0CAgJ//gICAnwAAHwfB8Q//w+D4Pg+ICAg+D4Pg+D4Pi//w+D4Pg+D4Pg+ICAg+D4Pg+D4Pi//w+D4Pg+D4Pg+ICAg+D4Pg+D4Pg+ICAg+D4Pg+D4Pi//L5fL5fL5fL5f/8vl8vl8gIAA/+XhDlIQ5f//wiEOUjsdhnH//CIQ5SN/wbB8H//Bjsdjsdj/+DYPg+IP/4M//g//4/P/4A//+Af//wY7HY7HY7HYZ/M5nM5nM5nM5nM5//M5nM5n//Avl8vl8vlIAA';
        audio.play();
        
        // Create notification
        const notification = new Notification('FeedChecker Notification Test', {
            body: 'This is a test notification with sound',
            icon: 'assets/FeedChecker.png'
        });
        
        notificationStatus.textContent = 'Notification sent with sound!';
    } catch (error) {
        notificationStatus.textContent = `Error sending notification: ${error}`;
    }
}

// Browser features check functions
function checkBrowserFeatures() {
    // Check cookies
    checkCookies();
    
    // JavaScript is obviously enabled
    javascriptStatus.classList.add('enabled');
    
    // Check localStorage
    checkLocalStorage();
    
    // Check WebRTC
    checkWebRTC();
    
    // Check WebGL
    checkWebGL();
}

function checkCookies() {
    const testCookie = 'testcookie=1';
    document.cookie = testCookie;
    const cookiesEnabled = document.cookie.indexOf(testCookie) !== -1;
    
    cookieStatus.classList.add(cookiesEnabled ? 'enabled' : 'disabled');
}

function checkLocalStorage() {
    let localStorageEnabled = false;
    
    try {
        localStorage.setItem('test', 'test');
        localStorageEnabled = localStorage.getItem('test') === 'test';
        localStorage.removeItem('test');
    } catch (e) {
        localStorageEnabled = false;
    }
    
    localStorageStatus.classList.add(localStorageEnabled ? 'enabled' : 'disabled');
}

function checkWebRTC() {
    const webrtcEnabled = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    webrtcStatus.classList.add(webrtcEnabled ? 'enabled' : 'disabled');
}

function checkWebGL() {
    let webglEnabled = false;
    
    try {
        const canvas = document.createElement('canvas');
        webglEnabled = !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        webglEnabled = false;
    }
    
    webglStatus.classList.add(webglEnabled ? 'enabled' : 'disabled');
}

function checkGeolocation() {
    if ('geolocation' in navigator) {
        geolocationStatus.classList.add('enabled');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                geolocationStatus.classList.add('enabled');
            },
            (error) => {
                geolocationStatus.classList.remove('enabled');
                geolocationStatus.classList.add('disabled');
            }
        );
    } else {
        geolocationStatus.classList.add('disabled');
    }
}

async function checkAudioDevices() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            audioOutputStatus.classList.add('disabled');
            return;
        }
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
        
        if (audioOutputDevices.length > 0) {
            audioOutputStatus.classList.add('enabled');
        } else {
            audioOutputStatus.classList.add('disabled');
        }
    } catch (error) {
        audioOutputStatus.classList.add('disabled');
    }
}

// Event listeners for notification buttons
checkNotificationPermissionBtn.addEventListener('click', checkNotificationPermission);
requestNotificationPermissionBtn.addEventListener('click', requestPermission);
testNotificationBtn.addEventListener('click', testNotification);

// Event listeners for browser feature checks
checkGeolocationBtn.addEventListener('click', checkGeolocation);
checkAudioDevicesBtn.addEventListener('click', checkAudioDevices);

// Initialize browser features check on page load
window.addEventListener('load', checkBrowserFeatures);
