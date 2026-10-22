// Requiere API :8765, servidor de fixtures :5174 y npm run build.
// Usa un perfil efímero; nunca modifica el navegador ni la cuenta del usuario.
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const extensionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const artifacts = path.resolve(extensionRoot, '../tmp/extension-verification')
await mkdir(artifacts, { recursive: true })
const context = await chromium.launchPersistentContext(path.join(artifacts, 'browser-profile'), {
  channel: process.env.REMIRA_BROWSER_CHANNEL || 'chrome',
  headless: true,
  ignoreDefaultArgs: ['--disable-extensions'],
  args: ['--enable-unsafe-extension-debugging'],
  viewport: { width: 400, height: 740 },
})

try {
  const session = await context.browser().newBrowserCDPSession()
  const { id } = await session.send('Extensions.loadUnpacked', { path: path.join(extensionRoot, 'dist') })
  const popup = await context.newPage()
  const errors = []
  popup.on('pageerror', error => errors.push(error.message))
  await popup.goto(`chrome-extension://${id}/index.html`)
  await popup.screenshot({ path: path.join(artifacts, '01-inicio.png'), fullPage: true })
  const fixture = await context.newPage()
  await fixture.goto('http://127.0.0.1:5174/test-email.html')
  await fixture.bringToFront()
  // Un clic de automatización sobre el DOM del popup no cambia la pestaña activa.
  async function click(label) {
    await popup.getByRole('button', { name: label, exact: true }).evaluate(button => button.click())
  }
  await click('Leer correo abierto')
  await popup.getByLabel('Hay 2 mensajes expandidos. Elige uno.').waitFor()
  await popup.locator('select').selectOption('0')
  assert.equal(await popup.locator('#subject').inputValue(), 'Reunión de proyecto')
  assert.doesNotMatch(await popup.locator('#body').inputValue(), /Mensaje anterior/)
  await click('Analizar localmente')
  await popup.getByRole('heading', { name: 'No detectado como spam', exact: true }).waitFor({ timeout: 120_000 })
  await popup.screenshot({ path: path.join(artifacts, '02-legitimo.png'), fullPage: true })
  await popup.locator('select').selectOption('1')
  assert.equal(await popup.locator('.result').count(), 0)
  await click('Analizar localmente')
  await popup.getByRole('heading', { name: 'Potencial spam', exact: true }).waitFor({ timeout: 120_000 })
  await popup.screenshot({ path: path.join(artifacts, '03-malicioso.png'), fullPage: true })
  assert.equal(await popup.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  // Una página sin un correo soportado produce error y descarta el resultado anterior.
  await fixture.goto('http://127.0.0.1:5174/')
  await fixture.bringToFront()
  await click('Volver a leer')
  await popup.getByRole('alert').waitFor()
  assert.equal(await popup.locator('.result').count(), 0)
  assert.deepEqual(errors, [])
  console.log('PASS: extensión instalada, extracción real, selección, dos inferencias locales, sin desbordamiento ni errores JS; página no soportada rechazada.')
  console.log(`Capturas: ${artifacts}`)
} finally {
  await context.close()
}
