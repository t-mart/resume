/* eslint-disable no-console */
const path = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const puppeteer = require('puppeteer');

class GenPDFPlugin {
  constructor(options) {
    this.name = 'PDFGenPlugin';

    const defaultOptions = {
      enabled: true,
      filename: 'index.pdf',
      source: path.resolve(__dirname, 'dist', 'index.html'),
    };

    this.options = Object.assign(defaultOptions, options);
  }

  apply(compiler) {
    if (!this.options.enabled) {
      return;
    }
    const pdfPath = path.resolve(compiler.options.output.path, this.options.filename);
    const sourceFileUrl = `file:///${this.options.source.replace(/\\/gi, '/')}`;

    compiler.hooks.afterEmit.tapPromise(this.name, async () => {
      console.log('Generating PDF...');
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(sourceFileUrl, { waitUntil: 'networkidle2' });
      await page.pdf({
        path: pdfPath,
        format: 'Letter',
        preferCSSPageSize: true,
      });
      await browser.close();
      console.log(`Generated PDF at ${pdfPath}`);
    });
  }
}

module.exports = GenPDFPlugin;
