"""Comprueba la API encendida con dos correos ficticios y el modelo real."""

import json
from urllib.request import Request, urlopen


SAMPLES = [
    {
        'subject': 'Project meeting tomorrow',
        'body': 'Hi team, our weekly project meeting is tomorrow at 10 AM in room 204. Please bring your progress notes. Thank you, Ana.',
    },
    {
        'subject': 'URGENT: Your account will be suspended',
        'body': 'Your account has been locked. You must verify your password and credit card details immediately or your account will be permanently deleted. Visit https://account-verification.example/verify to confirm your information now.',
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
        assert result['label'] in {'legitimate', 'malicious'}
        assert 0 <= result['confidence'] <= 1
        assert result['max_tokens'] == 512
        print(f"Muestra {index}: {result['label']} / {result['confidence']:.4f} / HTTP 200")
