// Requiere API :8765, servidor de fixtures :5174 y npm run build.
// Usa un perfil efímero; nunca modifica el navegador ni la cuenta del usuario.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
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
  const external = []
  context.on('request', request => { const url = new URL(request.url()); if (url.protocol.startsWith('http') && url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') external.push(request.url()) })
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    return url.protocol.startsWith('http') && url.hostname !== '127.0.0.1' && url.hostname !== 'localhost' ? route.abort() : route.continue()
  })
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
  await popup.getByLabel('Hay 4 mensajes expandidos. Elige uno.').waitFor()
  await popup.locator('select').selectOption('0')
  assert.equal(await popup.locator('#subject').inputValue(), 'Reunión de proyecto')
  assert.doesNotMatch(await popup.locator('#body').inputValue(), /Mensaje anterior/)
  await click('Analizar localmente')
  await popup.getByRole('heading', { name: 'Probablemente legítimo', exact: true }).waitFor({ timeout: 120_000 })
  await popup.screenshot({ path: path.join(artifacts, '02-legitimo.png'), fullPage: true })
  await popup.locator('select').selectOption('1')
  assert.equal(await popup.locator('.result').count(), 0)
  await click('Analizar localmente')
  await popup.getByRole('heading', { name: 'Posible phishing', exact: true }).waitFor({ timeout: 120_000 })
  await popup.screenshot({ path: path.join(artifacts, '03-malicioso.png'), fullPage: true })
  assert.equal(await popup.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  // Factura inglesa: aun si el modelo la acusa, su opinión sola no da veredicto de phishing.
  await popup.locator('select').selectOption('3')
  await click('Analizar localmente')
  await popup.getByRole('heading', { name: 'Probablemente legítimo', exact: true }).waitFor({ timeout: 120_000 })
  assert.match(await popup.locator('.result').innerText(), /calma/)
  await popup.screenshot({ path: path.join(artifacts, '04-factura.png'), fullPage: true })
  // OCR real del archivo de prueba, sin visitar URLs remotas.
  const imageFile = path.join(artifacts, 'ocr-sample.png')
  await fixture.locator('#ocr-test-image').screenshot({ path: imageFile })
  await fixture.bringToFront()
  await click('Volver a leer')
  await popup.locator('select').selectOption('2')
  await click('Analizar localmente')
  await popup.getByRole('alert').filter({ hasText: /Falta leer el texto de la imagen/ }).waitFor({ timeout: 120_000 })
  // Acción real del navegador concede activeTab para captureVisibleTab.
  const { targetInfos } = await session.send('Target.getTargets', { filter: [{ type: 'tab', exclude: false }] })
  const targetInfo = targetInfos.find(info => info.type === 'tab' && info.url === fixture.url())
  assert.ok(targetInfo, 'Se requiere el target tab del navegador para conceder activeTab.')
  const actionPopup = context.waitForEvent('page', { timeout: 3000 }).catch(() => null)
  await session.send('Extensions.triggerAction', { id, targetId: targetInfo.targetId })
  const transientPopup = await actionPopup
  if (transientPopup && transientPopup !== popup && transientPopup !== fixture) await transientPopup.close()
  await fixture.bringToFront()
  await popup.getByText('Revisar imágenes (1)', { exact: true }).evaluate(summary => summary.click())
  await click('Leer imagen visible 1')
  await popup.getByLabel('Texto reconocido 1', { exact: true }).waitFor({ timeout: 120_000 })
  assert.match((await popup.getByLabel('Texto reconocido 1', { exact: true }).inputValue()).toLowerCase(), /password|contrasena|contraseña/)
  await popup.getByRole('button', { name: 'Analizar localmente', exact: true }).waitFor({ state: 'visible' })
  // También soporta imagen original cargada explícitamente.
  await popup.getByLabel('Cargar imagen 1', { exact: true }).setInputFiles(imageFile)
  await popup.getByText(/OCR terminado\./).waitFor({ timeout: 120_000 })
  await popup.getByLabel('Texto reconocido 1', { exact: true }).waitFor({ timeout: 120_000 })
  assert.match((await popup.getByLabel('Texto reconocido 1', { exact: true }).inputValue()).toLowerCase(), /password|contrasena|contraseña/)
  await click('Confirmar texto revisado 1')
  await click('Analizar localmente')
  await popup.getByRole('heading', { name: 'Posible phishing', exact: true }).waitFor({ timeout: 120_000 })
  await popup.screenshot({ path: path.join(artifacts, '05-ocr.png'), fullPage: true })
  // Importar el original aporta cabeceras declaradas, sin certificar sus firmas.
  const eml = path.join(artifacts, 'invoice.eml')
  await writeFile(eml, 'From: Billing <billing@example.org>\r\nSubject: Your invoice is ready\r\nAuthentication-Results: example.org; spf=pass; dkim=pass; dmarc=pass\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nYour monthly statement is ready for review. If you already paid, disregard this email. Amount due: zero. Thank you for your business.')
  await popup.locator('#eml-file').setInputFiles(eml)
  await popup.locator('.result').waitFor({ timeout: 120_000 })
  await popup.getByText('Detalles del resultado', { exact: true }).evaluate(summary => summary.click())
  assert.match(await popup.locator('.result').innerText(), /No se verificaron firmas/)
  // Una página sin un correo soportado produce error y descarta el resultado anterior.
  await fixture.goto('http://127.0.0.1:5174/')
  await fixture.bringToFront()
  await click('Volver a leer')
  await popup.getByRole('alert').waitFor()
  assert.equal(await popup.locator('.result').count(), 0)
  assert.deepEqual(errors, [])
  assert.deepEqual(external, [])
  console.log('PASS: categorías del corpus, factura con recomendación tranquila, OCR real local, .eml y cabeceras no verificadas, sin red externa ni errores JS.')
  console.log(`Capturas: ${artifacts}`)
} finally {
  await context.close()
}
