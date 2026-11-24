import { access } from 'node:fs/promises'
try {
  for (const filename of ['public/ocr/worker.min.js', 'public/ocr/lang/spa.traineddata.gz', 'public/ocr/lang/eng.traineddata.gz']) await access(filename)
} catch { throw new Error('Faltan assets locales de OCR. Ejecuta npm run setup:ocr antes de compilar.') }
