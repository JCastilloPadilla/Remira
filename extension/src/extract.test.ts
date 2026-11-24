import { beforeEach, describe, expect, it } from 'vitest'
import { extractOpenEmails } from './extract'

// Gmail cambia su DOM; fixtures sintéticas, no sustituyen probar una cuenta real.
const gmail = 'https://mail.google.com/mail/u/0/#inbox/test'

beforeEach(() => { document.body.innerHTML = '' })

describe('extracción puntual de Gmail', () => {
  it('lee asunto y mensajes visibles sin texto citado ni mensajes ocultos', () => {
    document.body.innerHTML = `<main role="main"><h2 class="hP">Aviso de cuenta</h2>
      <div class="adn"><span email="sender@example.com">Persona</span><div class="a3s aiL">Verifica tu cuenta<blockquote>Texto anterior</blockquote><script>secreto()</script></div></div>
      <div class="adn" hidden><div class="a3s aiL">Oculto</div></div>
      <div class="adn"><div class="a3s aiL">Segundo mensaje</div></div></main>`
    const result = extractOpenEmails(gmail)
    expect(result.emails).toHaveLength(2)
    expect(result.emails[0]).toMatchObject({ subject: 'Aviso de cuenta', body: 'Verifica tu cuenta', sender: 'sender@example.com' })
    expect(result.emails[1].body).toBe('Segundo mensaje')
  })

  it('no lee una bandeja ni usa el texto de toda la página', () => {
    document.body.innerHTML = '<main role="main">Bandeja Contraseña privada</main>'
    expect(extractOpenEmails(gmail).emails).toEqual([])
    expect(extractOpenEmails(gmail).error).toMatch(/Abre un correo/)
  })

  it('rechaza otros sitios aunque imiten selectores de Gmail', () => {
    document.body.innerHTML = '<div class="a3s aiL">Datos privados</div>'
    expect(extractOpenEmails('https://example.org').emails).toEqual([])
  })

  it('excluye mensajes con ancestros ocultos y contenido editable', () => {
    document.body.innerHTML = `<main role="main"><h2 class="hP">Asunto</h2>
    <section style="display:none"><div class="a3s aiL">Oculto</div></section>
    <div contenteditable="true"><div class="a3s aiL">Borrador privado</div></div>
    <div class="a3s aiL">Visible<span style="display:none">secreto</span><input value="clave"></div></main>`
    expect(extractOpenEmails(gmail).emails.map(email => email.body)).toEqual(['Visible'])
  })

  it('conserva separaciones entre párrafos', () => {
    document.body.innerHTML = '<main role="main"><div class="a3s aiL"><p>Hola</p><p>Verifica tu cuenta</p>Gracias<br>Equipo</div></main>'
    expect(extractOpenEmails(gmail).emails[0].body).toBe('Hola\nVerifica tu cuenta\nGracias\nEquipo')
  })

  it('lee únicamente fixtures marcadas en el servidor local de pruebas', () => {
    document.body.innerHTML = '<article data-remira-test-email><h2 data-subject>Prueba local</h2><div data-body>Contenido de prueba</div></article>'
    expect(extractOpenEmails('http://127.0.0.1:5174/test-email.html').emails[0].body).toBe('Contenido de prueba')
    expect(extractOpenEmails('https://example.org/test-email.html').emails).toEqual([])
  })

  it('conserva mensajes solo imagen y marca contenido pendiente en lugar de descartarlos', () => {
    document.body.innerHTML = '<main role="main"><h2 class="hP">Aviso</h2><div class="a3s aiL"><img src="https://images.example/invoice.png" width="600" height="300" alt="Factura"></div></main>'
    const email = extractOpenEmails(gmail).emails[0]
    expect(email).toBeDefined()
    expect(email.images).toHaveLength(1)
    expect(email.images![0].alt).toBe('Factura')
    expect(email.coverage?.images_pending).toBe(1)
    expect(email.body).toContain('Factura')
  })

  it('recoge destinos reales sin visitar enlaces ni incluir citas o editores', () => {
    document.body.innerHTML = '<main role="main"><div class="a3s aiL"><a href="https://evil.example/login">https://microsoft.com</a><blockquote><a href="https://old.example">Viejo</a></blockquote><img hidden src="https://private.example/x" width="300" height="300"></div></main>'
    const email = extractOpenEmails(gmail).emails[0]
    expect(email.links).toEqual([{ text: 'https://microsoft.com', url: 'https://evil.example/login' }])
    expect(email.images).toEqual([])
  })

  it('el identificador cambia si cambia el mensaje y no mezcla texto de imágenes ocultas', () => {
    document.body.innerHTML = '<main role="main"><div class="a3s aiL">Texto inicial</div></main>'
    const first = extractOpenEmails(gmail).emails[0].messageKey
    document.querySelector('.a3s')!.textContent = 'Otro mensaje'
    expect(extractOpenEmails(gmail).emails[0].messageKey).not.toBe(first)
  })

  it('no permite capturar una imagen tapada por contenido de otro panel', () => {
    document.body.innerHTML = '<main role="main"><div class="a3s aiL"><img src="https://img.example/a.png" width="100" height="100"></div></main><div id="overlay">Otro contenido privado</div>'
    const image = document.querySelector('img')!
    image.getBoundingClientRect = () => ({ x: 10, y: 10, width: 100, height: 100, right: 110, bottom: 110, left: 10, top: 10, toJSON: () => ({}) })
    Object.defineProperty(document, 'elementFromPoint', { value: () => document.getElementById('overlay'), configurable: true })
    expect(extractOpenEmails(gmail).emails[0].images![0].visible).toBe(false)
    Object.defineProperty(document, 'elementFromPoint', { value: () => image, configurable: true })
    expect(extractOpenEmails(gmail).emails[0].images![0].visible).toBe(true)
  })
  it('no descarta líneas de texto en imágenes pequeñas ni imágenes todavía sin cargar', () => {
    document.body.innerHTML = '<main role="main"><div class="a3s aiL"><img src="https://img.example/text.png" width="600" height="16"><img src="https://img.example/pending.png"><img src="https://img.example/pixel" width="1" height="1"></div></main>'
    expect(extractOpenEmails(gmail).emails[0].coverage?.images_total).toBe(2)
  })
  it.each([false, true])('rechaza un overlay pequeño con pointer-events none (aria-hidden=%s)', ariaHidden => {
    document.body.innerHTML = '<main role="main"><div class="a3s aiL"><img src="https://img.example/a.png" width="400" height="300"></div></main><div id="overlay" style="position:fixed;pointer-events:none">Otro texto</div>'
    const image = document.querySelector('img')!
    const box = (x: number, y: number, width: number, height: number) => ({ x, y, width, height, right: x + width, bottom: y + height, left: x, top: y, toJSON: () => ({}) })
    image.getBoundingClientRect = () => box(10, 10, 400, 300)
    document.getElementById('overlay')!.getBoundingClientRect = () => box(40, 70, 100, 50)
    if (ariaHidden) document.getElementById('overlay')!.setAttribute('aria-hidden', 'true')
    Object.defineProperty(document, 'elementFromPoint', { value: () => image, configurable: true })
    expect(extractOpenEmails(gmail).emails[0].images![0].visible).toBe(false)
  })
})
