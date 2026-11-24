export interface EmailPreview {
  subject: string
  body: string
  sender?: string
  links?: { text: string; url: string }[]
  images?: MessageImage[]
  messageKey?: string
  coverage?: Coverage
  authentication?: Authentication
}

export interface Coverage { images_total: number; images_pending: number; ocr_low_confidence?: boolean; links_complete?: boolean }
export interface Authentication { source: string; spf?: string; dkim?: string; dmarc?: string; verified?: boolean }
export interface Rect { x: number; y: number; width: number; height: number }
export interface MessageImage { id: string; alt: string; rect: Rect; viewport: { width: number; height: number }; visible: boolean }

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

  const visibility = new Map<Element, boolean>()
  const visualVisibility = new Map<Element, boolean>()
  function visuallyHidden(element: Element): boolean {
    const known = visualVisibility.get(element)
    if (known !== undefined) return known
    const style = getComputedStyle(element)
    const result = style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || style.opacity === '0'
      || (!!element.parentElement && visuallyHidden(element.parentElement))
    visualVisibility.set(element, result)
    return result
  }
  function hidden(element: Element): boolean {
    const known = visibility.get(element)
    if (known !== undefined) return known
    const style = getComputedStyle(element)
    const result = element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true'
      || style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || style.opacity === '0'
      || (!!element.parentElement && hidden(element.parentElement))
    visibility.set(element, result)
    return result
  }

  function text(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || ''
    if (!(node instanceof Element) || hidden(node)) return ''
    if (node.matches('script, style, noscript, input, textarea, select, button, iframe, blockquote, .gmail_quote, .gmail_quote_container, [contenteditable="true"], [contenteditable=""]')) return ''
    if (node.tagName === 'BR') return '\n'
    if (node.tagName === 'IMG') return node.getAttribute('alt') ? ` [Imagen: ${node.getAttribute('alt')}] ` : ''
    const result = Array.from(node.childNodes).map(text).join('')
    return /^(P|DIV|LI|TR|TD|TH|H[1-6]|SECTION|ARTICLE)$/.test(node.tagName) ? `${result}\n` : result
  }

  function clean(element: Element | null): string {
    return element ? text(element).replace(/[^\S\n]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim() : ''
  }

  const root = fixture ? document.body : Array.from(document.querySelectorAll('[role="main"]')).find(element => !hidden(element))
  if (!root) return { emails: [], error: 'Abre un correo y espera a que termine de cargar.' }
  const subject = fixture ? '' : clean(root.querySelector('h2.hP, h2[data-thread-perm-id]'))
  const bodies = Array.from(root.querySelectorAll(fixture ? '[data-remira-test-email] [data-body]' : '.a3s.aiL'))
    .filter(element => !hidden(element) && !element.closest('[contenteditable="true"], [contenteditable=""]'))
  // Solo geometría de otros elementos: no se lee ni se copia su contenido.
  // Rechazo conservador: incluso una caja transparente superpuesta obliga a usar archivo.
  const allElements = Array.from(document.body.querySelectorAll('*'))
  const canCheckOverlays = allElements.length <= 10000
  const overlays = canCheckOverlays ? allElements.filter(candidate => !visuallyHidden(candidate)).map(candidate => ({ candidate, rect: candidate.getBoundingClientRect() })) : []
  const emails = bodies.map(element => {
    const container = element.closest(fixture ? '[data-remira-test-email]' : '.adn')
    const body = clean(element)
    const imageElements = Array.from(element.querySelectorAll('img')).filter(image => {
      if (hidden(image) || image.closest('blockquote, .gmail_quote, .gmail_quote_container, [contenteditable="true"]')) return false
      const width = image.naturalWidth || image.width || image.getBoundingClientRect().width
      const height = image.naturalHeight || image.height || image.getBoundingClientRect().height
      return !(width > 0 && height > 0 && width <= 2 && height <= 2)
    })
    let fingerprint = 2166136261
    const material = body + imageElements.map(image => image.currentSrc || image.src).join('|')
    for (let index = 0; index < material.length; index++) fingerprint = Math.imul(fingerprint ^ material.charCodeAt(index), 16777619)
    const messageKey = `${bodies.indexOf(element)}-${fingerprint >>> 0}`
    const images = imageElements.slice(0, 30).map((image, index) => {
      const rect = image.getBoundingClientRect()
      const points = [
        [rect.x + 1, rect.y + 1], [rect.right - 1, rect.y + 1], [rect.x + 1, rect.bottom - 1], [rect.right - 1, rect.bottom - 1],
        [rect.x + rect.width / 2, rect.y + rect.height / 2],
      ]
      const exposed = typeof document.elementFromPoint === 'function' && points.every(([x, y]) => {
        const hit = document.elementFromPoint(x, y)
        return hit === image
      })
      const intersects = (other: DOMRect | DOMRectReadOnly) => other.width > 0 && other.height > 0
        && other.left < rect.right && other.right > rect.left && other.top < rect.bottom && other.bottom > rect.top
      const overlapping = overlays.some(({ candidate, rect: other }) => candidate !== image && !candidate.contains(image) && intersects(other))
      let textOverlap = false
      for (let parent = image.parentElement; parent && !textOverlap; parent = parent.parentElement) {
        for (const child of Array.from(parent.childNodes)) {
          if (child.nodeType !== Node.TEXT_NODE) continue
          const range = document.createRange(); range.selectNodeContents(child)
          if (typeof range.getClientRects === 'function' && Array.from(range.getClientRects()).some(intersects)) { textOverlap = true; break }
        }
      }
      return { id: `${messageKey}-${index}`, alt: image.alt || `Imagen ${index + 1}`,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        viewport: { width: innerWidth, height: innerHeight },
        visible: canCheckOverlays && !overlapping && !textOverlap && exposed && rect.width > 0 && rect.height > 0 && rect.x >= 0 && rect.y >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight }
    })
    const anchors = Array.from(element.querySelectorAll('a[href]')).filter(anchor => !hidden(anchor)
      && !anchor.closest('blockquote, .gmail_quote, .gmail_quote_container, [contenteditable="true"]'))
    const links = anchors.slice(0, 100).map(anchor => ({ text: clean(anchor), url: (anchor as HTMLAnchorElement).href }))
    return {
      subject: fixture ? clean(container?.querySelector('[data-subject]') || null) : subject,
      body,
      sender: container?.querySelector('[email]')?.getAttribute('email') || undefined,
      links, images, messageKey,
      coverage: { images_total: imageElements.length, images_pending: imageElements.length, links_complete: anchors.length <= 100 },
    }
  }).filter(email => email.body.length > 0 || email.images.length > 0)
  if (!emails.length) return { emails: [], error: 'Abre un correo y expande su contenido. La bandeja y los borradores no se analizan.' }
  if (emails.some(email => email.subject.length > 5000 || email.body.length > 100_000)) {
    return { emails: [], error: 'El mensaje excede el límite de esta versión (100,000 caracteres de cuerpo).' }
  }
  return { emails }
}
