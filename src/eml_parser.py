"""Bounded MIME extraction; no attachment storage, rendering or remote requests."""
from email import policy
from email.parser import BytesParser
from html.parser import HTMLParser
import re

from src.analysis_engine import URL_RE

MAX_EML_BYTES = 8 * 1024 * 1024


class MailHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.text, self.links = [], []
        self.anchor = None
        self.hidden = 0
        self.images = 0

    def finish_anchor(self):
        if self.anchor and self.anchor['url']:
            self.links.append(self.anchor)
        self.anchor = None

    def close(self):
        super().close()
        self.finish_anchor()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'):
            self.hidden += 1
        if self.hidden:
            return
        if tag == 'img':
            self.images += 1
        if tag == 'a':
            self.finish_anchor()
            self.anchor = {'url': attrs.get('href', ''), 'text': ''}
        if tag in ('p', 'div', 'br', 'li', 'tr'):
            self.text.append('\n')

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.hidden = max(0, self.hidden - 1)
        if tag == 'a' and self.anchor:
            self.finish_anchor()

    def handle_data(self, data):
        if not self.hidden:
            self.text.append(data)
            if self.anchor:
                self.anchor['text'] += data


def parse_eml(raw):
    if not raw or len(raw) > MAX_EML_BYTES:
        raise ValueError('Archivo .eml vacío o mayor de 8 MiB.')
    message = BytesParser(policy=policy.default).parsebytes(raw)
    texts, links = [], []
    images = 0
    pending = [(message, 0, None)]
    count = 0
    while pending:
        part, depth, preferred_id = pending.pop()
        count += 1
        if count > 100 or depth > 20:
            raise ValueError('El correo contiene demasiadas partes MIME o anidamiento.')
        if part.get_content_disposition() == 'attachment':
            if part.get_content_maintype() == 'image':
                images += 1
            continue
        if part.get_content_type() == 'message/rfc822':
            continue
        if part.is_multipart():
            if part.get_content_subtype() == 'alternative' and preferred_id is None:
                # Gmail renderiza HTML si existe: el texto plano puede ser un señuelo.
                preferred = part.get_body(preferencelist=('html', 'plain'))
                preferred_id = id(preferred) if preferred is not None else None
            pending.extend((child, depth + 1, preferred_id) for child in reversed(list(part.iter_parts())))
            continue
        if part.get_content_maintype() == 'image':
            images += 1
        if part.is_multipart() or part.get_content_disposition() == 'attachment' or part.get_content_type() not in ('text/plain', 'text/html'):
            continue
        try:
            content = part.get_content()
        except (LookupError, UnicodeError, ValueError):
            raise ValueError('No se pudo decodificar el texto MIME.') from None
        if not isinstance(content, str):
            continue
        if part.get_content_type() == 'text/html':
            parser = MailHTML()
            parser.feed(content)
            parser.close()
            if preferred_id is None or preferred_id == id(part):
                texts.append(''.join(parser.text))
            links.extend(parser.links)
            images += parser.images
        else:
            if preferred_id is None or preferred_id == id(part):
                texts.append(content)
    body = '\n'.join(dict.fromkeys(texts))
    if len(body) > 100000:
        raise ValueError('El texto extraído supera los 100,000 caracteres.')
    supplied = {link['url'] for link in links}
    links.extend({'url': url, 'text': url} for url in dict.fromkeys(URL_RE.findall(body)) if url not in supplied)
    auth = {'source': 'eml_declared_headers', 'verified': False}
    # Headers may be forged. Multiple declarations are retained, never treated as proof.
    headers = '; '.join(str(x) for x in message.get_all('Authentication-Results', []))
    for key in ('spf', 'dkim', 'dmarc'):
        values = re.findall(r'\b' + key + r'\s*=\s*([a-zA-Z_-]+)', headers, re.I)
        if values:
            auth[key] = ', '.join(dict.fromkeys(x.lower() for x in values))[:1000]
    return {'subject': str(message.get('subject', '')), 'sender': str(message.get('from', '')), 'body': body, 'links': links, 'coverage': {'images_total': images, 'images_pending': images, 'ocr_low_confidence': False, 'links_complete': True}, 'authentication': auth}
