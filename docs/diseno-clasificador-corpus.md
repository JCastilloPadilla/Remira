# Clasificador propio de Remira basado en un corpus etiquetado

Diseño: 10 de noviembre de 2026. Solicitud: proporcionar una estimación útil de
legitimidad, spam, phishing o contenido malicioso; reconocer facturas y cobros y
orientar su revisión. Este documento define la sustitución del veredicto principal
actual; todavía no afirma que el nuevo modelo esté entrenado o validado.

**Implementación posterior:** ya se creó el corpus y se entrenó un primer artefacto
experimental, integrado en la API y ambas interfaces. El resultado y sus límites
están en `docs/resultados-corpus-v1.md`. Las secciones siguientes conservan el
diseño de referencia; no deben leerse como una garantía de calidad del prototipo.

## Comportamiento que debe ver la persona

El resultado principal será una **estimación concreta**, no «Análisis no concluyente».
La fuerza de la evidencia y las partes sin leer se presentarán aparte.

| Salida principal | Interpretación | Acción sugerida |
| --- | --- | --- |
| Probablemente legítimo | Predomina el patrón de comunicación habitual y no se detectaron señales fuertes de engaño. | Revisar remitente y contexto; no implica identidad verificada. |
| Posible spam | Predomina contenido promocional o no deseado, sin suficientes señales de robo de datos o malware. | Comprobar si se solicitó o esperaba; filtrar o ignorar si no interesa. |
| Posible phishing | Hay indicios de suplantación, captura de credenciales o engaño para obtener datos/pagos. | Evitar usar los enlaces del mensaje y verificar por un canal independiente. |
| Posible contenido malicioso | Hay indicios de ejecución, descarga peligrosa, macros, scripts u otra acción dañina. | No ejecutar ni habilitar contenido; revisar por un canal independiente. |

Las categorías pueden coexistir. La salida muestra una principal y señales
secundarias: por ejemplo, contenido malicioso y posible phishing. No se debe
ocultar una señal de phishing porque el modelo detectó publicidad.

«Probablemente legítimo» nunca se deduce solamente de pertenecer a la bandeja de
entrada, contener una marca conocida o no activar una regla. La confianza baja
debe mostrarse como «Estimación débil; requiere revisión», acompañando la categoría
estimada. El sistema debe mostrar qué observó y qué acción recomienda.

Si solo existe una imagen que todavía no se leyó, no se inventa una categoría:
la interfaz pide **Leer texto de la imagen**. Es un fallo de entrada accionable,
no un resultado ambiguo sobre un texto que el sistema sí haya leído.

## Riesgo y finalidad son dimensiones independientes

Una segunda clasificación describe el tipo de mensaje:

- Factura o estado de cuenta.
- Solicitud de pago o aviso de cobro.
- Confirmación de compra o recibo.
- Aviso de cuenta/seguridad.
- Publicidad, comunicación habitual u otro.

La detección de factura usa campos como número de factura, importe, periodo,
fecha y vencimiento, no solo la palabra «invoice». El tipo no modifica por sí
solo la estimación de riesgo. Un correo puede ser «Factura» y «Posible phishing».

Ejemplo de presentación de una factura sin señales fuertes de engaño:

> **Probablemente legítimo** · Tipo: factura o estado de cuenta.
>
> Parece un aviso de facturación. Revísalo con calma: comprueba importe, periodo,
> vencimiento y que corresponda a un servicio que reconoces. Para consultarlo,
> entra por tu acceso habitual al portal del proveedor.
>
> Identidad del remitente no verificada. Esta es una estimación del contenido.

Si esa factura presenta un enlace disfrazado o solicita enviar una contraseña:

> **Posible phishing** · Tiene formato de factura.
>
> El formato de cobro no elimina las señales de engaño detectadas. Verifica el
> aviso con el proveedor por un canal independiente antes de utilizar sus enlaces.

Estas son salidas de diseño, no predicciones ya obtenidas de un modelo nuevo ni
confirmaciones de autenticidad del correo Microsoft aportado en el chat.

## Base de datos y procedencia

Flujo previsto:

```text
Fuentes etiquetadas → revisión/anonimización → SQLite → entrenamiento fuera de línea
                                                         ↓
Correo + OCR + enlaces → características → modelos versionados → estimación de riesgo
                                                           └→ finalidad → recomendación
```

Usar SQLite local para el corpus y sus anotaciones. No consultar una lista de
frases exactas como clasificador principal: la base alimenta el entrenamiento y
permite auditar qué ejemplos y etiquetas se utilizaron.

El esquema está en `docs/clasificador-corpus-schema.sql`. Separar:

1. **Fuentes:** procedencia, licencia, revisión/checksum y clases que realmente aporta.
2. **Ejemplos:** asunto, cuerpo anonimizado, idioma, hash y familia de plantilla.
3. **Anotaciones de riesgo:** etiqueta, valor y origen de la anotación. La ausencia
   de una etiqueta significa desconocida, no negativa.
4. **Finalidad:** factura, cobro, recibo, etc., sin mezclarla con riesgo.
5. **Particiones:** entrenamiento, validación y prueba, fijadas antes de entrenar.
6. **Modelos:** versión del corpus, código, configuración, artefacto y métricas.
7. **Correcciones:** propuestas del usuario pendientes de revisión; no modifican
   inmediatamente el entrenamiento.

Datos disponibles y límites comprobados:

- **CEAS_08 local:** 39,154 filas; 17,312 con etiqueta 0 y 21,842 con etiqueta 1.
  Usar su taxonomía publicada para la tarea legítimo/phishing. No convertir sus
  positivos automáticamente en ejemplos de spam o malware. Fuente:
  https://zenodo.org/records/8339691
- **Tanaos español:** fuente adicional sintética de spam/no spam. Sus etiquetas
  generales no separan por sí mismas phishing, publicidad y malware; no deben
  remapearse como si lo hicieran. No basta repetir su entrenamiento para afirmar
  que se resolvieron los falsos positivos del modelo actual. Fuente:
  https://huggingface.co/datasets/tanaos/synthetic-spam-detection-dataset-spanish
- **Corpus propio revisado:** incorporar estructuras legítimas y peligrosas en
  español e inglés, con facturas reales anonimizadas o plantillas públicas, avisos
  escolares, recibos, newsletters, suplantación y descargas peligrosas. Registrar
  cuáles son sintéticos, cuáles reales y qué señales sustentan cada anotación.
- Faltan ejemplos revisados con etiquetas específicas para entrenar y medir bien
  las cuatro salidas, especialmente contenido malicioso y facturación en español.
  Esto debe resolverse al construir el corpus; no inventar esas etiquetas al importar.

No almacenar automáticamente los correos personales analizados. Su incorporación
al corpus requiere autorización y anonimización. No entrenar con un ejemplo y
después contarlo como prueba independiente de que el sistema lo reconoce.

## Clasificador y entrenamiento

Primera implementación propuesta: Python/scikit-learn, TF-IDF de palabras y
caracteres, y regresión logística como baseline. Comparar con Naive Bayes y SVM
lineal en la misma partición de validación. Evitar elegir otro modelo solo por
ser mayor o por ofrecer una puntuación alta en unos pocos ejemplos.

Entrenar cuatro tareas separadas cuando las fuentes tengan anotaciones parciales:
**legitimidad positiva**, spam, phishing y riesgo malicioso. La tarea de legitimidad
aprende de comunicaciones revisadas —incluidas facturas y recibos legítimos— y de
sus ejemplos negativos anotados. No se calcula como uno menos la mayor puntuación
de riesgo. Una fila sin anotación de malware no es un negativo de malware. El
clasificador de finalidad se entrena aparte.

La política de presentación primero conserva señales críticas observables y
después usa las estimaciones aprendidas y calibradas. Para mostrar legitimidad
con fuerza moderada/alta se exige apoyo positivo del modelo de legitimidad, no
solo riesgo bajo. Cuando compiten varias categorías, presenta la de mayor apoyo
con las otras como alternativas y una indicación de fuerza débil si corresponde.
Las puntuaciones de cabezas entrenadas en fuentes distintas no se comparan crudas:
la política de selección y sus límites se fijan con una validación común anotada
para las cuatro tareas, sin mirar test. El conjunto final de prueba queda separado.
No se distribuye un modelo de cuatro tareas como ya entrenado si alguna tarea
carece de suficientes positivos y negativos revisados para entrenar y evaluar.

Añadir características estructurales: discrepancia entre dominio visible y
destino real, solicitudes de credenciales, urgencia combinada con otras señales,
instrucciones de ejecutar/habilitar contenido y contexto de facturación. No usar
el importe cero, la palabra «tarjeta», una URL o «iniciar sesión» como prueba aislada
de amenaza. No ejecutar adjuntos ni seguir enlaces para generar estas características.

No memorizar remitentes, números de factura, dominios concretos ni nombres de
usuarios. Normalizar identificadores variables sin destruir las señales del
destino real. Mantener idioma y OCR como metadatos de calidad.

Proceso reproducible:

1. Importar fuentes con checksum, revisar correspondencia de etiquetas y anonimizar.
2. Agrupar duplicados y plantillas similares. Separar familias entre train/validation/test.
3. Reservar inicialmente 70/15/15 %, estratificando cuando sea posible por idioma
   y etiquetas. Evaluar también una fuente y familias no vistas para medir generalización.
4. Ajustar representación/modelo y, si procede, calibración únicamente con train/validation.
5. Medir el test una vez con el protocolo fijado. Guardar métricas por idioma, clase,
   finalidad y origen real/sintético; congelar el artefacto y su manifiesto.
6. Entrenar de nuevo solo cuando exista un corpus revisado nuevo, no durante cada petición.

La base no debe usarse para ocultar falsos positivos añadiendo una excepción
«Microsoft = legítimo». Los mensajes comerciales legítimos y facturas deben estar
representados y separados de sus imitaciones fraudulentas.

## Decisión y explicación

Combinar las salidas aprendidas con evidencia estructural comprobable. La categoría
principal se elige con una política fijada en validación, no con un umbral inventado
para hacer que el ejemplo actual pase. Las señales críticas no desaparecen porque
un modelo estime «legítimo».

Separar fuerza de evidencia de calidad de lectura:

- Categoría principal estimada y posible segunda categoría.
- Motivos concretos y finalidad detectada.
- Recomendación específica para ese caso.
- Aviso secundario si hay poca evidencia, OCR pendiente, idioma no representado
  o partes no analizadas. No convertir automáticamente incertidumbre en peligro.
- Ningún porcentaje debe llamarse «probabilidad de que sea seguro» sin calibración
  y evaluación representativa que lo respalden.

Contrato de respuesta previsto, además del diagnóstico técnico actual:

```json
{
  "classification": {
    "primary": "likely_legitimate",
    "secondary": [],
    "evidence_strength": "moderate",
    "provisional": false,
    "model_version": "corpus-v1"
  },
  "purpose": {"kind": "invoice", "basis": ["invoice_number", "billing_period", "amount"]},
  "recommendation": "Parece una factura. Revisa con calma los datos desde tu acceso habitual al proveedor.",
  "warnings": ["Identidad del remitente no verificada"]
}
```

`provisional` se refiere a calidad/evidencia, no a una garantía en los demás casos.
Valores de `primary`: `likely_legitimate`, `possible_spam`, `possible_phishing`,
`possible_malicious`. Si no hay entrada legible se devuelve un error de entrada
con acción para OCR, sin clasificación fabricada.

## Comprobaciones de aceptación

- La factura legítima y su versión con un enlace disfrazado no deben colapsar en
  la misma explicación solo porque comparten diseño.
- Publicidad no se etiqueta automáticamente como phishing; avisos de seguridad
  que dicen «nunca compartas tu contraseña» no se tratan como peticiones de datos.
- Una instrucción de ejecutar un fichero peligroso puede generar aviso de riesgo,
  pero no una afirmación de que el archivo contiene malware sin inspeccionarlo.
- Medir falsos positivos de facturas/cobros legítimos y falsos negativos de phishing
  disfrazado de factura, además de precisión/recall/F1 por clase e idioma.
- Probar textos cortos/largos, imágenes, OCR erróneo, mensajes comerciales, idiomas
  no representados y fuentes no vistas. La ausencia de texto debe ser accionable.
- Comparar el nuevo clasificador con los baselines actuales usando datos separados,
  sin mezclar métricas de spam con métricas de phishing ni presentar casos sintéticos
  como prueba de rendimiento en correos reales.

Referencia de herramientas de clasificación de texto:
https://scikit-learn.org/stable/auto_examples/text/plot_document_classification_20newsgroups.html
