"""Presentación de estimaciones del corpus sin confundir finalidad y riesgo."""
import math
import re
import unicodedata


class CorpusNotReadyError(RuntimeError):
    """No hay un artefacto válido para dar una estimación del corpus."""


PRIMARY = {'legitimate': 'likely_legitimate', 'spam': 'possible_spam', 'phishing': 'possible_phishing', 'malicious': 'possible_malicious'}


def normalized(text):
    return ''.join(character for character in unicodedata.normalize('NFKD', text.lower()) if not unicodedata.combining(character))


def require_readable_content(payload):
    body = re.sub(r'\[Imagen:[^\]]*\]', '', payload.get('body', ''), flags=re.I).strip()
    if payload.get('coverage', {}).get('images_pending', 0) and not body:
        raise ValueError('Falta leer el texto de la imagen. Usa OCR y confirma el texto antes de clasificar.')


def detect_purpose(payload, hint=None):
    text = normalized(payload.get('subject', '') + '\n' + payload.get('body', ''))
    patterns = {
        'invoice_word': r'\b(?:factura|invoice|estado de cuenta|billing statement)\b',
        'invoice_number': r'\b(?:invoice\s*(?:number|no\.?|#)|factura\s*(?:numero|nro\.?|no\.?|#)|numero de factura)\b',
        'amount': r'\b(?:amount|importe|monto|total|saldo)\s*(?:due)?\s*:?\s*(?:\$|usd|mxn|eur)?\s*\d',
        'billing_period': r'\b(?:billing period|periodo de facturacion|periodo|billing cycle)\b',
        'due_date': r'\b(?:due date|fecha de vencimiento|vencimiento|billing date|fecha de facturacion)\b',
    }
    basis = [key for key, pattern in patterns.items() if re.search(pattern, text)]
    if re.search(r'\b(?:pago recibido|payment received|compra confirmada|confirmacion de compra|purchase confirmation|comprobante de pago)\b', text):
        return {'kind': 'receipt', 'basis': ['payment_confirmation']}
    if 'invoice_word' in basis and len(basis) >= 2:
        return {'kind': 'invoice', 'basis': basis}
    if re.search(r'\b(?:solicitud de pago|aviso de cobro|pago pendiente|payment request|payment due|amount due|saldo pendiente|cobro|transferencia pendiente)\b', text):
        return {'kind': 'payment_request', 'basis': ['payment_request']}
    if re.search(r'\b(?:ofertas?|descuentos?|promociones?|promocion|cupon|coupons?|discount|special offer|sale)\b', text):
        return {'kind': 'advertisement', 'basis': ['promotional_language']}
    if re.search(r'\b(?:aviso de seguridad|alerta de cuenta|account notice|security alert|account security|cuenta bloqueada|account suspended)\b', text):
        return {'kind': 'account_notice', 'basis': ['account_notice']}
    if hint in {'ordinary', 'account_notice', 'advertisement', 'receipt'}:
        return {'kind': hint, 'basis': ['corpus_purpose_estimate']}
    return {'kind': 'other', 'basis': []}


def has_positive_command(text, pattern):
    # No enlazar una orden de un documento con otra oración sobre un ejecutable.
    for clause in re.split(r'(?<=[.!?])\s+|[\n\r;,]+', normalized(text)):
        for match in re.finditer(pattern, clause, re.I):
            if not is_negated(clause, match.start()):
                return True
    return False


def is_negated(text, start):
    prefix = normalized(text[max(0, start - 180):start])
    # Una negación no atraviesa fin de oración ni una conjunción de contraste.
    clause = re.split(r'[.!?;\n\r,:]|\b(?:but|however|pero|sin embargo|no obstante)\b', prefix)[-1]
    return bool(re.search(r"\b(?:never|not|don't|no|nunca|jamas)(?:\s+[\w']+){0,12}\s*$", clause))


def malicious_structure(payload, evidence):
    text = payload.get('subject', '') + '\n' + payload.get('body', '')
    macros = has_positive_command(text, r'\b(?:habilit(?:a|ar|e|es|en)|activ(?:a|ar|e|es|en)|enable|turn on)\b[^.!?\n]{0,65}\b(?:macros?|contenido activo|active content)\b')
    executable = has_positive_command(text, r'\b(?:descarga|descargue|download|ejecuta|ejecute|ejecutar|run|launch|open|abre)\b[^\n]{0,140}\.(?:exe|scr|vbs|js|cmd|bat|ps1|msi|dll)\b')
    if macros or executable:
        return {'code': 'execution_instruction', 'severity': 'danger', 'message': 'El mensaje pide habilitar macros o ejecutar contenido potencialmente peligroso. No se ha inspeccionado el archivo.'}
    return None


def decide_email(payload, evidence, prediction):
    scores = prediction.get('scores', {}) if isinstance(prediction, dict) else {}
    if set(PRIMARY) - set(scores) or any(type(scores[key]) not in (int, float) or not math.isfinite(scores[key]) or not 0 <= scores[key] <= 1 for key in PRIMARY):
        raise CorpusNotReadyError('El clasificador del corpus no devolvió estimaciones válidas. Revisa el artefacto entrenado.')
    version = prediction.get('model_version')
    if not isinstance(version, str) or not version:
        raise CorpusNotReadyError('Falta la versión del modelo entrenado.')
    purpose = detect_purpose(payload, prediction.get('purpose'))
    execution = malicious_structure(payload, evidence)
    if execution and not any(reason['code'] == execution['code'] for reason in evidence['reasons']):
        evidence['reasons'].append(execution)
    codes = {reason['code'] for reason in evidence['reasons']}
    phishing = bool(codes & {'requests_sensitive_data', 'display_host_mismatch', 'embedded_credentials'})
    ranking = sorted(PRIMARY, key=lambda key: scores[key], reverse=True)
    top = ranking[0]
    coverage = evidence['coverage']
    incomplete = bool(coverage.get('images_pending') or coverage.get('ocr_low_confidence') or coverage.get('links_complete') is False)
    narrow_margin = scores[top] - scores[ranking[1]] < .15
    corpus_truncated = bool(prediction.get('truncated', False))
    weak = narrow_margin or scores[top] < .60 or incomplete or evidence['text'].get('truncated', False) or corpus_truncated or evidence['text'].get('language') not in {'es', 'en'}
    needs_review = not (execution or phishing) and (top in {'phishing', 'malicious'} or (top == 'spam' and weak))
    selected = 'malicious' if execution else 'phishing' if phishing else top
    primary = 'needs_review' if needs_review else PRIMARY[selected]
    secondary = ['possible_phishing'] if execution and phishing else []
    # Conserva la hipótesis principal del modelo cuando la evidencia no basta.
    if needs_review:
        secondary.append(PRIMARY[top])
    secondary.extend(PRIMARY[target] for target in ('malicious', 'phishing', 'spam') if PRIMARY[target] != primary and scores[target] >= .5 and PRIMARY[target] not in secondary)
    strength = 'strong' if execution or phishing else 'weak' if needs_review or weak else 'moderate'
    warnings = list(prediction.get('warnings', []))
    if prediction.get('provisional', True) and not any(re.search(r'experimental|sint[eé]tic|provisional', warning, re.I) for warning in warnings):
        warnings.append('Clasificador experimental: algunas categorías se apoyan en estructuras sintéticas; falta validación representativa en correo real.')
    if strength == 'weak' and not needs_review:
        warnings.append('Estimación débil: compara las señales y el contexto antes de actuar.')
    if incomplete:
        warnings.append('Lectura incompleta: faltan imágenes, OCR revisado o destinos de enlaces.')
    if evidence['text'].get('truncated'):
        warnings.append('El modelo auxiliar recortó texto a su límite de tokens; su diagnóstico no cubre el mensaje completo.')
    if corpus_truncated:
        warnings.append(f"El clasificador del corpus procesó {prediction.get('processed_characters', 0)} de {prediction.get('total_characters', 0)} caracteres normalizados. Las reglas estructurales revisaron el texto recibido completo.")
    warnings.append('Identidad del remitente no verificada. La categoría es una estimación, no una confirmación de seguridad.')
    financial = purpose['kind'] in {'invoice', 'payment_request', 'receipt'}
    if needs_review:
        recommendation = 'El modelo detectó un patrón inusual y la evidencia es insuficiente para dar una alerta específica. Confirma cualquier solicitud desde tu acceso habitual al servicio antes de abrir enlaces o adjuntos.'
    elif selected in {'phishing', 'malicious'}:
        prefix = 'Tiene formato de factura o cobro, pero presenta señales de riesgo. ' if financial else ''
        recommendation = prefix + ('No ejecutes archivos ni habilites macros. Verifica el mensaje por un canal independiente.' if selected == 'malicious' else 'Evita usar los enlaces del mensaje o compartir credenciales. Verifica el aviso por un canal independiente.')
    elif financial:
        recommendation = 'Parece una factura, cobro o comprobante. Revisa con calma importe, periodo, vencimiento y que corresponda a un servicio que reconoces. Consúltalo desde tu acceso habitual al proveedor.'
    elif selected == 'spam':
        recommendation = 'Parece contenido promocional o no deseado. Comprueba si lo solicitaste; puedes filtrarlo o ignorarlo si no te interesa. Spam no significa necesariamente phishing.'
    else:
        recommendation = 'Parece una comunicación habitual. Comprueba que el remitente y el contexto correspondan a lo que esperabas antes de actuar.'
    return {'classification': {'primary': primary, 'secondary': secondary, 'evidence_strength': strength,
                               'provisional': bool(prediction.get('provisional', True)), 'model_version': version},
            'purpose': purpose, 'recommendation': recommendation, 'warnings': list(dict.fromkeys(warnings))}
