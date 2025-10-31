const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Load the HTML file
  const htmlPath = 'file://' + path.resolve(__dirname, 'sunday-contract.html');
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  
  // Generate PDF
  await page.pdf({
    path: 'sunday-contract.pdf',
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '0mm',
      right: '0mm',
      bottom: '0mm',
      left: '0mm'
    }
  });
  
  console.log('PDF generated successfully: sunday-contract.pdf');
  await browser.close();
})();

