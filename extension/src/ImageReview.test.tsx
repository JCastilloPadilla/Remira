import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import { ImageReview } from './ImageReview'

vi.mock('./ocr', async importOriginal => ({
  ...await importOriginal<typeof import('./ocr')>(),
  captureMessageImage: async () => document.createElement('canvas'),
  recognizeLocalImage: async () => ({ text: 'Send your password', confidence: 94 }),
}))
afterEach(() => { document.body.innerHTML = '' })

it('requiere confirmar el texto OCR incluso cuando el motor puntúa alto', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const host = document.createElement('div'); document.body.append(host)
  const root = createRoot(host)
  let pending = -1
  const email = { subject: '', body: '', coverage: { images_total: 1, images_pending: 1 }, images: [{ id: 'one', alt: 'Aviso', visible: true, rect: { x: 0, y: 0, width: 100, height: 40 }, viewport: { width: 400, height: 300 } }] }
  await act(async () => root.render(<ImageReview email={email} tab={{ id: 1, url: '' }} disabled={false} onChange={(_text, coverage) => { pending = coverage.images_pending }} onBusy={() => {}} />))
  await act(async () => { Array.from(host.querySelectorAll('button')).find(button => button.textContent === 'Leer imagen visible 1')!.click() })
  expect(host.querySelector('textarea')?.value).toBe('Send your password')
  expect(pending).toBe(1)
  await act(async () => { Array.from(host.querySelectorAll('button')).find(button => button.textContent === 'Confirmar texto revisado 1')!.click() })
  expect(pending).toBe(0)
  await act(async () => root.unmount())
})
