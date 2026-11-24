// Solo preparación de assets públicos del motor; nunca accede a correos.
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { gzipSync, gunzipSync } from 'node:zlib'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'public/ocr')
const revision = '87416418657359cb625c412a48b6e1d6d41c29bd'
const expected = { spa: '6f2e04d02774a18f01bed44b1111f2cd7f3ba7ac9dc4373cd3f898a40ea6b464', eng: '7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2' }
await mkdir(path.join(output, 'core'), { recursive: true })
await mkdir(path.join(output, 'lang'), { recursive: true })
await mkdir(path.join(output, 'licenses'), { recursive: true })
await copyFile(path.join(root, 'node_modules/tesseract.js/LICENSE.md'), path.join(output, 'licenses', 'tesseract-js-LICENSE.md'))
await copyFile(path.join(root, 'node_modules/tesseract.js-core/LICENSE'), path.join(output, 'licenses', 'tesseract-core-tessdata-Apache-2.0.txt'))
await copyFile(path.join(root, 'node_modules/tesseract.js/dist/worker.min.js'), path.join(output, 'worker.min.js'))
for (const filename of await readdir(path.join(root, 'node_modules/tesseract.js-core'))) {
  if (/\.wasm(\.js)?$/.test(filename)) await copyFile(path.join(root, 'node_modules/tesseract.js-core', filename), path.join(output, 'core', filename))
}
const provenance = {}
for (const language of ['spa', 'eng']) {
  const target = path.join(output, 'lang', `${language}.traineddata.gz`)
  let bytes
  try { bytes = await readFile(target) } catch {
    const url = `https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/${revision}/${language}.traineddata`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`No se pudo descargar ${language}: HTTP ${response.status}`)
    const raw = Buffer.from(await response.arrayBuffer())
    if (raw.length < 100_000 || raw.length > 30_000_000) throw new Error('Tamaño inesperado de datos OCR.')
    bytes = gzipSync(raw)
    await writeFile(target, bytes)
  }
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  const rawSha256 = createHash('sha256').update(gunzipSync(bytes)).digest('hex')
  if (rawSha256 !== expected[language]) throw new Error(`Checksum inesperado de ${language}. No se empaquetarán datos OCR desconocidos.`)
  provenance[language] = { sha256, rawSha256, bytes: bytes.length, revision }
}
await writeFile(path.join(output, 'assets.json'), JSON.stringify(provenance, null, 2))
await writeFile(path.join(output, 'licenses', 'SOURCES.txt'), `Tesseract.js y Tesseract.js-core: Apache-2.0, versiones fijadas en package-lock.json.\nDatos OCR: https://github.com/tesseract-ocr/tessdata_fast, revisión ${revision}, Apache-2.0.\nSHA-256 de los datos originales y comprimidos en assets.json.\n`)
console.log('OCR spa+eng preparado. Durante el reconocimiento todos los assets se leen desde la extensión.')
