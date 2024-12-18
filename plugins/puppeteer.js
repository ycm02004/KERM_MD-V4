// puppeteerConfig.js
const puppeteer = require('puppeteer');

// Lancement de Puppeteer avec des arguments spécifiques pour éviter les erreurs sur certains systèmes
async function startBrowser() {
    const browser = await puppeteer.launch({
        headless: true, // mode sans tête
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Arguments pour contourner des restrictions système
    });
    return browser;
}

async function captureScreenshot(url, viewport = { width: 1280, height: 720 }) {
    const browser = await startBrowser();
    const page = await browser.newPage();
    await page.setViewport(viewport);

    try {
        await page.goto(url, { waitUntil: 'load', timeout: 60000 }); // Timeout après 60 secondes
        const screenshotBuffer = await page.screenshot({ fullPage: true }); // Capture d'écran complète
        await browser.close();
        return screenshotBuffer;
    } catch (error) {
        console.error('Error while capturing screenshot:', error);
        await browser.close();
        throw error; // Relance l'erreur pour gestion ultérieure
    }
}

module.exports = { captureScreenshot };