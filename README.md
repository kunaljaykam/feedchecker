# feedchecker.org

FeedChecker is an open-source web tool for generating test files of any size and format, as well as testing your camera, audio feed, and browser features. This versatile application helps users quickly create sample files for testing and verify their device capabilities.

## Features

### Test File Generator
- Generate test files of specific sizes (0.1MB to 100MB)
- Multiple file formats supported:
  - Audio (WAV) - Creates playable audio files with sine wave patterns
  - Video (WebM) - Generates actual video content with visual elements
  - PDF - Creates valid, readable PDF documents
  - Text (TXT) - Produces text files with readable content
- Instant download of generated files
- Client-side generation (no server uploads/downloads)

### Device Testing
- Video and Audio Test: Check both your camera and microphone simultaneously
- Audio Test Only: Verify your microphone independently

### Browser Feature Testing
- Notification Testing: Check, request permissions, and test browser notifications
- Feature Detection: Test support for cookies, JavaScript, localStorage, WebRTC, WebGL, geolocation, and audio output devices

### User-Friendly Features
- Simple and clean design for easy usage
- Responsive design: Works well on both desktop and mobile devices
- Privacy-focused: All processing happens locally in your browser

## Technologies Used
- JavaScript: Core functionality
- HTML5/CSS3: Markup and styling
- Netlify: Hosting and deployment

## Setup and Usage

### Prerequisites
- Modern web browser with JavaScript enabled
- Camera and microphone access permissions (for media testing features)

### Usage

#### Generating Test Files
1. Visit [FeedChecker](https://feedchecker.org)
2. Enter the desired file size (between 0.1MB and 100MB)
3. Select the file format (Audio, Video, PDF, or Text)
4. Click "Generate File"
5. Once generated, click the download link to save the file

#### Testing Camera and Audio
1. For video and audio test, click on "Start Video"
2. For audio-only test, click on "Start Audio Check"
3. To stop testing, use the corresponding stop buttons

#### Browser Feature Testing
- Click on the respective buttons to test browser features
- Check notification permissions and send test notifications
- Verify browser capabilities with the feature indicators

## Deployment
The project is hosted on Netlify for easy deployment and management.

## Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License
This project is licensed under the MIT License.

## Acknowledgements
- Netlify: For hosting and deployment
