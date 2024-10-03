const fs = require('fs');
const path = require('path');

// Path to the index.html file
const htmlFilePath = path.join(__dirname, 'index.html');

// Read the content of index.html
let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

// Google Analytics script to insert
const googleAnalyticsScript = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-P9J049EHG0"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-P9J049EHG0');
</script>
`;

// Insert the Google Analytics script before the closing </head> tag
if (!htmlContent.includes(googleAnalyticsScript)) {
    htmlContent = htmlContent.replace('</head>', `${googleAnalyticsScript}</head>`);
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
    console.log('Google Analytics script added to index.html');
} else {
    console.log('Google Analytics script is already present in index.html');
}
