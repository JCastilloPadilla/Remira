# Extensión Remira — fase 1 local

Lee el mensaje expandido en Gmail **solo al pulsar Leer correo abierto**. Permite
elegir un mensaje si hay varios, revisar y editar asunto/cuerpo y enviarlos al
clasificador Python de esta misma computadora. No utiliza Gmail API, OAuth, IMAP,
cookies ni contraseñas. No procesa automáticamente una bandeja completa.

## 1. Preparar el backend

Desde la raíz del repositorio, en PowerShell:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m src.api
```

La API escucha únicamente en `http://127.0.0.1:8765`. Mantén esa terminal abierta.
Es un servidor de desarrollo local, no un despliegue público. Rechaza orígenes web
y nombres Host ajenos a loopback; no habilita CORS para Gmail ni para otras webs.
Las peticiones parten del popup de la extensión, no del content script.

El modelo se carga una sola vez, bajo demanda y exclusivamente desde la caché de
Hugging Face. Si ya se ejecutó la evaluación del proyecto, normalmente estará allí.
En un equipo nuevo, descárgalo explícitamente con internet **antes** de analizar:

```powershell
.\.venv\Scripts\python.exe -c "from src.hf_classifier import SpanishSpamClassifier; SpanishSpamClassifier()"
```

Esta preparación descarga archivos del modelo; no le envía correos. Después, la
API no necesita internet para inferencia. Si falta el modelo, responde con un error
503, sin descargarlo de forma implícita ni inventar una clasificación.

## 2. Compilar e instalar la extensión

Requiere Node.js compatible con Vite 8 (por ejemplo Node 22.18 o superior).

```powershell
Set-Location extension
npm ci
npm run build
```

1. Abre `chrome://extensions` o `edge://extensions`.
2. Activa **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y elige la carpeta `extension/dist` del repositorio.
4. Fija Remira en la barra del navegador.
5. Abre Gmail web, entra a un correo y expande el mensaje.
6. Pulsa el icono de Remira y **Leer correo abierto**.
7. Revisa asunto/cuerpo; si hay varios mensajes, elige el que quieras analizar.
8. Pulsa **Analizar localmente** y mantén el popup abierto hasta recibir el resultado.

Después de cambiar código: vuelve a ejecutar `npm run build` y pulsa **Recargar**
en la tarjeta de la extensión. Instala la salida `dist`, no la carpeta de fuentes.
No hace falta publicar en ninguna tienda para estas pruebas.

## 3. Probar sin cuenta de Gmail

En otra terminal, desde `extension/`:

```powershell
npm run dev
```

Abre `http://127.0.0.1:5174/test-email.html`. Contiene dos correos **ficticios**.
Usa el icono de la extensión en esa pestaña para leerlos y analizarlos.
El extractor reconoce exclusivamente esa URL local y Gmail; no copia el texto
completo de sitios arbitrarios. `http://127.0.0.1:5174/` permite ver la interfaz,
pero la lectura de pestañas requiere la extensión instalada.

Desde la raíz también puedes comprobar la API con el modelo real:

```powershell
.\.venv\Scripts\python.exe scripts/smoke_extension_api.py
```

## Pruebas y contrato

```powershell
# Desde la raíz
.\.venv\Scripts\python.exe -m pytest -q
# Desde extension/
npm test
npm run build
```

Para la prueba de navegador con el paquete real instalado en un perfil aislado,
mantén encendidos API y fixtures, compila y ejecuta desde `extension/`:

```powershell
npm run test:browser
```

Requiere Chrome instalado con soporte de CDP `Extensions.loadUnpacked`. La prueba
abre el popup como una página de extensión en un perfil de automatización, lee las
fixtures a través de `chrome.scripting` y llama a la API real. No instala nada en
el perfil habitual del usuario. Guarda capturas en `tmp/extension-verification/`.
No comprueba el botón de la barra del navegador ni el DOM de una cuenta Gmail real.

- `GET /api/health`: estado del servicio y si el modelo ya está cargado. No carga el modelo.
- `POST /api/analyze`: JSON `{"subject":"...","body":"..."}`.
- Éxito: `label` (`spam` / `not_spam`), `confidence`, `source_label`, `model`, `max_tokens` (512), `language` (`es`), `task` (`spam_detection`).
- Error: JSON con `error` y HTTP 400/403/413/415/503 según el caso.
- Máximo: 5,000 caracteres de asunto, 100,000 de cuerpo y 450,000 bytes por petición.
- El popup no guarda remitente, URL ni identificadores en el backend; envía solo asunto/cuerpo.

La configuración npm local evita un fallo del resolver de peers opcionales de
Vitest en npm 10/11. Las versiones efectivas están fijadas en `package-lock.json`.

## Permisos y privacidad

- `activeTab`: acceso temporal tras abrir la extensión mediante su icono.
- `scripting`: ejecutar la función de extracción en la pestaña activa.
- `http://127.0.0.1/*`: acceso al backend local. Los patrones de host Chromium
  no limitan por puerto; la política CSP limita las conexiones a `:8765`.
- No hay content scripts permanentes, permisos Google, historial ni almacenamiento
  de correos. El texto vive en la memoria del popup y durante la inferencia del backend.
- Cerrar el popup descarta su estado; la petición ya recibida puede terminar en el
  servidor. El servidor no registra cuerpos ni los persiste en disco.
- Usar el modelo local no equivale a poner el modelo dentro de la extensión.
  Cada equipo debe ejecutar su propio backend.

## Límites de esta fase

- Desde la versión 0.1.1, la API usa `tanaos/tanaos-spam-detection-spanish`,
  entrenado para español. Conserva mayúsculas y acentos. Su tarea es filtrar spam,
  no confirmar phishing: la interfaz muestra **Potencial spam** o **No detectado
  como spam**. Las puntuaciones mayores a 99.99 % se muestran como `> 99.99 %`
  para evitar que el redondeo las convierta en 100 %. No están calibradas.
- Las métricas previas de CEAS_08 pertenecen al modelo anterior en inglés, no al
  nuevo modelo. Los ejemplos españoles de prueba no constituyen una evaluación formal.

- Adaptador inicial para Gmail web; los selectores pueden requerir mantenimiento.
  Las fixtures DOM no sustituyen comprobar una cuenta real y distintas vistas de Gmail.
- Solo texto de mensajes expandidos. Se excluyen citas, contenido oculto y editores.
  No extrae adjuntos, imágenes ni enlaces ocultos detrás de un texto; no autentica
  al remitente ni inspecciona destinos de enlaces.
- El modelo considera únicamente los primeros 512 tokens de asunto+cuerpo. Un correo
  largo no se analiza íntegramente. Su puntuación no es una probabilidad calibrada de seguridad.
- La evaluación actual del proyecto es preliminar; deben ampliarse pruebas en español
  y revisar falsos positivos/negativos antes de usarlo como protección real.
- Sin análisis en segundo plano, sincronización ni resultado persistente al cerrar.
- Sin publicación ni integración automática con las pantallas de la web en esta fase.

Detén API y servidor de pruebas con Ctrl+C en sus terminales. Si fueron iniciados
desde el asistente en segundo plano, puedes pedir que los apague.
