"""Comprueba la API encendida con dos correos ficticios y el modelo real."""

import json
from urllib.request import Request, urlopen


SAMPLES = [
    {
        'subject': 'Reunión de proyecto',
        'body': 'Hola equipo, la reunión semanal será mañana a las diez en el salón 204. Por favor traigan sus avances. Saludos, Ana.',
    },
    {
        'subject': 'Premio para ti',
        'body': 'Has ganado un iPhone gratis. Entra ahora y proporciona tu contraseña y tarjeta bancaria para reclamar tu premio.',
    },
]


if __name__ == '__main__':
    for index, sample in enumerate(SAMPLES, 1):
        request = Request(
            'http://127.0.0.1:8765/api/analyze',
            data=json.dumps(sample).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'Origin': 'chrome-extension://' + 'a' * 32},
            method='POST',
        )
        with urlopen(request, timeout=180) as response:
            result = json.load(response)
        assert result['label'] in {'spam', 'not_spam'}
        assert result['model'] == 'tanaos/tanaos-spam-detection-spanish'
        assert 0 <= result['confidence'] <= 1
        assert result['max_tokens'] == 512
        print(f"Muestra {index}: {result['label']} / {result['confidence']:.4f} / HTTP 200")
