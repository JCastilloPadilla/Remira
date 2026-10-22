# Extensión local de Remira — plan de implementación

> **For agentic workers:** ejecutar con superpowers:executing-plans y pruebas antes de implementación.

**Goal:** leer el mensaje abierto en Gmail y clasificarlo con el modelo Python local.

**Architecture:** extensión Manifest V3 con React/TypeScript, extracción puntual mediante activeTab y scripting, vista previa y petición desde el popup a Flask en 127.0.0.1:8765. Modelo compartido, cargado una vez; sin OAuth, persistencia de correos ni servicio externo de inferencia.

**Tech Stack:** React, TypeScript, Vite, Vitest/jsdom, Flask, Transformers/PyTorch, pytest.

**Spec:** solicitud del usuario del 22/10/2026 y propuesta aceptada en este chat.

## Restricciones

- Rama codex/extension-local-v1 en el checkout actual limpio, conforme a la solicitud de crear una rama.
- Gmail web inicialmente; página de prueba local explícita para verificar el flujo sin cuenta.
- No leer la bandeja completa, cookies, contraseñas ni formularios.
- Vista previa antes de enviar. Sin guardado de mensajes ni registro de cuerpos.
- Backend enlazado solo a loopback; rechazar orígenes web y Host ajenos a loopback.
- Modelo cargado desde caché local: descargarlo explícitamente antes si falta.
- Interfaz conserva papel, azul y tipografía de Remira; lectura → vista previa → análisis → resultado.

## Riesgos que probar

1. Conversaciones con varios cuerpos visibles: seleccionar explícitamente el mensaje.
2. Elementos ocultos y texto citado: excluirlos de la extracción.
3. Mensajes vacíos, campos inválidos y solicitudes demasiado grandes: errores JSON sin inferencia.
4. Servidor desconectado o modelo no disponible: no inventar clasificación.
5. Cambiar de mensaje y releer: borrar resultados anteriores y analizar solo la vista previa seleccionada.

## Task 1: API local

- [x] Crear tests/test_api.py con pruebas del contrato POST /api/analyze, validación, reutilización del clasificador, origen y errores.
- [x] Ejecutar y observar fallo por API ausente.
- [x] Crear src/api.py: create_app(classifier_factory=None), GET /api/health y POST /api/analyze; añadir Flask y carga offline configurable del modelo.
- [x] Ejecutar suite Python completa.

## Task 2: Extracción e interfaz

- [x] Crear extension/ con configuración y pruebas de extracción en DOM y errores de API.
- [x] Ejecutar pruebas antes de implementar extractor y cliente.
- [x] Implementar extracción autocontenida de mensajes visibles Gmail; página fixture explícita sin extracción genérica de páginas.
- [x] Implementar popup React: lectura por acción, selección, vista previa editable, análisis, puntuación y límites; sin persistencia.
- [x] Ejecutar pruebas y compilación.

## Task 3: Pruebas reales y entrega

- [x] Ejecutar API con modelo real en caché y clasificar mensajes de prueba por HTTP.
- [x] Verificar interfaz y extracción con navegador y fixtures; documentar por separado lo que no se pudo verificar en Gmail real.
- [x] Añadir instrucciones de instalación, arranque, privacidad y limitaciones en extension/README.md y README.md.
- [x] Ejecutar pruebas, build, git diff --check y revisar cambios antes de cerrar.

## Registro de ejecución

- Inicio: árbol limpio en dev; rama dedicada creada. El usuario autoriza implementar y probar esta fase sin otra aprobación de diseño.
- API: 28 pruebas Python totales pasan (12 existentes + 16 casos nuevos). Clasificador reutilizado y carga offline comprobada con modelo real en caché.
- Extensión: 12 pruebas Vitest pasan, compilación TypeScript/Vite correcta. Fallos iniciales observados por módulos aún ausentes antes de implementar.
- Dependencias: fallo reproducible de Arborist con peers opcionales de Vitest; .npmrc local evita el fallo. Vitest actualizado a 4.1.12; npm audit sin vulnerabilidades.
- Navegador: Chrome instalado, perfil aislado, carga mediante CDP del paquete compilado. Extracción real de fixtures, selección, inferencia HTTP, limpieza de resultado y rechazo de página no soportada pasan. Capturas revisadas a 400 px, sin desbordamiento.
- Límites de verificación: no se abrió una cuenta Gmail real; tampoco se automatizó el botón de la barra de Chrome. El smoke abre index.html como página de extensión. Esto no sustituye probar el popup desde su icono en Gmail.
- Revisión independiente: sin hallazgos accionables en API, clasificador, extractor, interfaz, manifiesto y pruebas.
- Servicios para pruebas manuales: API 127.0.0.1:8765 y Vite 127.0.0.1:5174 iniciados. No se publica ni se sube la rama.
