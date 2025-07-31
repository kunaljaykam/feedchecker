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
                let fileName;
                
                // Set a maximum size for browser memory safety
                const safeFileSize = Math.min(fileSize, 100);
                
                switch (fileType) {
                    case 'audio':
                        blob = generateAudioFile(safeFileSize);
                        fileName = `sample-${safeFileSize}MB.wav`;
                        break;
                    case 'video':
                        blob = await generateVideoFile(safeFileSize);
                        fileName = `sample-${safeFileSize}MB.webm`;
                        break;
                    case 'pdf':
                        blob = generatePdfFile(safeFileSize);
                        fileName = `sample-${safeFileSize}MB.pdf`;
                        break;
                    case 'text':
                        blob = generateTextFile(safeFileSize);
                        fileName = `sample-${safeFileSize}MB.txt`;
                        break;
                    default:
                        throw new Error('Invalid file type selected');
                }
                
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
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 100);
                });
                
                downloadLinkContainer.appendChild(downloadLink);
                
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
