import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const output = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../tmp/extension-verification')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('http://127.0.0.1:5173/analizar')
    await page.locator('#email-subject').fill('Your invoice is ready')
    await page.locator('#email-body').fill('Your statement is ready for review. Sign in to view it. If you already paid, disregard this email. If paying by credit card, we will automatically charge the card on file within two days of the billing date. Amount: $0.00 USD.')
    await page.getByRole('button', { name: 'Analizar correo', exact: true }).click()
    await page.locator('.analysis-verdict-title').waitFor({ timeout: 120000 })
    assert.equal(await page.locator('.analysis-verdict-title').innerText(), 'Probablemente legítimo')
    assert.match(await page.locator('.analysis-verdict').innerText(), /calma/)
    assert.match(await page.locator('.analysis-verdict').innerText(), /Diagnóstico técnico y modelo anterior/)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    await page.screenshot({ path: path.join(output, `web-${width}.png`), fullPage: true })
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log('PASS: analizador web con API real en 1440 y 390 px, sin convertir modelo en acusación ni desbordamiento o errores JS.')
} finally { await browser.close() }
