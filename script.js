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

// File Generator elements
const fileSizeInput = document.getElementById('fileSize');
const fileTypeSelect = document.getElementById('fileType');
const fileNameInput = document.getElementById('fileName');
const generateFileButton = document.getElementById('generateFileButton');
const generationStatus = document.getElementById('generationStatus');
const downloadLinkContainer = document.getElementById('downloadLink');

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

// File Generator Functions
function generateRandomData(sizeInBytes) {
    const chunkSize = 1024 * 1024; // 1MB chunks to avoid memory issues
    const chunks = Math.ceil(sizeInBytes / chunkSize);
    const data = new Uint8Array(sizeInBytes);
    
    let offset = 0;
    for (let i = 0; i < chunks; i++) {
        const size = Math.min(chunkSize, sizeInBytes - offset);
        const chunk = new Uint8Array(size);
        
        for (let j = 0; j < size; j++) {
            chunk[j] = Math.floor(Math.random() * 256);
        }
        
        data.set(chunk, offset);
        offset += size;
    }
    
    return data;
}

function generateAudioFile(sizeInMB) {
    // Create a simple WAV header (44 bytes)
    const sampleRate = 44100;
    const numChannels = 2;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const dataSize = Math.floor(sizeInMB * 1024 * 1024) - 44; // Subtract header size
    
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    
    // "RIFF" chunk descriptor
    view.setUint8(0, 'R'.charCodeAt(0));
    view.setUint8(1, 'I'.charCodeAt(0));
    view.setUint8(2, 'F'.charCodeAt(0));
    view.setUint8(3, 'F'.charCodeAt(0));
    view.setUint32(4, 36 + dataSize, true); // File size - 8
    view.setUint8(8, 'W'.charCodeAt(0));
    view.setUint8(9, 'A'.charCodeAt(0));
    view.setUint8(10, 'V'.charCodeAt(0));
    view.setUint8(11, 'E'.charCodeAt(0));
    
    // "fmt " sub-chunk
    view.setUint8(12, 'f'.charCodeAt(0));
    view.setUint8(13, 'm'.charCodeAt(0));
    view.setUint8(14, 't'.charCodeAt(0));
    view.setUint8(15, ' '.charCodeAt(0));
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, byteRate, true); // ByteRate
    view.setUint16(32, blockAlign, true); // BlockAlign
    view.setUint16(34, bitsPerSample, true); // BitsPerSample
    
    // "data" sub-chunk
    view.setUint8(36, 'd'.charCodeAt(0));
    view.setUint8(37, 'a'.charCodeAt(0));
    view.setUint8(38, 't'.charCodeAt(0));
    view.setUint8(39, 'a'.charCodeAt(0));
    view.setUint32(40, dataSize, true); // Subchunk2Size
    
    // Fill the data with a simple sine wave pattern to make it playable
    const audioData = new Int16Array(buffer, 44);
    const numSamples = dataSize / 2;
    const frequency = 440; // A4 note in Hz
    
    for (let i = 0; i < numSamples; i++) {
        // Generate a sine wave with some variation to make it sound more interesting
        const t = i / sampleRate;
        const value = Math.sin(2 * Math.PI * frequency * t) * 0.5 + 
                     Math.sin(2 * Math.PI * (frequency * 1.5) * t) * 0.3 +
                     Math.sin(2 * Math.PI * (frequency * 2) * t) * 0.2;
        
        // Convert to 16-bit PCM
        audioData[i] = Math.floor(value * 32767);
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
}

function generateVideoFile(sizeInMB) {
    // For video, we'll use a WebM container with VP8 video
    // This is more complex, so we'll use a canvas to generate a real video
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    
    // Create a MediaRecorder to capture the canvas
    const stream = canvas.captureStream(30); // 30 FPS
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: sizeInMB * 8 * 1024 * 1024 / 5 // Target bitrate for ~5 seconds
    });
    
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            chunks.push(e.data);
        }
    };
    
    return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            
            // If the blob is smaller than requested, pad it with random data
            if (blob.size < sizeInMB * 1024 * 1024) {
                const paddingSize = Math.floor(sizeInMB * 1024 * 1024) - blob.size;
                const padding = generateRandomData(paddingSize);
                
                // Combine the real video with padding
                const combined = new Blob([blob, padding], { type: 'video/webm' });
                resolve(combined);
            } else {
                resolve(blob);
            }
        };
        
        // Start recording
        mediaRecorder.start(100);
        
        // Draw frames with changing content
        let frameCount = 0;
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        
        function drawFrame() {
            if (frameCount >= 150) { // 5 seconds at 30fps
                mediaRecorder.stop();
                return;
            }
            
            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw a colored rectangle that changes
            const colorIndex = Math.floor(frameCount / 25) % colors.length;
            ctx.fillStyle = colors[colorIndex];
            ctx.fillRect(50, 50, 220, 140);
            
            // Draw text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '20px Arial';
            ctx.fillText(`Test Video ${Math.floor(sizeInMB)}MB`, 80, 100);
            ctx.fillText(`Frame: ${frameCount}`, 80, 140);
            
            frameCount++;
            requestAnimationFrame(drawFrame);
        }
        
        drawFrame();
    });
}

function generatePdfFile(sizeInMB) {
    // Create a minimal but valid PDF file
    // PDF structure based on the PDF 1.7 specification
    
    // PDF header
    let pdf = '%PDF-1.7\n';
    
    // Object 1: Catalog
    pdf += '1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n';
    
    // Object 2: Pages
    pdf += '2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n';
    
    // Object 3: Page
    pdf += '3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n';
    
    // Object 4: Font
    pdf += '4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n';
    
    // Generate content for the PDF
    let content = 'BT\n/F1 24 Tf\n100 700 Td\n(FeedChecker Test PDF File) Tj\nET\n';
    content += 'BT\n/F1 12 Tf\n100 650 Td\n(This is a test PDF file generated for testing purposes.) Tj\nET\n';
    content += `BT\n/F1 12 Tf\n100 630 Td\n(File size: ${sizeInMB} MB) Tj\nET\n`;
    content += `BT\n/F1 12 Tf\n100 610 Td\n(Generated on: ${new Date().toLocaleString()}) Tj\nET\n`;
    
    // Add some lorem ipsum text
    const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    
    let y = 570;
    for (let i = 0; i < 10; i++) {
        content += `BT\n/F1 10 Tf\n100 ${y} Td\n(${loremIpsum}) Tj\nET\n`;
        y -= 20;
    }
    
    // Object 5: Content Stream
    pdf += `5 0 obj\n<<\n/Length ${content.length}\n>>\nstream\n${content}\nendstream\nendobj\n`;
    
    // Cross-reference table
    const xrefOffset = pdf.length;
    pdf += 'xref\n0 6\n';
    pdf += '0000000000 65535 f \n';
    
    // Calculate offsets for each object
    const offsets = [];
    let pos = 0;
    let parts = pdf.split(/(?=\d+ 0 obj)/);
    
    pos = parts[0].length;
    for (let i = 1; i < parts.length; i++) {
        offsets.push(pos);
        pos += parts[i].length;
    }
    
    // Add object offsets to xref table
    for (let i = 0; i < offsets.length; i++) {
        pdf = pdf.replace(`xref\n0 6\n0000000000 65535 f `, 
                          `xref\n0 6\n0000000000 65535 f \n${offsets[i].toString().padStart(10, '0')} 00000 n `);
    }
    
    // Trailer
    pdf += 'trailer\n<<\n/Size 6\n/Root 1 0 R\n>>\n';
    pdf += `startxref\n${xrefOffset}\n`;
    pdf += '%%EOF\n';
    
    // Calculate how much padding we need
    const targetSize = Math.floor(sizeInMB * 1024 * 1024);
    const currentSize = pdf.length;
    const paddingSize = targetSize - currentSize;
    
    if (paddingSize > 0) {
        // Add padding as a comment
        let padding = '%';
        for (let i = 0; i < paddingSize - 3; i++) {
            padding += ' ';
        }
        padding += '\n';
        
        // Insert padding before the EOF marker
        const eofPos = pdf.lastIndexOf('%%EOF');
        pdf = pdf.substring(0, eofPos) + padding + pdf.substring(eofPos);
    }
    
    return new Blob([pdf], { type: 'application/pdf' });
}

function generateTextFile(sizeInMB) {
    // Generate a text file with readable content
    const targetSizeBytes = Math.floor(sizeInMB * 1024 * 1024);
    
    // Start with a header
    let content = `FeedChecker Test Text File
Generated: ${new Date().toLocaleString()}
Target Size: ${sizeInMB} MB
-----------------------------------------

`;
    
    // Add some lorem ipsum paragraphs
    const loremIpsumParagraphs = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."
    ];
    
    // Add paragraphs until we get close to the target size
    while (content.length < targetSizeBytes - 1000) {
        const paragraph = loremIpsumParagraphs[Math.floor(Math.random() * loremIpsumParagraphs.length)];
        content += paragraph + "\n\n";
    }
    
    // Add line numbers to pad to exact size
    let lineNumber = 1;
    while (content.length < targetSizeBytes) {
        content += `Line ${lineNumber}: This is filler text to reach the exact file size.\n`;
        lineNumber++;
    }
    
    // Trim if we went over
    if (content.length > targetSizeBytes) {
        content = content.substring(0, targetSizeBytes);
    }
    
    return new Blob([content], { type: 'text/plain' });
}

async function generateFile() {
    const fileSize = parseFloat(fileSizeInput.value);
    const fileType = fileTypeSelect.value;
    
    // Security check: Validate input values
    if (isNaN(fileSize) || fileSize <= 0 || fileSize > 100) {
        generationStatus.textContent = 'Please enter a valid file size between 0.1 and 100 MB';
        return;
    }
    
    // Security check: Validate file type
    const validFileTypes = ['audio', 'video', 'pdf', 'text'];
    if (!validFileTypes.includes(fileType)) {
        generationStatus.textContent = 'Invalid file type selected';
        return;
    }
    
    // Set a reasonable timeout for large files
    const timeoutSeconds = Math.min(30, Math.max(5, Math.ceil(fileSize / 10)));
    
    generationStatus.textContent = `Generating ${fileSize}MB ${fileType} file...`;
    downloadLinkContainer.innerHTML = '';
    
    try {
        // Use setTimeout to allow the UI to update before the heavy processing
        setTimeout(async () => {
            try {
                let blob;
                let extension;

                // Set a maximum size for browser memory safety
                const safeFileSize = Math.min(fileSize, 100);

                switch (fileType) {
                    case 'audio':
                        blob = generateAudioFile(safeFileSize);
                        extension = 'wav';
                        break;
                    case 'video':
                        blob = await generateVideoFile(safeFileSize);
                        extension = 'webm';
                        break;
                    case 'pdf':
                        blob = generatePdfFile(safeFileSize);
                        extension = 'pdf';
                        break;
                    case 'text':
                        blob = generateTextFile(safeFileSize);
                        extension = 'txt';
                        break;
                    default:
                        throw new Error('Invalid file type selected');
                }

                // Build the file name from the input, falling back to the default;
                // re-run at click time so renames after generation still apply
                const buildFileName = () => {
                    let baseName = fileNameInput.value
                        .replace(/[\\/:*?"<>|]/g, '')
                        .replace(/^\.+/, '')
                        .trim();
                    if (!baseName) {
                        baseName = `sample-${safeFileSize}MB`;
                    }
                    // Avoid a doubled extension if the user typed one
                    if (baseName.toLowerCase().endsWith(`.${extension}`)) {
                        baseName = baseName.slice(0, -(extension.length + 1));
                    }
                    return `${baseName}.${extension}`;
                };
                const fileName = buildFileName();
                
                // Security check: Verify blob was created successfully
                if (!blob || !(blob instanceof Blob)) {
                    throw new Error('Failed to generate file');
                }
                
                // Create URL and revoke it after download to prevent memory leaks
                const url = URL.createObjectURL(blob);
                const actualSize = (blob.size / (1024 * 1024)).toFixed(2);
                
                generationStatus.textContent = `File generated successfully! Actual size: ${actualSize} MB`;
                
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = fileName;
                downloadLink.textContent = `Download ${fileName}`;
                
                // Add event listener to revoke the object URL after download
                downloadLink.addEventListener('click', () => {
                    downloadLink.download = buildFileName();
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 100);
                });

                downloadLinkContainer.appendChild(downloadLink);

                // Keep the link in sync if the name is changed after generation
                activeDownloadLink = downloadLink;
                activeBuildFileName = buildFileName;
                
            } catch (error) {
                generationStatus.textContent = `Error generating file: ${error.message}`;
                console.error('File generation error:', error);
            }
        }, 100);
        
        // Set timeout to prevent infinite processing
        setTimeout(() => {
            if (generationStatus.textContent.includes('Generating')) {
                generationStatus.textContent = 'File generation timed out. Try a smaller file size.';
            }
        }, timeoutSeconds * 1000);
        
    } catch (error) {
        generationStatus.textContent = `Error: ${error.message}`;
        console.error('File generation error:', error);
    }
}

// Event listener for file generation
generateFileButton.addEventListener('click', generateFile);

// Keep the file name placeholder in sync with the default name
fileSizeInput.addEventListener('input', () => {
    const size = parseFloat(fileSizeInput.value);
    fileNameInput.placeholder = (!isNaN(size) && size > 0)
        ? `sample-${Math.min(size, 100)}MB`
        : 'sample-1MB';
});

// Update the current download link when the file name is edited after generation
let activeDownloadLink = null;
let activeBuildFileName = null;

fileNameInput.addEventListener('input', () => {
    if (activeDownloadLink && activeBuildFileName) {
        const name = activeBuildFileName();
        activeDownloadLink.download = name;
        activeDownloadLink.textContent = `Download ${name}`;
    }
});

// ── Image Combiner ────────────────────────────────────────────────────────────

const imageInput1 = document.getElementById('imageInput1');
const imageInput2 = document.getElementById('imageInput2');
const imagePreview1 = document.getElementById('imagePreview1');
const imagePreview2 = document.getElementById('imagePreview2');
const imagePlaceholder1 = document.getElementById('imagePlaceholder1');
const imagePlaceholder2 = document.getElementById('imagePlaceholder2');
const combineLayout = document.getElementById('combineLayout');
const combineFormat = document.getElementById('combineFormat');
const combineImagesButton = document.getElementById('combineImagesButton');
const combinerStatus = document.getElementById('combinerStatus');
const combinerDownload = document.getElementById('combinerDownload');

let loadedImage1 = null;
let loadedImage2 = null;

function loadImageFromFile(file, imgEl, placeholderEl) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                imgEl.src = e.target.result;
                imgEl.style.display = 'block';
                placeholderEl.style.display = 'none';
                resolve(img);
            };
            img.onerror = () => reject(new Error('Failed to decode image'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

imageInput1.addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        try {
            loadedImage1 = await loadImageFromFile(e.target.files[0], imagePreview1, imagePlaceholder1);
        } catch (err) {
            combinerStatus.textContent = `Error loading image 1: ${err.message}`;
        }
    }
});

imageInput2.addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        try {
            loadedImage2 = await loadImageFromFile(e.target.files[0], imagePreview2, imagePlaceholder2);
        } catch (err) {
            combinerStatus.textContent = `Error loading image 2: ${err.message}`;
        }
    }
});

function setupDropZone(dropZoneId, imgEl, placeholderEl, slot) {
    const zone = document.getElementById(dropZoneId);
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', async (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) {
            try {
                const img = await loadImageFromFile(file, imgEl, placeholderEl);
                if (slot === 1) loadedImage1 = img;
                else loadedImage2 = img;
            } catch (err) {
                combinerStatus.textContent = `Error loading image: ${err.message}`;
            }
        }
    });
}

setupDropZone('dropZone1', imagePreview1, imagePlaceholder1, 1);
setupDropZone('dropZone2', imagePreview2, imagePlaceholder2, 2);

// Auto-switch to PDF when "Separate Pages" layout is chosen
combineLayout.addEventListener('change', () => {
    if (combineLayout.value === 'pages') {
        combineFormat.value = 'pdf';
    }
});

function drawCombinedCanvas(img1, img2, layout) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (layout === 'side-by-side') {
        canvas.width = img1.naturalWidth + img2.naturalWidth;
        canvas.height = Math.max(img1.naturalHeight, img2.naturalHeight);
        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, img1.naturalWidth, 0);
    } else {
        canvas.width = Math.max(img1.naturalWidth, img2.naturalWidth);
        canvas.height = img1.naturalHeight + img2.naturalHeight;
        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, 0, img1.naturalHeight);
    }

    return canvas;
}

async function imageToJpegBytes(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 1.0));
    return new Uint8Array(await blob.arrayBuffer());
}

function bytesToAsciiHex(bytes) {
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, '0').toUpperCase();
    }
    return hex + '>'; // ASCIIHex end-of-data marker
}

function pdfImageXObject(objId, w, h, hexData) {
    return (
        `${objId} 0 obj\n` +
        `<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h}` +
        ` /ColorSpace /DeviceRGB /BitsPerComponent 8` +
        ` /Filter [/ASCIIHexDecode /DCTDecode] /Length ${hexData.length} >>\n` +
        `stream\n${hexData}\nendstream\nendobj\n`
    );
}

function buildXref(offsets, count) {
    let xref = `xref\n0 ${count}\n`;
    xref += '0000000000 65535 f \n';
    for (let i = 1; i < count; i++) {
        xref += offsets[i].toString().padStart(10, '0') + ' 00000 n \n';
    }
    return xref;
}

async function buildPDF(img1, img2, layout) {
    if (layout === 'pages') {
        // Two-page PDF — one image per page
        const [bytes1, bytes2] = await Promise.all([imageToJpegBytes(img1), imageToJpegBytes(img2)]);
        const hex1 = bytesToAsciiHex(bytes1);
        const hex2 = bytesToAsciiHex(bytes2);
        const w1 = img1.naturalWidth, h1 = img1.naturalHeight;
        const w2 = img2.naturalWidth, h2 = img2.naturalHeight;

        const offsets = new Array(9).fill(0);
        let pdf = '%PDF-1.4\n';

        offsets[1] = pdf.length;
        pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

        offsets[2] = pdf.length;
        pdf += '2 0 obj\n<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>\nendobj\n';

        offsets[3] = pdf.length;
        pdf += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w1} ${h1}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>\nendobj\n`;

        const c1 = `q\n${w1} 0 0 ${h1} 0 0 cm\n/Im1 Do\nQ\n`;
        offsets[4] = pdf.length;
        pdf += `4 0 obj\n<< /Length ${c1.length} >>\nstream\n${c1}\nendstream\nendobj\n`;

        offsets[5] = pdf.length;
        pdf += pdfImageXObject(5, w1, h1, hex1);

        offsets[6] = pdf.length;
        pdf += `6 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w2} ${h2}] /Contents 7 0 R /Resources << /XObject << /Im2 8 0 R >> >> >>\nendobj\n`;

        const c2 = `q\n${w2} 0 0 ${h2} 0 0 cm\n/Im2 Do\nQ\n`;
        offsets[7] = pdf.length;
        pdf += `7 0 obj\n<< /Length ${c2.length} >>\nstream\n${c2}\nendstream\nendobj\n`;

        offsets[8] = pdf.length;
        pdf += pdfImageXObject(8, w2, h2, hex2);

        const xrefOffset = pdf.length;
        pdf += buildXref(offsets, 9);
        pdf += `trailer\n<< /Size 9 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

        return new Blob([pdf], { type: 'application/pdf' });
    } else {
        // Single-page PDF with both images combined on one canvas
        const canvas = drawCombinedCanvas(img1, img2, layout);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 1.0));
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const hexData = bytesToAsciiHex(bytes);
        const pw = canvas.width, ph = canvas.height;

        const offsets = new Array(6).fill(0);
        let pdf = '%PDF-1.4\n';

        offsets[1] = pdf.length;
        pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

        offsets[2] = pdf.length;
        pdf += '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';

        offsets[3] = pdf.length;
        pdf += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Contents 4 0 R /Resources << /XObject << /Im0 5 0 R >> >> >>\nendobj\n`;

        const content = `q\n${pw} 0 0 ${ph} 0 0 cm\n/Im0 Do\nQ\n`;
        offsets[4] = pdf.length;
        pdf += `4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`;

        offsets[5] = pdf.length;
        pdf += pdfImageXObject(5, pw, ph, hexData);

        const xrefOffset = pdf.length;
        pdf += buildXref(offsets, 6);
        pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

        return new Blob([pdf], { type: 'application/pdf' });
    }
}

combineImagesButton.addEventListener('click', async () => {
    if (!loadedImage1 || !loadedImage2) {
        combinerStatus.textContent = 'Please select both images before combining.';
        return;
    }

    const layout = combineLayout.value;
    const format = combineFormat.value;

    if (layout === 'pages' && format !== 'pdf') {
        combinerStatus.textContent = 'Separate pages layout requires PDF output. Switching to PDF.';
        combineFormat.value = 'pdf';
        return;
    }

    combinerStatus.textContent = 'Combining images…';
    combinerDownload.innerHTML = '';

    try {
        let blob, fileName;

        if (format === 'pdf') {
            blob = await buildPDF(loadedImage1, loadedImage2, layout);
            fileName = 'combined.pdf';
        } else {
            const canvas = drawCombinedCanvas(loadedImage1, loadedImage2, layout);

            if (format === 'png') {
                blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                fileName = 'combined.png';
            } else if (format === 'webp') {
                blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 1.0));
                fileName = 'combined.webp';
            } else {
                blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 1.0));
                fileName = 'combined.jpg';
            }
        }

        const url = URL.createObjectURL(blob);
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        combinerStatus.textContent = `Done! Output size: ${sizeMB} MB`;

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.textContent = `Download ${fileName}`;
        link.addEventListener('click', () => setTimeout(() => URL.revokeObjectURL(url), 100));
        combinerDownload.appendChild(link);
    } catch (err) {
        combinerStatus.textContent = `Error: ${err.message}`;
        console.error('Image combiner error:', err);
    }
});

// ── Image Compressor ──────────────────────────────────────────────────────────

const compressImageInput = document.getElementById('compressImageInput');
const compressImagePreview = document.getElementById('compressImagePreview');
const compressImagePlaceholder = document.getElementById('compressImagePlaceholder');
const compressQuality = document.getElementById('compressQuality');
const compressFormat = document.getElementById('compressFormat');
const compressImageButton = document.getElementById('compressImageButton');
const compressorStatus = document.getElementById('compressorStatus');
const compressorDownload = document.getElementById('compressorDownload');

let loadedCompressImage = null;

compressImageInput.addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        try {
            loadedCompressImage = await loadImageFromFile(e.target.files[0], compressImagePreview, compressImagePlaceholder);
            compressorStatus.textContent = `Original size: ${(e.target.files[0].size / 1024).toFixed(1)} KB`;
        } catch (err) {
            compressorStatus.textContent = `Error loading image: ${err.message}`;
        }
    }
});

const compressZone = document.getElementById('compressDropZone');
compressZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    compressZone.classList.add('drag-over');
});
compressZone.addEventListener('dragleave', () => compressZone.classList.remove('drag-over'));
compressZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    compressZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
        try {
            loadedCompressImage = await loadImageFromFile(file, compressImagePreview, compressImagePlaceholder);
            compressorStatus.textContent = `Original size: ${(file.size / 1024).toFixed(1)} KB`;
        } catch (err) {
            compressorStatus.textContent = `Error loading image: ${err.message}`;
        }
    }
});

compressImageButton.addEventListener('click', async () => {
    if (!loadedCompressImage) {
        compressorStatus.textContent = 'Please select an image first.';
        return;
    }

    const quality = parseFloat(compressQuality.value);
    const format = compressFormat.value;
    const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg';
    const ext = format === 'webp' ? 'webp' : 'jpg';

    compressorStatus.textContent = 'Compressing…';
    compressorDownload.innerHTML = '';

    try {
        const canvas = document.createElement('canvas');
        canvas.width = loadedCompressImage.naturalWidth;
        canvas.height = loadedCompressImage.naturalHeight;
        canvas.getContext('2d').drawImage(loadedCompressImage, 0, 0);

        const blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, quality));
        const url = URL.createObjectURL(blob);
        const sizeKB = (blob.size / 1024).toFixed(1);

        compressorStatus.textContent = `Done! Compressed size: ${sizeKB} KB`;

        const link = document.createElement('a');
        link.href = url;
        link.download = `compressed.${ext}`;
        link.textContent = `Download compressed.${ext}`;
        link.addEventListener('click', () => setTimeout(() => URL.revokeObjectURL(url), 100));
        compressorDownload.appendChild(link);
    } catch (err) {
        compressorStatus.textContent = `Error: ${err.message}`;
        console.error('Image compressor error:', err);
    }
});

// ── Video Compressor ──────────────────────────────────────────────────────────

const compressVideoInput = document.getElementById('compressVideoInput');
const compressVideoPreview = document.getElementById('compressVideoPreview');
const compressVideoPlaceholder = document.getElementById('compressVideoPlaceholder');
const videoCompressQuality = document.getElementById('videoCompressQuality');
const videoCompressResolution = document.getElementById('videoCompressResolution');
const compressVideoButton = document.getElementById('compressVideoButton');
const videoCompressorStatus = document.getElementById('videoCompressorStatus');
const videoCompressorDownload = document.getElementById('videoCompressorDownload');

let loadedCompressVideo = null;
let videoCompressing = false;

function formatFileSize(bytes) {
    return bytes >= 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
        : `${(bytes / 1024).toFixed(1)} KB`;
}

function loadCompressVideo(file) {
    if (videoCompressing) return;
    if (!file.type.startsWith('video/')) {
        videoCompressorStatus.textContent = 'Error loading video: File is not a video';
        return;
    }
    if (compressVideoPreview.src) URL.revokeObjectURL(compressVideoPreview.src);
    const url = URL.createObjectURL(file);
    compressVideoPreview.onloadedmetadata = () => {
        loadedCompressVideo = { file, url, duration: compressVideoPreview.duration };
        compressVideoPreview.style.display = 'block';
        compressVideoPlaceholder.style.display = 'none';
        const res = `${compressVideoPreview.videoWidth}×${compressVideoPreview.videoHeight}`;
        videoCompressorStatus.textContent = `Original size: ${formatFileSize(file.size)} (${res}, ${compressVideoPreview.duration.toFixed(1)}s)`;
    };
    compressVideoPreview.onerror = () => {
        loadedCompressVideo = null;
        videoCompressorStatus.textContent = 'Error loading video: this format is not supported by your browser';
    };
    videoCompressorDownload.innerHTML = '';
    compressVideoPreview.src = url;
}

compressVideoInput.addEventListener('change', (e) => {
    if (e.target.files[0]) loadCompressVideo(e.target.files[0]);
});

const compressVideoZone = document.getElementById('compressVideoDropZone');
compressVideoZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    compressVideoZone.classList.add('drag-over');
});
compressVideoZone.addEventListener('dragleave', () => compressVideoZone.classList.remove('drag-over'));
compressVideoZone.addEventListener('drop', (e) => {
    e.preventDefault();
    compressVideoZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) loadCompressVideo(file);
});

function pickRecorderMimeType() {
    const candidates = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
    ];
    return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
}

compressVideoButton.addEventListener('click', async () => {
    if (!loadedCompressVideo) {
        videoCompressorStatus.textContent = 'Please select a video first.';
        return;
    }
    if (videoCompressing) return;
    if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) {
        videoCompressorStatus.textContent = 'Your browser does not support video compression.';
        return;
    }

    const { file, url, duration } = loadedCompressVideo;
    const fraction = parseFloat(videoCompressQuality.value);
    const maxHeight = parseInt(videoCompressResolution.value, 10);
    const mimeType = pickRecorderMimeType();
    const ext = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';

    // Target bitrate is a fraction of the source's average bitrate, with a sane floor
    const originalBitrate = (file.size * 8) / duration;
    const videoBitsPerSecond = Math.max(150000, Math.round(originalBitrate * fraction));

    videoCompressing = true;
    compressVideoButton.disabled = true;
    videoCompressorDownload.innerHTML = '';
    videoCompressorStatus.textContent = 'Compressing… 0% (keep this tab open and visible)';

    // A fresh element per run: createMediaElementSource can only be used once per element
    const source = document.createElement('video');
    source.src = url;
    source.playsInline = true;
    source.preload = 'auto';

    let audioCtx = null;
    try {
        await new Promise((resolve, reject) => {
            source.onloadedmetadata = resolve;
            source.onerror = () => reject(new Error('Failed to decode video'));
        });

        let width = source.videoWidth;
        let height = source.videoHeight;
        if (maxHeight && height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
        }
        // Most encoders require even dimensions
        width -= width % 2;
        height -= height % 2;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const stream = canvas.captureStream(30);

        // Route audio into the recording without playing it through the speakers
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioDest = audioCtx.createMediaStreamDestination();
        audioCtx.createMediaElementSource(source).connect(audioDest);
        audioDest.stream.getAudioTracks().forEach(track => stream.addTrack(track));

        const recorder = new MediaRecorder(stream, {
            ...(mimeType && { mimeType }),
            videoBitsPerSecond,
            audioBitsPerSecond: 96000,
        });
        const chunks = [];
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        const stopped = new Promise(resolve => { recorder.onstop = resolve; });

        const drawFrame = () => {
            ctx.drawImage(source, 0, 0, width, height);
            const pct = Math.min(100, Math.floor((source.currentTime / duration) * 100));
            videoCompressorStatus.textContent = `Compressing… ${pct}% (keep this tab open and visible)`;
            if (source.ended) return;
            if (source.requestVideoFrameCallback) source.requestVideoFrameCallback(drawFrame);
            else requestAnimationFrame(drawFrame);
        };

        await audioCtx.resume();
        recorder.start(1000);
        await source.play();
        drawFrame();

        await new Promise((resolve, reject) => {
            source.onended = resolve;
            source.onerror = () => reject(new Error('Playback failed during compression'));
        });
        recorder.stop();
        await stopped;

        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        const outUrl = URL.createObjectURL(blob);
        const saved = ((1 - blob.size / file.size) * 100).toFixed(0);
        videoCompressorStatus.textContent = blob.size < file.size
            ? `Done! Compressed size: ${formatFileSize(blob.size)} (${saved}% smaller)`
            : `Done, but output (${formatFileSize(blob.size)}) is not smaller than the original — try a lower bitrate or resolution.`;

        const baseName = file.name.replace(/\.[^.]+$/, '') || 'video';
        const link = document.createElement('a');
        link.href = outUrl;
        link.download = `${baseName}-compressed.${ext}`;
        link.textContent = `Download ${link.download}`;
        link.addEventListener('click', () => setTimeout(() => URL.revokeObjectURL(outUrl), 100));
        videoCompressorDownload.appendChild(link);
    } catch (err) {
        videoCompressorStatus.textContent = `Error: ${err.message}`;
        console.error('Video compressor error:', err);
    } finally {
        source.pause();
        source.removeAttribute('src');
        if (audioCtx) audioCtx.close();
        videoCompressing = false;
        compressVideoButton.disabled = false;
    }
});

// ── PDF Editor ────────────────────────────────────────────────────────────────

(function () {
    // pdf.js worker
    const PDFJS_WORKER = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

    // State
    let pdfDoc = null;           // pdf-lib PDFDocument (for export)
    let pdfJsDoc = null;         // pdf.js document (for rendering)
    let originalBytes = null;    // raw bytes of the loaded PDF
    let currentPage = 1;
    let totalPages = 0;
    let zoomLevel = 1.0;
    let activeTool = 'text';
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let pendingImageBytes = null; // image asset for placing
    let pendingImageMime = null;

    // Per-page annotations: Map<pageNumber, Annotation[]>
    // Annotation = { type, x, y, text, color, fontSize, lineWidth, x2, y2, width, height, imageBytes, mime }
    const annotations = new Map();
    // Undo stack: array of snapshots { page, annots: [...] }
    const undoStack = [];

    // DOM refs
    const pdfFileInput = document.getElementById('pdfFileInput');
    const pdfDropZone = document.getElementById('pdfDropZone');
    const pdfDropLabel = document.getElementById('pdfDropLabel');
    const pdfEditorWorkspace = document.getElementById('pdfEditorWorkspace');
    const pdfEditorStatus = document.getElementById('pdfEditorStatus');
    const pdfCanvas = document.getElementById('pdfCanvas');
    const pdfOverlayCanvas = document.getElementById('pdfOverlayCanvas');
    const pdfCanvasWrapper = document.getElementById('pdfCanvasWrapper');
    const pdfPageIndicator = document.getElementById('pdfPageIndicator');
    const pdfZoomLevel = document.getElementById('pdfZoomLevel');
    const pdfAnnotCount = document.getElementById('pdfAnnotCount');
    const pdfAnnotList = document.getElementById('pdfAnnotList');
    const pdfTextPanel = document.getElementById('pdfTextPanel');
    const pdfTextInput = document.getElementById('pdfTextInput');
    const pdfImageAsset = document.getElementById('pdfImageAsset');

    // ── Helpers ──────────────────────────────────────────────────────────────

    function getPageAnnotations(page) {
        if (!annotations.has(page)) annotations.set(page, []);
        return annotations.get(page);
    }

    function pushUndo() {
        const snapshot = {
            page: currentPage,
            annots: JSON.parse(JSON.stringify(getPageAnnotations(currentPage).map(a => {
                const copy = { ...a };
                if (a.imageBytes) copy.imageBytes = a.imageBytes; // keep reference (Uint8Array)
                return copy;
            })))
        };
        undoStack.push(snapshot);
        if (undoStack.length > 50) undoStack.shift();
    }

    function undo() {
        if (!undoStack.length) return;
        const snapshot = undoStack.pop();
        annotations.set(snapshot.page, snapshot.annots);
        if (snapshot.page === currentPage) {
            renderOverlay();
            updateAnnotList();
        }
    }

    function getColor() { return document.getElementById('pdfColor').value; }
    function getFontFamily() { return document.getElementById('pdfFontFamily').value || 'sans-serif'; }
    function getFontSize() { return parseInt(document.getElementById('pdfFontSize').value) || 16; }
    function getLineWidth() { return parseInt(document.getElementById('pdfLineWidth').value) || 2; }

    // Convert canvas coords (at current zoom) → PDF-page coords
    function canvasToPdfCoords(cx, cy, viewport) {
        return { x: cx / zoomLevel, y: cy / zoomLevel };
    }

    // ── PDF.js rendering ─────────────────────────────────────────────────────

    async function renderPage(pageNum) {
        if (!pdfJsDoc) return;
        const page = await pdfJsDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: zoomLevel });

        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        pdfOverlayCanvas.width = viewport.width;
        pdfOverlayCanvas.height = viewport.height;

        await page.render({ canvasContext: pdfCanvas.getContext('2d'), viewport }).promise;
        renderOverlay();
        updateUI();
    }

    // ── Selection state ───────────────────────────────────────────────────────

    let selectedAnnotIdx = -1;

    function deselectAnnotation() {
        selectedAnnotIdx = -1;
        document.getElementById('pdfSelectPanel').style.display = 'none';
        renderOverlay();
    }

    function selectAnnotation(idx) {
        selectedAnnotIdx = idx;
        const annots = getPageAnnotations(currentPage);
        const a = annots[idx];
        if (!a) return;

        const panel = document.getElementById('pdfSelectPanel');
        panel.style.display = 'flex';
        document.getElementById('pdfSelectType').textContent = `Selected: ${a.type}`;
        document.getElementById('pdfSelectColor').value = a.color || '#000000';

        const fontFamilyLabel = document.getElementById('pdfSelectFontFamilyLabel');
        const fontFamilyInput = document.getElementById('pdfSelectFontFamily');
        const fontSizeLabel = document.getElementById('pdfSelectFontSizeLabel');
        const fontSizeInput = document.getElementById('pdfSelectFontSize');
        const lineWidthLabel = document.getElementById('pdfSelectLineWidthLabel');
        const lineWidthInput = document.getElementById('pdfSelectLineWidth');
        const textRow = document.getElementById('pdfSelectTextRow');
        const textArea = document.getElementById('pdfSelectText');

        if (a.type === 'text') {
            // Font family — match annotation's stored family exactly
            fontFamilyLabel.style.display = '';
            fontFamilyInput.style.display = '';
            const storedFamily = a.fontFamily || 'sans-serif';
            // Try to select the matching option; fall back to first
            const opt = [...fontFamilyInput.options].find(o => o.value === storedFamily);
            fontFamilyInput.value = opt ? storedFamily : fontFamilyInput.options[0].value;

            fontSizeLabel.style.display = '';
            fontSizeInput.style.display = '';
            fontSizeInput.value = a.fontSize || 16;

            lineWidthLabel.style.display = 'none';
            lineWidthInput.style.display = 'none';

            textRow.style.display = 'flex';
            textArea.value = a.text || '';
            // Live-preview the textarea in the annotation's exact font + size + color
            textArea.style.fontFamily = storedFamily;
            textArea.style.fontSize = `${a.fontSize || 16}px`;
            textArea.style.color = a.color || '#000000';

            // Keep preview in sync as user changes font/size/color in the panel
            syncSelectPreview();
        } else {
            fontFamilyLabel.style.display = 'none';
            fontFamilyInput.style.display = 'none';
            fontSizeLabel.style.display = 'none';
            fontSizeInput.style.display = 'none';
            lineWidthLabel.style.display = a.type !== 'image' ? '' : 'none';
            lineWidthInput.style.display = a.type !== 'image' ? '' : 'none';
            if (a.lineWidth !== undefined) lineWidthInput.value = a.lineWidth;
            textRow.style.display = 'none';
        }

        renderOverlay();
    }

    // Update textarea preview whenever panel inputs change
    function syncSelectPreview() {
        const textArea = document.getElementById('pdfSelectText');
        const family = document.getElementById('pdfSelectFontFamily').value;
        const size = document.getElementById('pdfSelectFontSize').value;
        const color = document.getElementById('pdfSelectColor').value;
        textArea.style.fontFamily = family;
        textArea.style.fontSize = `${size}px`;
        textArea.style.color = color;
    }

    ['pdfSelectFontFamily', 'pdfSelectFontSize', 'pdfSelectColor'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            const annots = getPageAnnotations(currentPage);
            if (selectedAnnotIdx >= 0 && annots[selectedAnnotIdx] && annots[selectedAnnotIdx].type === 'text') {
                syncSelectPreview();
            }
        });
    });

    // ── Hit testing ───────────────────────────────────────────────────────────

    function annotBounds(a) {
        if (a.type === 'text') {
            const lineH = (a.fontSize || 16) * 1.3;
            const lines = (a.text || '').split('\n');
            return { x: a.x - 4, y: a.y - (a.fontSize || 16), w: 200, h: lines.length * lineH + 4 };
        } else if (a.type === 'rect') {
            const x = a.width >= 0 ? a.x : a.x + a.width;
            const y = a.height >= 0 ? a.y : a.y + a.height;
            return { x, y, w: Math.abs(a.width), h: Math.abs(a.height) };
        } else if (a.type === 'line') {
            const minX = Math.min(a.x, a.x2), maxX = Math.max(a.x, a.x2);
            const minY = Math.min(a.y, a.y2), maxY = Math.max(a.y, a.y2);
            return { x: minX - 6, y: minY - 6, w: maxX - minX + 12, h: maxY - minY + 12 };
        } else if (a.type === 'image') {
            return { x: a.x, y: a.y, w: Math.abs(a.width), h: Math.abs(a.height) };
        }
        return { x: a.x, y: a.y, w: 10, h: 10 };
    }

    function hitTest(px, py) {
        const annots = getPageAnnotations(currentPage);
        // Iterate in reverse so topmost annotation is selected first
        for (let i = annots.length - 1; i >= 0; i--) {
            const b = annotBounds(annots[i]);
            if (px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h) {
                return i;
            }
        }
        return -1;
    }

    // ── Overlay rendering ────────────────────────────────────────────────────

    function renderOverlay() {
        const ctx = pdfOverlayCanvas.getContext('2d');
        ctx.clearRect(0, 0, pdfOverlayCanvas.width, pdfOverlayCanvas.height);
        const annots = getPageAnnotations(currentPage);

        annots.forEach((a, idx) => {
            ctx.save();
            ctx.strokeStyle = a.color;
            ctx.fillStyle = a.color;
            ctx.lineWidth = (a.lineWidth || 2) * zoomLevel;

            if (a.type === 'text') {
                const family = a.fontFamily || 'sans-serif';
                ctx.font = `${(a.fontSize || 16) * zoomLevel}px ${family}`;
                const lines = a.text.split('\n');
                const lineH = (a.fontSize || 16) * zoomLevel * 1.3;
                lines.forEach((line, i) => {
                    ctx.fillText(line, a.x * zoomLevel, a.y * zoomLevel + i * lineH);
                });
            } else if (a.type === 'rect') {
                ctx.strokeRect(a.x * zoomLevel, a.y * zoomLevel, a.width * zoomLevel, a.height * zoomLevel);
            } else if (a.type === 'line') {
                ctx.beginPath();
                ctx.moveTo(a.x * zoomLevel, a.y * zoomLevel);
                ctx.lineTo(a.x2 * zoomLevel, a.y2 * zoomLevel);
                ctx.stroke();
            } else if (a.type === 'image' && a._img) {
                ctx.drawImage(a._img, a.x * zoomLevel, a.y * zoomLevel, a.width * zoomLevel, a.height * zoomLevel);
            }

            // Selection highlight
            if (idx === selectedAnnotIdx) {
                const b = annotBounds(a);
                ctx.strokeStyle = '#00AAFF';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 3]);
                ctx.strokeRect(b.x * zoomLevel - 2, b.y * zoomLevel - 2, b.w * zoomLevel + 4, b.h * zoomLevel + 4);
                ctx.setLineDash([]);
                // Resize handle (bottom-right)
                const hx = (b.x + b.w) * zoomLevel + 2;
                const hy = (b.y + b.h) * zoomLevel + 2;
                ctx.fillStyle = '#00AAFF';
                ctx.fillRect(hx - 5, hy - 5, 10, 10);
            }

            ctx.restore();
        });
        updateAnnotList();
    }

    // ── Annotation list ──────────────────────────────────────────────────────

    function updateAnnotList() {
        const annots = getPageAnnotations(currentPage);
        pdfAnnotCount.textContent = `(${annots.length})`;
        pdfAnnotList.innerHTML = '';
        annots.forEach((a, idx) => {
            const li = document.createElement('li');
            li.className = 'pdf-annot-item' + (idx === selectedAnnotIdx ? ' selected-annot' : '');
            const label = document.createElement('span');
            label.className = 'annot-label';
            label.title = 'Click to select';
            label.style.cursor = 'pointer';
            label.textContent = `[${a.type}] ${a.type === 'text' ? a.text.substring(0, 40) : `@ (${Math.round(a.x)},${Math.round(a.y)})`}`;
            label.addEventListener('click', () => {
                activeTool = 'select';
                document.querySelectorAll('.pdf-tool-btn[data-tool]').forEach(b => b.classList.remove('active-tool'));
                document.getElementById('pdfToolSelect').classList.add('active-tool');
                pdfOverlayCanvas.style.cursor = 'default';
                selectAnnotation(idx);
            });
            const del = document.createElement('button');
            del.textContent = 'Remove';
            del.addEventListener('click', () => {
                pushUndo();
                annots.splice(idx, 1);
                if (selectedAnnotIdx === idx) deselectAnnotation();
                else renderOverlay();
            });
            li.appendChild(label);
            li.appendChild(del);
            pdfAnnotList.appendChild(li);
        });
    }

    // ── UI update ────────────────────────────────────────────────────────────

    function updateUI() {
        pdfPageIndicator.textContent = `${currentPage} / ${totalPages}`;
        pdfZoomLevel.textContent = `${Math.round(zoomLevel * 100)}%`;
    }

    // ── Load PDF ─────────────────────────────────────────────────────────────

    async function loadPDF(file) {
        pdfEditorStatus.textContent = 'Loading PDF…';
        try {
            originalBytes = new Uint8Array(await file.arrayBuffer());

            // pdf-lib for editing
            const { PDFDocument } = PDFLib;
            pdfDoc = await PDFDocument.load(originalBytes, { ignoreEncryption: true });

            // pdf.js for rendering
            if (typeof pdfjsLib === 'undefined') {
                throw new Error('PDF.js library not loaded yet. Please refresh the page.');
            }
            pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
            pdfJsDoc = await pdfjsLib.getDocument({ data: originalBytes }).promise;
            totalPages = pdfJsDoc.numPages;
            currentPage = 1;
            annotations.clear();
            undoStack.length = 0;

            pdfEditorWorkspace.style.display = 'flex';
            pdfDropLabel.textContent = `✓ ${file.name}`;
            pdfEditorStatus.textContent = `Loaded: ${file.name} (${totalPages} page${totalPages > 1 ? 's' : ''})`;

            await renderPage(currentPage);
        } catch (err) {
            pdfEditorStatus.textContent = `Error: ${err.message}`;
            console.error('PDF load error:', err);
        }
    }

    // ── Refresh pdf.js from pdf-lib bytes ────────────────────────────────────

    async function refreshPdfJs() {
        const { PDFDocument } = PDFLib;
        const newBytes = await pdfDoc.save();
        originalBytes = newBytes;
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        pdfJsDoc = await pdfjsLib.getDocument({ data: newBytes }).promise;
        totalPages = pdfJsDoc.numPages;
        if (currentPage > totalPages) currentPage = totalPages;
    }

    // ── Canvas interaction ────────────────────────────────────────────────────

    let textPlacementPending = false;
    let pendingTextX = 0, pendingTextY = 0;

    // Select-mode drag state
    let selectDragging = false;
    let selectDragOrigin = { px: 0, py: 0 };
    let selectDragAnnotOrigin = null; // snapshot of annot position at drag start
    let isResizing = false;

    function getCanvasPos(e) {
        const rect = pdfOverlayCanvas.getBoundingClientRect();
        return { px: (e.clientX - rect.left) / zoomLevel, py: (e.clientY - rect.top) / zoomLevel };
    }

    function isOnResizeHandle(px, py, annot) {
        const b = annotBounds(annot);
        const hx = b.x + b.w;
        const hy = b.y + b.h;
        return Math.abs(px - hx) < 8 / zoomLevel && Math.abs(py - hy) < 8 / zoomLevel;
    }

    pdfOverlayCanvas.addEventListener('mousedown', (e) => {
        const { px, py } = getCanvasPos(e);

        if (activeTool === 'select') {
            const annots = getPageAnnotations(currentPage);
            // Check if clicking resize handle of current selection
            if (selectedAnnotIdx >= 0 && annots[selectedAnnotIdx] && isOnResizeHandle(px, py, annots[selectedAnnotIdx])) {
                pushUndo();
                isResizing = true;
                selectDragging = true;
                selectDragOrigin = { px, py };
                selectDragAnnotOrigin = { ...annots[selectedAnnotIdx] };
                return;
            }
            const hit = hitTest(px, py);
            if (hit >= 0) {
                selectAnnotation(hit);
                pushUndo();
                selectDragging = true;
                isResizing = false;
                selectDragOrigin = { px, py };
                selectDragAnnotOrigin = { ...annots[hit] };
                pdfOverlayCanvas.style.cursor = 'move';
            } else {
                deselectAnnotation();
            }
            return;
        }

        if (activeTool === 'text') {
            pendingTextX = px;
            pendingTextY = py;
            textPlacementPending = true;
            pdfTextPanel.style.display = 'flex';
            pdfTextInput.focus();
        } else if (activeTool === 'rect' || activeTool === 'line') {
            isDragging = true;
            dragStart = { x: px, y: py };
        } else if (activeTool === 'image') {
            if (pendingImageBytes) {
                placeImageAt(px, py);
            } else {
                pdfImageAsset.click();
                pendingTextX = px;
                pendingTextY = py;
                textPlacementPending = true;
            }
        }
    });

    pdfOverlayCanvas.addEventListener('mousemove', (e) => {
        const { px, py } = getCanvasPos(e);

        if (activeTool === 'select') {
            // Update cursor hint
            if (!selectDragging) {
                const annots = getPageAnnotations(currentPage);
                if (selectedAnnotIdx >= 0 && annots[selectedAnnotIdx]) {
                    if (isOnResizeHandle(px, py, annots[selectedAnnotIdx])) {
                        pdfOverlayCanvas.style.cursor = 'nwse-resize';
                        return;
                    }
                }
                const hit = hitTest(px, py);
                pdfOverlayCanvas.style.cursor = hit >= 0 ? 'move' : 'default';
            }

            if (!selectDragging) return;
            const annots = getPageAnnotations(currentPage);
            const a = annots[selectedAnnotIdx];
            if (!a) return;
            const dx = px - selectDragOrigin.px;
            const dy = py - selectDragOrigin.py;

            if (isResizing) {
                const orig = selectDragAnnotOrigin;
                if (a.type === 'rect' || a.type === 'image') {
                    a.width = Math.max(10, (orig.width || 50) + dx);
                    a.height = Math.max(10, (orig.height || 50) + dy);
                } else if (a.type === 'line') {
                    a.x2 = orig.x2 + dx;
                    a.y2 = orig.y2 + dy;
                }
            } else {
                const orig = selectDragAnnotOrigin;
                a.x = orig.x + dx;
                a.y = orig.y + dy;
                if (a.type === 'line') { a.x2 = orig.x2 + dx; a.y2 = orig.y2 + dy; }
                if (a.type === 'rect' || a.type === 'image') {
                    // width/height stay the same; x/y move
                }
            }
            renderOverlay();
            return;
        }

        if (!isDragging) return;
        renderOverlay();
        const ctx = pdfOverlayCanvas.getContext('2d');
        ctx.save();
        ctx.strokeStyle = getColor();
        ctx.lineWidth = getLineWidth() * zoomLevel;
        if (activeTool === 'rect') {
            ctx.strokeRect(
                dragStart.x * zoomLevel, dragStart.y * zoomLevel,
                (px - dragStart.x) * zoomLevel, (py - dragStart.y) * zoomLevel
            );
        } else if (activeTool === 'line') {
            ctx.beginPath();
            ctx.moveTo(dragStart.x * zoomLevel, dragStart.y * zoomLevel);
            ctx.lineTo(px * zoomLevel, py * zoomLevel);
            ctx.stroke();
        }
        ctx.restore();
    });

    pdfOverlayCanvas.addEventListener('mouseup', (e) => {
        if (activeTool === 'select') {
            if (selectDragging) {
                selectDragging = false;
                isResizing = false;
                pdfOverlayCanvas.style.cursor = 'default';
                // Refresh panel position display
                const annots = getPageAnnotations(currentPage);
                if (selectedAnnotIdx >= 0 && annots[selectedAnnotIdx]) {
                    selectAnnotation(selectedAnnotIdx);
                }
            }
            return;
        }

        if (!isDragging) return;
        isDragging = false;
        const { px, py } = getCanvasPos(e);

        pushUndo();
        if (activeTool === 'rect') {
            getPageAnnotations(currentPage).push({
                type: 'rect',
                x: dragStart.x, y: dragStart.y,
                width: px - dragStart.x,
                height: py - dragStart.y,
                color: getColor(),
                lineWidth: getLineWidth()
            });
        } else if (activeTool === 'line') {
            getPageAnnotations(currentPage).push({
                type: 'line',
                x: dragStart.x, y: dragStart.y,
                x2: px, y2: py,
                color: getColor(),
                lineWidth: getLineWidth()
            });
        }
        renderOverlay();
    });

    // Double-click to edit annotation directly (text: opens edit panel; others: select)
    pdfOverlayCanvas.addEventListener('dblclick', (e) => {
        const { px, py } = getCanvasPos(e);
        const hit = hitTest(px, py);
        if (hit < 0) return;

        // Switch to select tool automatically
        activeTool = 'select';
        document.querySelectorAll('.pdf-tool-btn[data-tool]').forEach(b => b.classList.remove('active-tool'));
        document.getElementById('pdfToolSelect').classList.add('active-tool');
        pdfOverlayCanvas.style.cursor = 'default';
        pdfTextPanel.style.display = 'none';

        selectAnnotation(hit);

        const a = getPageAnnotations(currentPage)[hit];
        if (a && a.type === 'text') {
            document.getElementById('pdfSelectText').focus();
        }
    });

    // Text placement
    document.getElementById('pdfTextConfirm').addEventListener('click', () => {
        const text = pdfTextInput.value.trim();
        if (!text) return;
        pushUndo();
        getPageAnnotations(currentPage).push({
            type: 'text',
            x: pendingTextX,
            y: pendingTextY,
            text,
            color: getColor(),
            fontFamily: getFontFamily(),
            fontSize: getFontSize()
        });
        pdfTextInput.value = '';
        pdfTextPanel.style.display = 'none';
        textPlacementPending = false;
        renderOverlay();
    });

    document.getElementById('pdfTextCancel').addEventListener('click', () => {
        pdfTextInput.value = '';
        pdfTextPanel.style.display = 'none';
        textPlacementPending = false;
    });

    // ── Selection panel actions ───────────────────────────────────────────────

    document.getElementById('pdfSelectApply').addEventListener('click', () => {
        if (selectedAnnotIdx < 0) return;
        const annots = getPageAnnotations(currentPage);
        const a = annots[selectedAnnotIdx];
        if (!a) return;
        pushUndo();
        a.color = document.getElementById('pdfSelectColor').value;
        if (a.type === 'text') {
            a.fontFamily = document.getElementById('pdfSelectFontFamily').value;
            a.fontSize = parseInt(document.getElementById('pdfSelectFontSize').value) || 16;
            a.text = document.getElementById('pdfSelectText').value;
        } else if (a.type !== 'image') {
            a.lineWidth = parseInt(document.getElementById('pdfSelectLineWidth').value) || 2;
        }
        renderOverlay();
        document.getElementById('pdfSelectType').textContent = `Selected: ${a.type} (saved)`;
    });

    document.getElementById('pdfSelectDelete').addEventListener('click', () => {
        if (selectedAnnotIdx < 0) return;
        const annots = getPageAnnotations(currentPage);
        pushUndo();
        annots.splice(selectedAnnotIdx, 1);
        deselectAnnotation();
    });

    document.getElementById('pdfSelectDeselect').addEventListener('click', deselectAnnotation);

    // Image asset
    pdfImageAsset.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        pendingImageBytes = new Uint8Array(await file.arrayBuffer());
        pendingImageMime = file.type;
        if (textPlacementPending) {
            placeImageAt(pendingTextX, pendingTextY);
            textPlacementPending = false;
        }
        pdfImageAsset.value = '';
    });

    async function placeImageAt(px, py) {
        if (!pendingImageBytes) return;
        const blob = new Blob([pendingImageBytes], { type: pendingImageMime });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            const maxW = 200;
            const scale = Math.min(1, maxW / img.naturalWidth);
            pushUndo();
            const annot = {
                type: 'image',
                x: px, y: py,
                width: img.naturalWidth * scale,
                height: img.naturalHeight * scale,
                imageBytes: pendingImageBytes,
                mime: pendingImageMime,
                color: '#000000',
                _img: img
            };
            getPageAnnotations(currentPage).push(annot);
            renderOverlay();
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    // ── Tool buttons ─────────────────────────────────────────────────────────

    ['pdfToolSelect', 'pdfToolText', 'pdfToolRect', 'pdfToolLine', 'pdfToolImage'].forEach(id => {
        const btn = document.getElementById(id);
        btn.addEventListener('click', () => {
            activeTool = btn.dataset.tool;
            document.querySelectorAll('.pdf-tool-btn[data-tool]').forEach(b => b.classList.remove('active-tool'));
            btn.classList.add('active-tool');
            pdfOverlayCanvas.style.cursor = activeTool === 'select' ? 'default' : 'crosshair';
            if (activeTool === 'image') {
                pendingImageBytes = null;
                pdfEditorStatus.textContent = 'Image tool: click the canvas where you want to place the image, then choose a file.';
            } else {
                pdfEditorStatus.textContent = '';
            }
            if (activeTool !== 'select') {
                deselectAnnotation();
            }
            pdfTextPanel.style.display = 'none';
        });
    });

    // ── Navigation ───────────────────────────────────────────────────────────

    document.getElementById('pdfPrevPage').addEventListener('click', async () => {
        if (currentPage > 1) { currentPage--; await renderPage(currentPage); }
    });
    document.getElementById('pdfNextPage').addEventListener('click', async () => {
        if (currentPage < totalPages) { currentPage++; await renderPage(currentPage); }
    });

    // ── Zoom ─────────────────────────────────────────────────────────────────

    document.getElementById('pdfZoomIn').addEventListener('click', async () => {
        zoomLevel = Math.min(zoomLevel + 0.2, 4.0);
        await renderPage(currentPage);
    });
    document.getElementById('pdfZoomOut').addEventListener('click', async () => {
        zoomLevel = Math.max(zoomLevel - 0.2, 0.2);
        await renderPage(currentPage);
    });
    document.getElementById('pdfZoomFit').addEventListener('click', async () => {
        const wrapperWidth = pdfCanvasWrapper.clientWidth - 4;
        if (!pdfJsDoc) return;
        const page = await pdfJsDoc.getPage(currentPage);
        const vp = page.getViewport({ scale: 1 });
        zoomLevel = Math.min(wrapperWidth / vp.width, 2.0);
        await renderPage(currentPage);
    });

    // ── Page management ──────────────────────────────────────────────────────

    document.getElementById('pdfDeletePage').addEventListener('click', async () => {
        if (totalPages <= 1) { pdfEditorStatus.textContent = 'Cannot delete the only page.'; return; }
        if (!confirm(`Delete page ${currentPage}?`)) return;
        pdfDoc.removePage(currentPage - 1);
        annotations.delete(currentPage);
        // Re-key annotations above deleted page
        const newMap = new Map();
        annotations.forEach((v, k) => {
            if (k < currentPage) newMap.set(k, v);
            else if (k > currentPage) newMap.set(k - 1, v);
        });
        annotations.clear();
        newMap.forEach((v, k) => annotations.set(k, v));

        await refreshPdfJs();
        if (currentPage > totalPages) currentPage = totalPages;
        await renderPage(currentPage);
        pdfEditorStatus.textContent = `Page deleted. ${totalPages} page(s) remaining.`;
    });

    document.getElementById('pdfAddBlankPage').addEventListener('click', async () => {
        const page = pdfDoc.getPages()[currentPage - 1];
        const { width, height } = page.getSize();
        pdfDoc.insertPage(currentPage, [width, height]);
        // Shift annotations above insertion
        const newMap = new Map();
        annotations.forEach((v, k) => {
            if (k <= currentPage) newMap.set(k, v);
            else newMap.set(k + 1, v);
        });
        annotations.clear();
        newMap.forEach((v, k) => annotations.set(k, v));

        await refreshPdfJs();
        currentPage++;
        await renderPage(currentPage);
        pdfEditorStatus.textContent = 'Blank page inserted.';
    });

    document.getElementById('pdfMovePageUp').addEventListener('click', async () => {
        if (currentPage <= 1) return;
        const pages = pdfDoc.getPages();
        // pdf-lib doesn't have movePage, so copy + remove
        const idx = currentPage - 1;
        const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [idx]);
        pdfDoc.insertPage(idx - 1, copiedPage);
        pdfDoc.removePage(idx + 1); // original shifted by 1

        // Swap annotations
        const a = annotations.get(currentPage);
        const b = annotations.get(currentPage - 1);
        if (a) annotations.set(currentPage - 1, a); else annotations.delete(currentPage - 1);
        if (b) annotations.set(currentPage, b); else annotations.delete(currentPage);

        await refreshPdfJs();
        currentPage--;
        await renderPage(currentPage);
    });

    document.getElementById('pdfMovePageDown').addEventListener('click', async () => {
        if (currentPage >= totalPages) return;
        const idx = currentPage - 1;
        const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [idx + 1]);
        pdfDoc.insertPage(idx, copiedPage);
        pdfDoc.removePage(idx + 2);

        const a = annotations.get(currentPage);
        const b = annotations.get(currentPage + 1);
        if (b) annotations.set(currentPage, b); else annotations.delete(currentPage);
        if (a) annotations.set(currentPage + 1, a); else annotations.delete(currentPage + 1);

        await refreshPdfJs();
        currentPage++;
        await renderPage(currentPage);
    });

    // ── Undo ─────────────────────────────────────────────────────────────────

    document.getElementById('pdfUndoBtn').addEventListener('click', undo);

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && pdfEditorWorkspace.style.display !== 'none') {
            undo();
        }
    });

    // ── Download (bake annotations) ──────────────────────────────────────────

    document.getElementById('pdfDownloadBtn').addEventListener('click', async () => {
        if (!pdfDoc) return;
        pdfEditorStatus.textContent = 'Preparing download…';
        try {
            const { PDFDocument, rgb, StandardFonts } = PDFLib;

            // Work on a fresh copy so we don't mutate the live doc
            const exportDoc = await PDFDocument.load(await pdfDoc.save(), { ignoreEncryption: true });
            const font = await exportDoc.embedFont(StandardFonts.Helvetica);
            const exportPages = exportDoc.getPages();

            for (const [pageNum, annots] of annotations) {
                const pIdx = pageNum - 1;
                if (pIdx < 0 || pIdx >= exportPages.length) continue;
                const pg = exportPages[pIdx];
                const { height: pgH } = pg.getSize();

                for (const a of annots) {
                    const color = hexToRgb(a.color);
                    if (a.type === 'text') {
                        const lines = a.text.split('\n');
                        const lineH = (a.fontSize || 16) * 1.3;
                        lines.forEach((line, i) => {
                            if (!line) return;
                            pg.drawText(line, {
                                x: a.x,
                                y: pgH - a.y - i * lineH,
                                size: a.fontSize || 16,
                                font,
                                color: rgb(color.r, color.g, color.b)
                            });
                        });
                    } else if (a.type === 'rect') {
                        pg.drawRectangle({
                            x: a.x,
                            y: pgH - a.y - Math.abs(a.height),
                            width: Math.abs(a.width),
                            height: Math.abs(a.height),
                            borderColor: rgb(color.r, color.g, color.b),
                            borderWidth: a.lineWidth || 2,
                            color: undefined
                        });
                    } else if (a.type === 'line') {
                        pg.drawLine({
                            start: { x: a.x, y: pgH - a.y },
                            end: { x: a.x2, y: pgH - a.y2 },
                            thickness: a.lineWidth || 2,
                            color: rgb(color.r, color.g, color.b)
                        });
                    } else if (a.type === 'image' && a.imageBytes) {
                        try {
                            let embeddedImg;
                            if (a.mime === 'image/jpeg' || a.mime === 'image/jpg') {
                                embeddedImg = await exportDoc.embedJpg(a.imageBytes);
                            } else {
                                // Convert to PNG via canvas
                                const imgEl = new Image();
                                const blobUrl = URL.createObjectURL(new Blob([a.imageBytes], { type: a.mime }));
                                await new Promise(res => { imgEl.onload = res; imgEl.src = blobUrl; });
                                const cvs = document.createElement('canvas');
                                cvs.width = imgEl.naturalWidth; cvs.height = imgEl.naturalHeight;
                                cvs.getContext('2d').drawImage(imgEl, 0, 0);
                                const pngBlob = await new Promise(res => cvs.toBlob(res, 'image/png'));
                                const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
                                embeddedImg = await exportDoc.embedPng(pngBytes);
                                URL.revokeObjectURL(blobUrl);
                            }
                            pg.drawImage(embeddedImg, {
                                x: a.x,
                                y: pgH - a.y - Math.abs(a.height),
                                width: Math.abs(a.width),
                                height: Math.abs(a.height)
                            });
                        } catch (imgErr) {
                            console.warn('Could not embed image annotation:', imgErr);
                        }
                    }
                }
            }

            const bytes = await exportDoc.save();
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'edited.pdf';
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            pdfEditorStatus.textContent = 'Download started!';
        } catch (err) {
            pdfEditorStatus.textContent = `Export error: ${err.message}`;
            console.error('PDF export error:', err);
        }
    });

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { r, g, b };
    }

    // ── File input / drop zone ───────────────────────────────────────────────

    pdfFileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) loadPDF(e.target.files[0]);
    });

    pdfDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        pdfDropZone.classList.add('drag-over');
    });
    pdfDropZone.addEventListener('dragleave', () => pdfDropZone.classList.remove('drag-over'));
    pdfDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        pdfDropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') loadPDF(file);
        else pdfEditorStatus.textContent = 'Please drop a PDF file.';
    });
})();
