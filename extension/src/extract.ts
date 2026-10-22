export interface EmailPreview {
  subject: string
  body: string
  sender?: string
}

export interface Extraction {
  emails: EmailPreview[]
  error?: string
}

// Autocontenida: Chrome serializa esta función y la ejecuta en la página.
// No referenciar imports, constantes del módulo ni cierres externos aquí.
export function extractOpenEmails(pageUrl = location.href): Extraction {
  const url = new URL(pageUrl)
  const gmail = url.protocol === 'https:' && url.hostname === 'mail.google.com'
  const fixture = url.origin === 'http://127.0.0.1:5174' && url.pathname === '/test-email.html'
  if (!gmail && !fixture) {
    return { emails: [], error: 'Esta versión lee Gmail web o la página local de pruebas. Abre un correo en Gmail.' }
  }

  function hidden(element: Element): boolean {
    let current: Element | null = element
    while (current) {
      const style = getComputedStyle(current)
      if (current.hasAttribute('hidden') || current.getAttribute('aria-hidden') === 'true'
        || style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return true
      current = current.parentElement
    }
    return false
  }

  function text(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || ''
    if (!(node instanceof Element) || hidden(node)) return ''
    if (node.matches('script, style, noscript, input, textarea, select, button, iframe, blockquote, .gmail_quote, .gmail_quote_container, [contenteditable="true"], [contenteditable=""]')) return ''
    if (node.tagName === 'BR') return '\n'
    const result = Array.from(node.childNodes).map(text).join('')
    return /^(P|DIV|LI|TR|H[1-6]|SECTION|ARTICLE)$/.test(node.tagName) ? `${result}\n` : result
  }

  function clean(element: Element | null): string {
    return element ? text(element).replace(/[^\S\n]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim() : ''
  }

  const root = fixture ? document.body : Array.from(document.querySelectorAll('[role="main"]')).find(element => !hidden(element))
  if (!root) return { emails: [], error: 'Abre un correo y espera a que termine de cargar.' }
  const subject = fixture ? '' : clean(root.querySelector('h2.hP, h2[data-thread-perm-id]'))
  const bodies = Array.from(root.querySelectorAll(fixture ? '[data-remira-test-email] [data-body]' : '.a3s.aiL'))
    .filter(element => !hidden(element) && !element.closest('[contenteditable="true"], [contenteditable=""]'))
  const emails = bodies.map(element => {
    const container = element.closest(fixture ? '[data-remira-test-email]' : '.adn')
    return {
      subject: fixture ? clean(container?.querySelector('[data-subject]') || null) : subject,
      body: clean(element),
      sender: container?.querySelector('[email]')?.getAttribute('email') || undefined,
    }
  }).filter(email => email.body.length > 0)
  if (!emails.length) return { emails: [], error: 'Abre un correo y expande su contenido. La bandeja y los borradores no se analizan.' }
  if (emails.some(email => email.subject.length > 5000 || email.body.length > 100_000)) {
    return { emails: [], error: 'El mensaje excede el límite de esta versión (100,000 caracteres de cuerpo).' }
  }
  return { emails }
}
