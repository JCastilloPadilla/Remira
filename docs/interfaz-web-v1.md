# Primera versión de la interfaz web

Fecha: 29 de septiembre de 2026.  
Rama de trabajo: `feature/web-interface-v1`.  
Actualización: 4 de octubre de 2026.

Estado: las siete pantallas propuestas están maquetadas; integración real pendiente. en React con datos de demostración.

## Propósito

Crear una interfaz atractiva y fácil de usar para analizar el texto de un correo y consultar su clasificación. El usuario podrá pegar asunto y cuerpo, iniciar el análisis y leer el resultado sin abandonar la pantalla.

La tecnología ya está acordada: **React + TypeScript + Vite + Tailwind CSS + shadcn/ui + React Bits**, con **Flask** como API y el modelo preentrenado ejecutado localmente. La distribución, paleta y navegación de este documento son la propuesta inicial de diseño.

## Cantidad de pantallas y alcance

El borrador actual tiene **siete pantallas navegables: landing, login, bandeja, historial, cuenta, analizador y ayuda**. El analizador conserva también su ayuda breve en un diálogo. El resultado, la carga y los errores son estados del análisis, no páginas adicionales. La ampliación acordada contempla siete pantallas en total, según se implementen las funciones correspondientes.

| Pantalla | Ruta propuesta | Primera versión | Propósito |
| --- | --- | --- | --- |
| Landing / acerca de | `/` | Implementada | Presentar el proyecto y acceder al analizador sin cuenta. |
| Analizar correo | `/analizar` | Implementada | Introducir el correo y consultar el resultado. |
| Login | `/login` | Maqueta implementada | Presentar el acceso con Google para futuras funciones personales. |
| Bandeja de Gmail | `/bandeja` | Maqueta implementada | Explorar mensajes ficticios; conexión real pendiente. |
| Historial | `/historial` | Maqueta implementada | Consultar registros ficticios; almacenamiento real pendiente. |
| Cuenta y conexiones | `/cuenta` | Maqueta implementada | Consultar acceso y explorar estados ficticios de conexión con Gmail. |
| Ayuda / cómo funciona | `/como-funciona` | Implementada | Explicar uso, privacidad y límites del análisis. |

El analizador recibió el rediseño editorial de Remira el 10 de octubre de 2026.
Composición, ilustración, adaptación móvil y verificaciones se documentan en
[Analizador: la mesa de revisión](analizador-diseno-editorial.md).

Cuenta y conexiones adopta el mismo lenguaje visual desde el 13 de octubre de
2026. Véase [su diseño editorial](cuenta-diseno-editorial.md), con ilustración,
footer compartido y adaptación para teléfono y escritorio.

La bandeja recibió el rediseño el 13 de octubre de 2026. Su composición,
ilustración y verificaciones están en [Bandeja: una mesa de correspondencia](bandeja-diseno-editorial.md).

Historial adopta el diseño editorial el 13 de octubre de 2026. Véase
[Historial: el registro de tus miradas](historial-diseno-editorial.md), con
tabla adaptable, filtros, detalles, ilustración y footer compartido.

Inicio de sesión completa el rediseño de las siete pantallas el 13 de octubre
de 2026. Véase [Inicio de sesión: una hoja de bienvenida](login-diseno-editorial.md).
La integración real de modelo, autenticación, Gmail e historial sigue pendiente;
la renovación visual no modifica ese alcance.

La landing, el análisis manual y la ayuda serán públicos. El login tiene sentido cuando existan Gmail e historial; no será obligatorio para pegar un correo. El inicio de sesión con Google y la autorización de lectura de Gmail serán pasos separados. Estas funciones requieren backend, autenticación y decisiones de almacenamiento todavía pendientes. No se necesita un dashboard sin información propia ni se mostrarán enlaces activos a funciones inexistentes.

## Alternativas consideradas

| Alternativa | Ventaja | Costo o limitación |
| --- | --- | --- |
| Una sola pantalla con ayuda en un diálogo | Flujo mínimo. | Las explicaciones tienen menos espacio y no se pueden enlazar directamente. |
| Dos pantallas: análisis y ayuda | Mantiene la tarea principal directa y permite explicar el sistema. | Requiere navegación simple. |
| Landing, dashboard, análisis y resultado separado | Más espacio para presentar el proyecto. | Introduce pasos y páginas que todavía no tienen información propia. |

La propuesta original elegía análisis y ayuda. Con la ampliación solicitada el 1 de octubre, la entrada pasa a ser la landing, con acceso directo al analizador; la ayuda detallada continúa disponible en un diálogo. La clasificación sigue apareciendo en la misma pantalla del formulario.

## Landing implementada

Ruta: `/`. Su objetivo es presentar el proyecto académico y ofrecer un camino claro hacia la demostración.

1. Encabezado con identidad, enlaces a Cómo funciona y Acerca del proyecto y botón Abrir analizador.
2. Presentación: «Un correo puede parecer confiable. Revísalo antes.» y acceso al analizador. A la derecha aparece un correo ficticio con una clasificación explícitamente ilustrativa.
3. Aviso del estado actual: ejemplos preparados y conexión con el modelo pendiente.
4. Cómo funciona: introducir el mensaje → revisar la clasificación → decidir con más contexto.
5. Acerca del proyecto: propósito académico, modelo preentrenado, evaluación con CEAS_08, entradas y salidas y enlace al repositorio.
6. Limitaciones y alcance de la demostración.
7. Llamada final a explorar la demostración y pie con enlaces al proyecto.

En escritorio, la presentación y el correo ilustrativo comparten dos columnas. En celular se apilan; los pasos y el contenido de acerca del proyecto también pasan a una columna. Se conservan Manrope, los tonos azules del analizador, Button y Badge de shadcn/ui y FadeContent de React Bits en el título. No se añaden métricas, testimonios ni predicciones reales ficticias.

React Router gestiona `/` y `/analizar`; las rutas desconocidas vuelven al inicio. El nombre del proyecto en el analizador regresa a la landing. Recargar o abandonar el analizador reinicia su borrador, que solo vive en memoria. Abrir y cerrar su ayuda conserva el contenido.

## Dirección visual

La interfaz se planteará como una herramienta de revisión de correo: clara, contemporánea y con un detalle animado reconocible. El área principal tendrá una composición de editor y resultado, como una mesa de revisión de un mensaje.

- Fondo claro, superficies blancas y encabezado azul profundo.
- Acento azul para navegación y acciones. Verde y rojo se reservan para estados de clasificación, acompañados de texto e iconos.
- Tipografía propuesta: **Manrope**, con una fuente de sistema como respaldo; archivos de fuente servidos desde la aplicación.
- Texto alineado a la izquierda, títulos claros y espacio suficiente para leer correos largos.
- Un efecto de React Bits en la franja del encabezado, inspirado en el recorrido de un mensaje. El formulario y el resultado tendrán fondos sólidos.
- Animación breve al presentar el resultado; sin cursores especiales ni efectos que interfieran con escribir o seleccionar texto.

### Paleta inicial

| Token | Color | Uso |
| --- | --- | --- |
| Fondo | `#F3F6FA` | Área general de trabajo. |
| Superficie | `#FFFFFF` | Formulario y resultado. |
| Texto | `#172B4D` | Títulos y contenido. |
| Texto secundario | `#52627A` | Ayuda y descripciones. |
| Acento | `#2457C5` | Acción principal y selección de navegación. |
| Borde | `#D7DFEB` | Separación de campos y paneles. |

Los colores finales se verificarán en el navegador con texto, estados y foco reales. La selección de un componente concreto de React Bits se hará al maquetar, comprobando su variante TypeScript/Tailwind y sus dependencias.

## Estructura compartida

Encabezado con el nombre **Detector de correos**, navegación **Analizar correo / Cómo funciona** y un fondo visual discreto. El contenido tendrá un ancho máximo aproximado de 1200 px. El pie incluirá la identificación del proyecto académico y un enlace a las limitaciones.

No se mostrará un indicador de “modelo listo” hasta que exista una señal real del backend. La interfaz no necesita exponer nombres de bibliotecas o detalles de infraestructura al usuario para realizar el análisis.

## Pantalla 1: Analizar correo

### Maquetación en escritorio

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Detector de correos                 Analizar correo    Cómo funciona     │
│                       Franja visual con animación sutil                  │
├──────────────────────────────────────────────────────────────────────────┤
│ Analiza un correo                                                        │
│ Pega el asunto y el contenido para consultar su clasificación.            │
│                                                                          │
│ ┌─────────────────────────────────────┐ ┌──────────────────────────────┐ │
│ │ Contenido del correo                 │ │ Resultado                    │ │
│ │                                     │ │                              │ │
│ │ Asunto (opcional)                    │ │ Antes del análisis:          │ │
│ │ [                                 ] │ │ El resultado aparecerá aquí. │ │
│ │                                     │ │                              │ │
│ │ Cuerpo del correo                   │ │ Después del análisis:        │ │
│ │ [                                 ] │ │ [Clasificación + icono]      │ │
│ │ [                                 ] │ │ Confianza del modelo: … %    │ │
│ │ [                                 ] │ │ Orientación según resultado  │ │
│ │ [                                 ] │ │                              │ │
│ │                                     │ │ [Nuevo análisis]             │ │
│ │ [Cargar ejemplo]     [Limpiar]       │ │                              │ │
│ │ [Analizar correo]                   │ │ Consulta las limitaciones.   │ │
│ └─────────────────────────────────────┘ └──────────────────────────────┘ │
│ El contenido se procesa en el equipo que ejecuta la aplicación.           │
├──────────────────────────────────────────────────────────────────────────┤
│ Proyecto académico                                  Limitaciones         │
└──────────────────────────────────────────────────────────────────────────┘
```

El formulario ocupará aproximadamente el 60 % del espacio y el resultado el 40 %. Ambos paneles compartirán la parte superior. El cuerpo del correo tendrá un campo amplio, redimensionable y con etiqueta visible.

### Campos y acciones

| Elemento | Comportamiento |
| --- | --- |
| Asunto | Opcional. Se conserva tal como lo escribió el usuario. |
| Cuerpo | Obligatorio en el formulario de esta versión; rechaza texto vacío o solo espacios. Es una regla propuesta para la API, aún no implementada. |
| Cargar ejemplo | Selector con dos mensajes ficticios, identificados como ejemplos de demostración. Si reemplaza texto existente, solicita confirmación. |
| Analizar correo | Valida los campos, inicia una petición y deshabilita envíos repetidos mientras espera. |
| Limpiar | Borra formulario y resultado; pide confirmación cuando hay contenido. |
| Nuevo análisis | Aplica la misma confirmación de limpieza y devuelve el foco al asunto. |

No se agregarán remitente, adjuntos o carga de `.eml` en este primer formulario. Los enlaces pegados se tratarán como texto; el contenido del mensaje no se renderizará como HTML.

### Estados del resultado

| Estado | Presentación | Acción disponible |
| --- | --- | --- |
| Inicial | “El resultado aparecerá aquí cuando analices un correo.” | Completar el formulario. |
| Entrada inválida | Mensaje junto al cuerpo: “Pega el contenido del correo para continuar.” | Corregir el campo. |
| Analizando | Indicador indeterminado y “Analizando correo…”. | Esperar; navegación disponible. |
| Legítimo | “Clasificado como legítimo”, icono y confianza. | Revisar el mensaje o iniciar otro análisis. |
| Potencialmente malicioso | “Potencialmente malicioso”, icono y confianza. | Leer la orientación o iniciar otro análisis. |
| Error de servicio | “No pudimos completar el análisis. Tu texto sigue en el formulario.” | Reintentar. |
| Sin conexión | “No se pudo conectar con el servicio de análisis.” | Reintentar cuando esté disponible. |
| Texto editado tras un resultado | “El correo cambió. Analízalo de nuevo para actualizar el resultado.” | Analizar de nuevo. |

Durante la petición se bloqueará la edición del formulario para que el resultado corresponda al contenido visible. Al editar después de una respuesta, la clasificación anterior dejará de mostrarse como resultado vigente. Un error nunca conservará una clasificación anterior como si perteneciera al intento fallido.

La confianza se presentará como **“Confianza del modelo”**, no como “porcentaje de seguridad” ni “probabilidad de que el correo sea seguro”. El código actual devuelve el score de una etiqueta original del modelo, después mapeada a una clase binaria; no es una probabilidad calibrada de la clase binaria.

El texto de orientación será fijo según la clase: para un resultado malicioso, sugerir verificar el remitente por otro medio antes de abrir enlaces o compartir información; para uno legítimo, recordar que la clasificación no garantiza seguridad. No se atribuirán causas concretas al correo.

### Adaptación a celular

```text
┌──────────────────────────────┐
│ Detector de correos          │
│ Analizar | Cómo funciona     │
├──────────────────────────────┤
│ Analiza un correo            │
│ Descripción breve            │
│                              │
│ Asunto (opcional)            │
│ [                          ] │
│ Cuerpo del correo            │
│ [                          ] │
│ [                          ] │
│ [                          ] │
│ [Cargar ejemplo] [Limpiar]    │
│ [      Analizar correo     ] │
│                              │
│ Resultado                    │
│ Clasificación y confianza    │
│ Orientación                  │
│ [      Nuevo análisis      ] │
├──────────────────────────────┤
│ Proyecto académico           │
└──────────────────────────────┘
```

Por debajo de 1024 px, los paneles pasarán a una columna. La navegación seguirá visible y el botón principal ocupará el ancho disponible. Al recibir un resultado en celular, se acercará la vista al panel y se anunciará el cambio de forma accesible, sin animación de desplazamiento cuando se prefiera movimiento reducido.

## Pantalla 2: Cómo funciona

### Maquetación

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Detector de correos                 Analizar correo    Cómo funciona     │
├──────────────────────────────────────────────────────────────────────────┤
│ Cómo funciona                                                            │
│                                                                          │
│ Pega el correo → Analiza su texto → Consulta la clasificación              │
│                                                                          │
│ Qué información se analiza                                                │
│ El asunto y el cuerpo que introduces en el formulario.                    │
│                                                                          │
│ Qué significa el resultado                                                │
│ Legítimo / Potencialmente malicioso / Confianza del modelo.                │
│                                                                          │
│ Privacidad y límites                                                      │
│ Procesamiento local, conservación del texto y límites del clasificador.   │
│                                                                          │
│ [Analizar un correo]                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│ Proyecto académico                                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

Será una página de lectura de una columna, de ancho aproximado de 760 px, con secciones breves y preguntas frecuentes desplegables cuando aporten claridad.

Contenido requerido:

- Cómo copiar y pegar asunto y cuerpo.
- Qué significa cada clasificación y qué significa la confianza.
- Que el resultado es una ayuda para revisar mensajes y puede equivocarse.
- Que no se inspeccionan adjuntos ni se verifica la reputación de enlaces.
- Que el modelo procesa como máximo 512 tokens y puede recortar correos largos; no confundir tokens con caracteres.
- Que el análisis se ejecuta en el equipo que aloja Flask y el modelo. Si se abre desde otro dispositivo, el texto viaja a ese equipo.
- Que el diseño de v1 no contempla guardar el cuerpo ni el resultado de forma persistente; esto deberá verificarse también en el backend y sus registros.
- Que Gmail todavía no está conectado.

No se publicará la evaluación de 100 correos como una garantía de precisión para cualquier mensaje.

## Flujo de navegación y análisis

```mermaid
flowchart TD
    A[Entrar a la landing] --> B[Analizar correo]
    B --> C[Escribir o cargar ejemplo]
    C --> D{Entrada válida}
    D -->|No| E[Mostrar error junto al campo]
    E --> C
    D -->|Sí| F[Estado analizando]
    F --> G{Respuesta del servicio}
    G -->|Clasificación válida| H[Resultado en el mismo panel]
    G -->|Fallo| I[Error y opción de reintentar]
    I --> F
    H --> J{Siguiente acción}
    J -->|Editar| C
    J -->|Nuevo análisis| K[Confirmar limpieza]
    K -->|Confirmar| B
    K -->|Cancelar| H
    B --> L[Cómo funciona]
    L --> B
```

Abrir y cerrar la ayuda del analizador conserva el borrador y el resultado en memoria de React. Volver a la landing o recargar reinicia el formulario; no se utiliza almacenamiento persistente ni se ofrecen enlaces compartibles a resultados. La conservación al navegar entre futuras páginas deberá diseñarse cuando se implementen.

## Pantallas previstas para una fase posterior

### Bandeja de Gmail

```text
Encabezado y navegación
Cuenta conectada / Conectar Gmail
Filtros de mensajes + Actualizar + Analizar selección
Lista de correos              | Detalle del correo seleccionado
Estado de análisis por mensaje| Clasificación y confianza
```

Flujo previsto: conectar cuenta → autorizar con Google → cargar mensajes → seleccionar → analizar → consultar resultado. Los estados desconectado, sin mensajes, autorización cancelada y fallo de sincronización deberán diseñarse al iniciar esa fase. La lectura automática será una evolución independiente.

### Historial

```text
Encabezado y navegación
Historial de análisis
Filtros por clasificación y fecha
Tabla: fecha / asunto / origen / clasificación / confianza
Detalle de un registro seleccionado
Estado vacío: todavía no hay análisis guardados
```

Requerirá decidir qué se almacena, durante cuánto tiempo y cómo se elimina. No se asumirá el guardado del cuerpo completo. Estas decisiones y SQLite quedan fuera del primer borrador.

## Componentes y organización previstos

| Componente | Responsabilidad | Base visual |
| --- | --- | --- |
| `AppShell` | Encabezado, navegación, contenido y pie. | Tailwind y navegación accesible. |
| `EmailAnalysisPage` | Coordinar formulario y estados del análisis. | Composición propia. |
| `EmailForm` | Campos, validación y acciones. | shadcn/ui: Input, Label, Textarea, Button. |
| `ExamplePicker` | Elegir un mensaje ficticio. | shadcn/ui: Dialog y Button. |
| `AnalysisResult` | Clasificación, confianza y orientación. | shadcn/ui: Badge, Alert y Button. |
| `ClearConfirmation` | Confirmar que se borra el contenido. | shadcn/ui: AlertDialog. |
| `HelpPage` | Ayuda, privacidad, limitaciones y preguntas frecuentes. | Guía editorial ilustrada, detalles nativos y Button de shadcn/ui. |
| `HeaderVisual` | Efecto decorativo aislado del flujo. | Componente gratuito de React Bits. |
| Servicio de análisis | Petición a Flask y traducción de errores. | TypeScript; sin dependencias visuales. |

El frontend está en `frontend/`, separado de `src/`, que contiene la lógica Python. `App.tsx` define las rutas con React Router; `features/landing/` contiene la presentación y `features/analysis/AnalysisPage.tsx` coordina el análisis. No se añaden bibliotecas de estado global para este flujo pequeño.

## Conexión con el backend

La API todavía no está implementada. Este es el contrato propuesto para la integración:

```http
POST /api/analyze
Content-Type: application/json
```

```json
{
  "subject": "Reunión de equipo",
  "body": "Hola, confirmamos la reunión de mañana."
}
```

Respuesta propuesta:

```json
{
  "label": "legitimate",
  "confidence": 0.93
}
```

Los valores anteriores son ilustrativos, no una predicción real. Las clases válidas serán `legitimate` y `malicious`; la confianza será un número entre 0 y 1. Un error tendrá un mensaje legible y un código estable; el frontend rechazará respuestas incompletas o con valores fuera del contrato.

Flask validará la entrada y reutilizará una instancia del clasificador en lugar de cargar el modelo en cada petición. No se entrenará desde la web. La interfaz no anunciará disponibilidad ni progreso porcentual de inferencia si el servicio no los informa.

## Maquetación antes de integrar la IA

El siguiente paso de implementación será construir las dos pantallas con datos de demostración y todos los estados del analizador. Cada resultado simulado tendrá una marca visible **“Demostración”**, y el entorno mostrará **“Vista de demostración: el modelo todavía no está conectado”**.

El servicio de demostración y el servicio HTTP compartirán la misma forma de respuesta. Al conectar Flask se sustituirá el origen de los datos y se quitará la marca de demostración solo cuando exista una respuesta real. Si la API falla, no se devolverá una clasificación ficticia como respaldo.

## Criterios para revisar el primer borrador

- La landing y el analizador se pueden abrir y navegar; la ayuda en diálogo conserva el borrador. Salir del analizador lo reinicia.
- La pantalla inicial explica qué hacer y no muestra cifras ficticias de actividad.
- Se pueden demostrar los estados inicial, analizando, legítimo, malicioso, entrada inválida y error.
- Editar el correo invalida la clasificación visible anterior.
- Reintentar conserva el texto; limpiar confirma antes de borrarlo.
- El formulario funciona con teclado, etiquetas visibles y foco claro; los resultados y errores se anuncian de forma accesible.
- La pantalla se adapta a anchos de 360, 768 y 1440 px sin desplazamiento horizontal.
- React Bits respeta movimiento reducido y tiene una alternativa estática si el efecto no puede ejecutarse.
- La confianza, los mensajes de orientación y los ejemplos no presentan conclusiones que el clasificador no entrega.
- Se inspeccionan capturas de escritorio y celular antes de dar por terminada la maquetación.

## Secuencia de trabajo

1. Revisar esta propuesta de pantallas, flujo y dirección visual.
2. Preparar un plan de implementación sobre la rama actual.
3. Crear el frontend con el stack acordado.
4. Maquetar estructura compartida y pantalla de análisis.
5. Implementar estados con datos de demostración identificados.
6. Maquetar Cómo funciona y adaptar ambas pantallas a celular.
7. Revisar visualmente el borrador y ajustar distribución, tipografía y movimiento.
8. Integrar la API Flask y comprobar el flujo con respuestas reales.

## Referencias del proyecto

- [Stack acordado y estado actual](../README.md#tecnologías-definidas).
- [Modelo preentrenado y módulos existentes](modelo-preentrenado.md).
- `src/email_data.py`: entrada interna con asunto y cuerpo.
- `src/hf_classifier.py`: etiquetas, score y límite de 512 tokens.

## Avance implementado — primera pantalla

La pantalla Analizar correo está maquetada en `frontend/`. Incluye formulario, estados inicial/carga/resultado/error, dos ejemplos ficticios, confirmación de limpieza o reemplazo y ayuda en un diálogo. React Bits aporta la transición del resultado mediante FadeContent; el encabezado usa una ilustración estática para conservar la lectura.

En el primer avance, la ayuda en diálogo sustituyó temporalmente la ruta independiente Cómo funciona; ahora ambas están disponibles. La landing añade una explicación general del flujo. No hay enlaces activos a pantallas todavía inexistentes. El texto libre informa que falta integrar el modelo; únicamente los ejemplos exactos devuelven resultados simulados.

## Avance implementado — landing

El 1 de octubre se añadió la landing en `/` y se movió el analizador a `/analizar`, sin cambiar su servicio de demostración. Se comprobó el acceso desde la landing, el regreso mediante la marca, las anclas internas y la recarga directa del analizador. La presentación se revisó a 360, 768 y 1440 px sin desplazamiento horizontal. Build y lint pasaron; Vite informa que el paquete JavaScript supera 500 kB antes de gzip. El servidor de producción necesitará devolver `index.html` para las rutas del frontend. La autenticación real y la conexión con el modelo quedan pendientes.

La compilación y el lint pasaron, junto con las 12 pruebas Python existentes. Se revisó la pantalla en navegador a 360, 768 y 1440 px sin desplazamiento horizontal, además de las interacciones de carga, validación, edición, limpieza y ayuda. La API Flask y las pantallas posteriores siguen pendientes. Las instrucciones están en [frontend/README.md](../frontend/README.md).

## Avance implementado — login

Ruta `/login`, accesible desde Iniciar sesión en la landing. En escritorio presenta el contexto de Gmail e historial a la izquierda y el acceso a la derecha; en celular prioriza el acceso. Mantiene Manrope, la paleta azul, Button y Badge de shadcn/ui y FadeContent de React Bits.

Continuar con Google muestra un aviso accesible de integración pendiente; no solicita credenciales, crea una sesión ficticia ni inicia una petición externa. Continuar sin cuenta abre `/analizar`; la marca y Volver al inicio llevan a `/`. El texto distingue inicio de sesión de autorización adicional de Gmail. No hay formulario de contraseña, recuperación ni registro independiente porque el acceso previsto utiliza Google.

Se revisaron los anchos de 360, 768 y 1440 px, el aviso, la navegación y la recarga directa. Build y lint correctos. OAuth, sesiones, Gmail e historial siguen pendientes.

## Avance implementado — bandeja de Gmail

El 2 de octubre se añadió `/bandeja`, accesible desde el login mediante Explorar la bandeja de demostración. La pantalla ofrece lista y detalle en escritorio; en celular alterna entre ambos con Volver a los mensajes.

Incluye los dos ejemplos existentes del analizador, remitentes con dominios `.example`, búsqueda por asunto o remitente, filtros por estado/clasificación, estado sin coincidencias y análisis individual con resultados explícitamente simulados. Los resultados se mantienen por mensaje en memoria; recargar o abandonar la bandeja los reinicia. Se reutiliza el servicio de demostración; cambiar de selección durante el análisis no cambia el destinatario del resultado. Solo se procesa un ejemplo a la vez.

Conectar Gmail abre un diálogo que explica la integración pendiente y enlaza al login. No se implementan OAuth, sincronización, lectura real, selección masiva ni guardado persistente. El contenido se muestra como texto y los enlaces del correo no son interactivos.

Se revisaron escritorio, tableta y celular, búsqueda sin coincidencias, filtros, ambos resultados, cambio de selección durante el análisis, navegación y aviso de conexión. Build y lint correctos; se mantiene el aviso de Vite sobre el tamaño del paquete JavaScript.

## Avance implementado — historial

El 4 de octubre se añadió `/historial`, accesible desde la navegación de la bandeja. Presenta dos registros ficticios basados en los ejemplos existentes, con fecha, origen, clasificación y confianza ilustrativos. No se incorporan automáticamente los análisis realizados en otras pantallas.

Permite buscar por asunto, filtrar por clasificación y por intervalo de fechas inclusivo, restablecer filtros y abrir el detalle en un diálogo. Un intervalo invertido muestra un error. Ver historial vacío oculta los ejemplos sin borrar información real; Mostrar ejemplos los recupera. En celular cada fila se organiza verticalmente con etiquetas. Se conservan el stack, la paleta y la tipografía del proyecto; FadeContent anima el resultado del detalle.

No existe almacenamiento persistente, sesión real, exportación ni eliminación de registros. El cuerpo se presenta como texto. Recargar o abandonar reinicia los filtros y la selección. Build y lint se verificaron; la revisión visual y de interacciones en navegador queda pendiente por falta de herramientas de navegador en esta sesión.

## Avance implementado — cuenta y conexiones

Ruta `/cuenta`, accesible desde la navegación de la bandeja y el historial. Separa acceso a la cuenta y autorización de Gmail. El estado inicial muestra visitante sin sesión y Gmail sin conectar. Ver inicio de sesión enlaza a `/login`; Conectar Gmail explica en un diálogo que la integración está pendiente.

Mostrar conexión ficticia presenta una identidad `.example` y autorización explícitamente simulada. Permite abrir la bandeja ficticia o Desconectar ejemplo, con confirmación y opción de cancelar. El cambio se anuncia mediante un estado accesible y solo modifica memoria local. Recargar o abandonar la página reinicia la maqueta. No hay OAuth, credenciales, revocación real, edición de perfil ni cierre de sesión ficticio.

Se mantienen React, TypeScript, shadcn/ui, FadeContent de React Bits y la dirección visual existente. En celular las áreas se apilan y las acciones se adaptan al ancho. Build y lint verificados; revisión visual e interacción en navegador pendientes por falta de herramientas de navegador en esta sesión.

## Avance implementado — ayuda / cómo funciona

Ruta `/como-funciona`. Completa las siete pantallas del borrador. Incluye índice de secciones, pasos del analizador, significado de las clases y confianza, privacidad actual y prevista, autorización separada de Gmail, límites del clasificador y preguntas frecuentes con `details` nativos accesibles por teclado. FadeContent anima el encabezado; se conservan el stack y el estilo existentes.

Se enlaza desde la navegación de bandeja, historial y cuenta, y desde el pie de la landing. El diálogo del analizador conserva la ayuda breve y abre la página completa en una nueva pestaña para mantener el borrador de correo. En celular el índice deja de ser fijo y precede al contenido. El máximo de 512 tokens se verificó en `src/hf_classifier.py`.

Build y lint verificados. La revisión visual e interacción en navegador sigue pendiente en esta sesión. El modelo, autenticación, Gmail y almacenamiento permanecen sin conexión con la web; tener las siete pantallas maquetadas no completa esas integraciones.

## Rediseño de la landing — ilustración editorial

La ruta `/como-funciona` también adopta esta dirección visual. El rediseño de la guía y sus comprobaciones en escritorio y móvil se documentan en [como-funciona-diseno-editorial.md](como-funciona-diseno-editorial.md).

El 4 de octubre se renovó la ruta `/` con ilustraciones originales de correspondencia, paleta azul y crema, títulos editoriales, una muestra de correo y cierre panorámico. Se añadieron SplitText y AnimatedContent originales de React Bits con soporte para movimiento reducido. El diseño y las decisiones se registran en [landing-diseno-editorial.md](landing-diseno-editorial.md). Las demás pantallas conservan su estilo actual para una propagación posterior. Se mantiene visible el estado de demostración y las integraciones pendientes.

La revisión posterior corrige el recorte de letras del título, muestra completa la ilustración inicial, suaviza los botones, compacta el footer e introduce un fondo continuo entre las secciones. Tech Text de React Bits acompaña el ejemplo de correo. Se retiraron de la landing los avisos de construcción para revisar su presentación final; las integraciones siguen pendientes. Los detalles están en [landing-diseno-editorial.md](landing-diseno-editorial.md).

La corrección siguiente restaura ambas ilustraciones completas de pared a pared, usa el cielo para colocar el texto y amplía la transición de azules al footer. Tech Text emplea explícitamente los parámetros originales de la captura del usuario, incluido el arrastre y barrido, en un bloque amplio oscuro. Se verificaron el ancho y la proporción de las imágenes, su visibilidad inicial y el comportamiento del componente.
