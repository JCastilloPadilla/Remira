<p align="center">
  <img src="frontend/public/brand/apple-touch-remira-v2.png" alt="Símbolo de las dos hojas de Remira" width="96" height="96">
</p>

<h1 align="center">Remira</h1>

<p align="center"><strong>Una segunda mirada a tus mensajes.</strong></p>

Remira revisa correos electrónicos en tu computadora. Combina un clasificador
experimental con señales del mensaje para sugerir qué revisar. Es un proyecto
semestral de **Técnicas de Inteligencia Artificial**.

## Qué puedes probar

| Interfaz | Funciones |
| --- | --- |
| [Web](frontend/README.md) | Pega el asunto y el cuerpo en `/analizar` y consulta la estimación, las señales y la recomendación. La bandeja, el historial y la cuenta son demostraciones. |
| [Extensión 0.3](extension/README.md) | Revisa un mensaje abierto en Gmail, importa un archivo `.eml` o extrae texto de imágenes con OCR local en español e inglés. |

La API Flask escucha en `127.0.0.1:8765` y procesa los mensajes localmente.
Los resultados son orientativos. Úsalos para priorizar la revisión del correo.

## Inicio rápido

Necesitas Python 3.11 y Node.js 22.18 o una versión posterior compatible con los
proyectos del repositorio. Los comandos siguientes son para PowerShell.

1. Desde la raíz, crea el entorno e instala las dependencias.

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

2. Prepara el corpus y el modelo según la [guía de instalación](extension/README.md#preparación).
   Después arranca la API desde la raíz.

   ```powershell
   .\.venv\Scripts\python.exe -m src.api
   ```

3. En otra terminal, arranca la web.

   ```powershell
   Set-Location frontend
   npm ci
   npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
   ```

   Abre [el analizador local](http://127.0.0.1:5173/analizar). Para Chrome o Edge,
   sigue la [guía de instalación de la extensión](extension/README.md#instalar-o-actualizar).

## Diseño y evaluación

- [Diseño de la interfaz](docs/interfaz-web-v1.md) e [identidad visual](docs/logo-remira-v2.md).
- [Diseño del clasificador](docs/diseno-clasificador-corpus.md) y [evaluación del análisis con evidencia](docs/evaluacion-analysis-v2.md).
- [Resultados del corpus experimental](docs/resultados-corpus-v1.md). Combina 39 154 correos públicos de CEAS_08 con 160 ejemplos sintéticos bilingües. El informe describe las métricas por clase y los límites de cada muestra.

## Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| [`frontend/`](frontend/) | Interfaz web en React y TypeScript. |
| [`extension/`](extension/) | Extensión para navegadores Chromium. |
| [`src/`](src/) | API Flask, procesamiento de mensajes y clasificación. |
| [`scripts/`](scripts/) y [`data/`](data/) | Preparación del corpus y entrenamiento. |
| [`tests/`](tests/) y [`docs/`](docs/) | Pruebas y documentación del proyecto. |

El corpus generado, los modelos entrenados y los paquetes compilados se crean
localmente. La [guía de datos](data/README.md) documenta la fuente de CEAS_08 y su
verificación.
