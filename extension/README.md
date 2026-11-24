# Remira 0.3 — clasificador propio, evidencia y OCR local

La extensión lee el mensaje expandido en Gmail por acción del usuario. Permite
elegir un mensaje, revisar su texto y enlaces, reconocer texto de imágenes y
enviar texto/metadatos al backend de esta computadora. No utiliza OAuth ni Gmail API.

## Preparación

Requiere Python con el entorno del proyecto, Node compatible con Vite 8 (por ejemplo
22.18+) y Chrome o Edge. Desde la raíz, instala las dependencias:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Los modelos se cargan desde caché, sin descargas implícitas durante análisis. En
un equipo nuevo, prepara los modelos auxiliares con internet antes de analizar mensajes:

```powershell
.\.venv\Scripts\python.exe -c "from src.hf_classifier import SpanishSpamClassifier, PhishingEmailClassifier; SpanishSpamClassifier(); PhishingEmailClassifier()"
```

Esto descarga pesos públicos, no envía correos. Para construir el clasificador
principal desde la base local, prepara el corpus y entrena fuera de la API:

```powershell
.\.venv\Scripts\python.exe scripts/prepare_corpus.py
.\.venv\Scripts\python.exe scripts/train_corpus.py
```

CEAS_08 debe estar en `data/raw/CEAS_08.csv`, descargado desde
https://zenodo.org/records/8339691 (MD5 publicado `1f0d59191eec892a709995d48cd8decb`).
La semilla sintética está versionada en `data/fixtures/corpus-seed-v1.jsonl`.
`--seed-only` permite explícitamente trabajar sin CEAS, pero no reproduce las
métricas ni el corpus completo. Se generan `instance/corpus.db`,
`models/corpus-v1.joblib`, manifiesto y métricas. Estos archivos se ignoran en Git;
se deben preparar en cada equipo. Se carga el artefacto, no se entrena por petición.

En el equipo actual ya están preparados: 39,314 ejemplos y modelo
`corpus-v1-1eaede829e6d`. Inicia la API:

```powershell
.\.venv\Scripts\python.exe -m src.api
```

Escucha solo en `http://127.0.0.1:8765`, sin guardar cuerpos ni originales. Es un
servidor de desarrollo local. Rechaza Host ajenos a loopback y orígenes externos;
solo permite extensiones Chromium y la web local en `:5173`.

En otra terminal:

```powershell
Set-Location extension
npm ci
npm run setup:ocr
npm run build
```

`setup:ocr` descarga los datos públicos español/inglés de Tesseract desde una revisión
fijada, comprueba SHA-256 y copia worker/WASM desde dependencias bloqueadas por el
lockfile. Se hace en preparación; el reconocimiento usa únicamente los assets
empaquetados. El build exige esos assets. `public/ocr/` y `dist/` son generados e
ignorados por Git. No edites archivos compilados.

## Instalar o actualizar

1. Abre `chrome://extensions` o `edge://extensions` y activa Modo de desarrollador.
2. Selecciona Cargar descomprimida y elige `extension/dist`.
3. Si ya estaba instalada, pulsa **Recargar** en su tarjeta; comprueba versión 0.3.0.
4. Abre Gmail, expande un correo, pulsa el icono de Remira y **Leer correo abierto**.
5. Si hay varios mensajes expandidos, elige uno. El menú muestra asunto, remitente y el botón **Analizar localmente**. Abre **Ver o editar correo** para revisar la extracción y los enlaces, o **Revisar imágenes** para el OCR.

No hace falta publicar en una tienda. Después de editar código, recompila y recarga.
La API debe reiniciarse después de editar Python porque no usa autoreloader.

## Imágenes y OCR

- Las imágenes con contenido pendiente se indican; nunca equivalen a un correo leído íntegramente.
- Para **Leer imagen visible**, la imagen debe caber completamente en pantalla.
  Desplázate hasta ella, vuelve a leer el mensaje y selecciónalo de nuevo.
- La extensión comprueba pestaña, mensaje, rectángulo, viewport y posibles elementos
  superpuestos antes y después de capturar. Usa un rechazo conservador: incluso una
  caja transparente o una página demasiado compleja puede impedir la captura.
- Si no permite capturar, usa **Cargar imagen** con PNG/JPEG/WebP original (hasta
  10 MB y 12 millones de píxeles). No se descargan las imágenes remotas del correo.
- El OCR español/inglés se ejecuta dentro de la extensión. La captura completa del
  viewport solo se usa transitoriamente para recortar la imagen elegida; ni captura
  ni archivo se envían al backend. Se envía el texto reconocido que revisas.
- Corrige el texto y pulsa **Confirmar texto revisado**. Antes de confirmar sigue
  pendiente, aunque el motor OCR puntúe alto. La calidad OCR no certifica exactitud.
- Marca **Es decorativa, omitir** solo cuando corresponda, por ejemplo un logotipo.
  Es una decisión explícita del usuario, no una suposición automática.
- Como máximo se muestran 30 imágenes por mensaje; las restantes siguen pendientes.
  Los píxeles de seguimiento de hasta 2×2 se excluyen. Imágenes sin cargar o pequeñas
  líneas de texto se conservan como pendientes. Fondos CSS, imágenes con texto ilegible,
  QR, PDFs y contenido fuera de la imagen capturada no se reconocen automáticamente.

## Originales .eml y autenticación

**Importar correo original .eml** analiza un archivo de hasta 8 MB. Puedes obtenerlo
mediante Descargar mensaje en Gmail. El servidor acepta hasta 8 MiB, omite el contenido
de adjuntos y correos adjuntos, limita partes MIME/anidamiento y no guarda el archivo.

Se prefiere HTML en multipart/alternative para no confiar en un texto plano señuelo,
sin duplicar alternativas. La extracción HTML es estática: no ejecuta ni interpreta
CSS/scripts ni visita enlaces. Imágenes importadas quedan pendientes; carga sus
archivos por separado para OCR si quieres revisarlas.

SPF, DKIM y DMARC de Authentication-Results se muestran como **declaraciones no
verificadas**. Importar una cabecera no comprueba su procedencia ni sus firmas. No
se declara seguro un correo por mostrar una dirección o una marca conocida.

## Qué significa el resultado

Desde 0.3, el resultado principal usa el clasificador entrenado con el corpus:

- **Probablemente legítimo**.
- **Posible spam**.
- **Posible phishing**.
- **Posible contenido malicioso**.
- **Requiere revisión** cuando el modelo sospecha phishing o contenido malicioso sin un indicio concreto, o cuando la estimación de spam es débil. **Detalles del resultado** muestra la hipótesis del modelo y la cobertura.

Muestra además finalidad (factura/cobro/recibo u otra), recomendación, fuerza de
evidencia y advertencias secundarias. Factura no equivale a seguro; una factura con
señales concretas de engaño conserva el aviso de riesgo. Para una factura sin esas
señales, la recomendación pide revisar con calma importe, periodo y vencimiento
desde el acceso habitual al proveedor. La finalidad publicitaria y la estimación de spam se muestran por separado. La presencia de lenguaje promocional por sí sola no decide el veredicto.

El corpus utiliza TF-IDF de palabras/caracteres y cuatro cabezas seleccionadas y
calibradas en una validación común pequeña. Spam/malicious solo tienen ejemplos
sintéticos; también la legitimidad española presenta errores. Todas las salidas
son experimentales y provisionales, sin porcentaje de seguridad. El clasificador
procesa hasta 15,000 caracteres normalizados y avisa si recorta; las reglas de
señales estructurales revisan todo el texto recibido. El modelo auxiliar conserva
su límite de 512 tokens. Ninguno verifica autenticidad.

Las categorías de diagnóstico anteriores se conservan colapsadas, no como título:

- **Señales de riesgo:** se hallaron indicios concretos, por ejemplo discrepancia de
  destino visible/real o solicitud de credenciales. No es una prueba definitiva de phishing.
- **Sin señales claras de phishing:** no se hallaron señales claras en lo revisado;
  no significa seguro ni autentica el mensaje.
- **Análisis no concluyente:** evidencia insuficiente, opinión negativa aislada del
  modelo, idioma/modelo no disponible, OCR pendiente, enlaces incompletos o recorte.

Cada resultado separa evidencia, limitaciones, idioma, tokens, cobertura y opinión
auxiliar. En el diagnóstico anterior, español usa Tanaos (spam/not_spam); inglés usa Cybersectony
(malicious/legitimate). Ninguna etiqueta aislada determina phishing. Sus puntuaciones
no están calibradas y no se presentan como porcentaje de seguridad.

Los modelos procesan hasta 512 tokens; se muestran conteos reales y recorte. Las
reglas examinan el texto completo recibido, pero tampoco cubren todas las formas
de engaño. Los enlaces se analizan como cadenas: se muestran parámetros de redirección
reconocidos sin seguirlos. No se consulta reputación ni se autentican dominios en vivo.

## Pruebas reproducibles

Desde la raíz:

```powershell
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe scripts/smoke_extension_api.py
.\.venv\Scripts\python.exe -m scripts.evaluate_analysis_v2 --output tmp/analysis-v2-report.json --exploratory
.\.venv\Scripts\python.exe -m scripts.evaluate_corpus_decisions
```

Desde `extension/`:

```powershell
npm test
npm run build
npm run dev
```

Abre `http://127.0.0.1:5174/test-email.html`: cuatro correos ficticios, incluidos una
factura inglesa y un mensaje solo imagen. Con API y ese servidor encendidos:

```powershell
npm run test:browser
```

La prueba usa Chrome y un perfil separado, carga el paquete real, concede activeTab
con una acción del navegador por CDP y prueba extracción, captura/archivo OCR real,
factura, .eml y rechazo de sitios no soportados. Comprueba ausencia de solicitudes
externas y guarda capturas en `tmp/extension-verification/`. No entra a una cuenta
real de Gmail ni modifica tu perfil habitual.

## API y privacidad

- `GET /api/health`: modelos y estado de carga, sin cargar pesos.
- `POST /api/analyze`: asunto/cuerpo, remitente visible, enlaces, cobertura y
  autenticación declarada opcionales. Máximo 450,000 bytes, 5,000 caracteres de
  asunto y 100,000 de cuerpo (incluido OCR).
- `POST /api/analyze-eml`: multipart `file` con original acotado.
- Respuesta: etiqueta/puntuación originales y `assessment` con evidencia y límites.
  Un modelo ausente produce evaluación no concluyente, no una etiqueta inventada.
- La CSP limita red a assets propios y backend loopback. No hay scripts permanentes,
  almacenamiento de correos, contraseñas ni cookies de Gmail.
- Cerrar el popup descarta el estado; una inferencia ya recibida puede terminar en
  memoria del servidor. No se escribe su contenido a disco.

## Alcance comprobado

La evaluación en `docs/evaluacion-analysis-v2.md` usa ejemplos sintéticos, compara
ambos modelos y reporta falsos positivos, negativos y abstenciones. No demuestra
precisión en correo real, ni 100 % de detección. Los selectores de Gmail requieren
pruebas manuales en sus distintas vistas. La extensión no sustituye la protección
del proveedor de correo ni verifica adjuntos o firmas criptográficas.

El entrenamiento del clasificador actual y sus errores están documentados en
`docs/resultados-corpus-v1.md`. La evaluación exploratoria de las categorías
mostradas obtuvo 18/24 aciertos en familias sintéticas de prueba (75%); no mide
rendimiento en correo real. No se utiliza esa cifra como garantía para el usuario.
