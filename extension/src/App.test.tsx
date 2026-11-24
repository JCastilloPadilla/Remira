import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { App } from './App'

let container: HTMLDivElement
let root: Root
let messages = [{ subject: 'Primero', body: 'Contenido uno' }, { subject: 'Segundo', body: 'Contenido dos' }]

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  messages = [{ subject: 'Primero', body: 'Contenido uno' }, { subject: 'Segundo', body: 'Contenido dos' }]
  vi.stubGlobal('chrome', {
    tabs: { query: async () => [{ id: 1 }] },
    scripting: { executeScript: async () => [{ result: { emails: messages } }] },
  })
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

async function click(label: string) {
  const button = Array.from(container.querySelectorAll('button')).find(item => item.textContent === label)
  expect(button).toBeDefined()
  await act(async () => button!.click())
}

it('lee solo por acción y exige elegir un mensaje si hay varios visibles', async () => {
  await act(async () => root.render(<App />))
  expect(container.querySelector('textarea')).toBeNull()
  await click('Leer correo abierto')
  expect(container.querySelector('textarea')).toBeNull()
  const select = container.querySelector('select')!
  await act(async () => { select.value = '1'; select.dispatchEvent(new Event('change', { bubbles: true })) })
  expect(container.querySelector('textarea')?.value).toBe('Contenido dos')
})

it('muestra el resultado real y lo descarta al releer otro correo', async () => {
  messages = [messages[0]]
  vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ label: 'spam', confidence: 0.99999, max_tokens: 512, model: 'Tanaos', language: 'es', task: 'spam_detection',
    assessment: { verdict: 'inconclusive', reasons: [{ code: 'model_auxiliary_flag', severity: 'info', message: 'Opinión auxiliar del modelo.' }], limitations: [], text: { language: 'es', token_count: 10, processed_tokens: 10, truncated: false }, coverage: { images_total: 0, images_pending: 0, ocr_low_confidence: false, links_complete: true }, links: [], authentication: { source: 'unavailable', verified: false } } })))
  await act(async () => root.render(<App />))
  await click('Leer correo abierto')
  await click('Analizar localmente')
  expect(container.textContent).toContain('Actualiza el análisis local')
  expect(container.textContent).toContain('spam')
  expect(container.textContent).not.toContain('Potencialmente malicioso')
  expect(container.textContent).not.toContain('100.0 %')
  messages = [{ subject: 'Nuevo', body: 'Otro contenido' }]
  await click('Volver a leer')
  expect(container.textContent).not.toContain('Actualiza el análisis local')
  expect(container.querySelector('textarea')?.value).toBe('Otro contenido')
})


it('mantiene la acción principal fuera de los detalles y la edición colapsada', async () => {
  messages = [messages[0]]
  await act(async () => root.render(<App />))
  expect(container.querySelector('#eml-file')?.closest('details')?.open).toBe(false)
  await click('Leer correo abierto')
  expect(container.querySelector('#body')?.closest('details')?.open).toBe(false)
  const analyze = [...container.querySelectorAll('button')].find(button => button.textContent === 'Analizar localmente')
  expect(analyze?.closest('details')).toBeNull()
})
