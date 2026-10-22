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
})
