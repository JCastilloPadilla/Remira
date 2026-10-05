# Logo de Remira: la segunda hoja

La propuesta elegida reúne dos hojas desplazadas que sugieren una R mediante sus bordes y el espacio entre ellas. Usa azul tinta para acompañar la marca en Fraunces y las ilustraciones de correspondencia. Fue generada con la herramienta integrada de generación de imágenes; no es un archivo vectorial.

## Archivos incorporados

- `frontend/public/brand/logo-remira-segunda-hoja-v2.png`: símbolo de 512×512 px con transparencia, compartido por los siete encabezados y el footer mediante `BrandMark`.
- `frontend/public/brand/favicon-remira-v2.png`: versión de 64×64 px sobre fondo de papel para la pestaña del navegador.
- `frontend/public/brand/apple-touch-remira-v2.png`: versión de 180×180 px sobre fondo de papel para accesos directos.

La preparación para web recorta el margen transparente sobrante y reduce la resolución conservando la proporción. El archivo de la propuesta anterior permanece disponible. La fuente original de esta propuesta se generó en `C:/Users/joose/.codex/generated_images/01a0f076-b655-7f70-bf70-54844aea57a1/exec-18de985c-547f-42df-bdee-6acedf178094.png`; la web utiliza exclusivamente los archivos dentro del repositorio.

## Prompt de generación

Use case: logo-brand. Create a single original logo SYMBOL concept for Remira, an email review application with an editorial illustrated correspondence identity. Concept: 'the second sheet' — exactly two overlapping paper sheets, slightly offset, whose cleverly shaped edges and shared negative space form a subtle but recognizable capital R. Prioritize an elegant distinctive silhouette readable at favicon size. Flat vector-like graphic, single solid deep ink navy #132c4d, generous clean negative space, lightly softened corners, restrained organic geometry reminiscent of paper rather than a rigid generic corporate document icon. Front sheet's shoulder and a slanted lower paper edge together imply the bowl and leg of R; the rear sheet contributes the upright stem. Two sheets must remain recognizable. Compact balanced approximately square mark, centered, fill roughly 65% of image with ample transparent margin. Truly transparent background. No lettering or wordmark, no labels, no presentation board, no multiple variants, no envelope, eye, shield, checkmark or magnifying glass, no generic stacked rectangular pages with text lines. No gradients, shadows, texture, 3D, outlines too thin to reproduce at 24px, or decorative flourishes. Show one carefully resolved professional logo symbol.

## Verificación

Carga del nuevo símbolo comprobada en las siete rutas, junto con la disponibilidad del favicon y del icono de acceso directo. Revisión visual de encabezado y footer en escritorio y móvil, sin desbordamiento horizontal. Compilación y lint completados. Se mantiene el aviso previo de tamaño del paquete JavaScript.

## Variante blanca para fondos oscuros

`BrandMark` admite `tone="light"`: presenta el mismo símbolo en blanco puro mediante un filtro de color, conservando su transparencia y silueta. El footer utiliza esta variante con fondo transparente, sin el recuadro de papel que tenía antes. La variante puede reutilizarse en cualquier otra superficie oscura.

La pestaña utiliza `frontend/public/brand/favicon-remira-adaptive-v3.svg`, sin fondo. En tema claro mantiene el azul tinta; en tema oscuro utiliza blanco. El SVG contiene la imagen del símbolo y un filtro de color, no una reconstrucción vectorial. La adaptación se basa en `prefers-color-scheme`.

Se comprobó en navegador que el footer no tiene fondo en el símbolo y que el favicon aplica blanco únicamente en tema oscuro. Revisión visual y compilación/lint completados correctamente.
