const fs = require('fs');
const path = require('path');
require('dotenv').config();

const htmlFilePath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const googleAnalyticsScript = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
</script>
`;

htmlContent = htmlContent.replace('</head>', `${googleAnalyticsScript}</head>`);
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
// console.log('Google Analytics script added to index.html');
