# Frontend del detector de correos

Landing de presentación, login, bandeja de Gmail, historial, cuenta, ayuda y pantalla **Analizar correo**, creadas con React, TypeScript, Vite, Tailwind CSS, shadcn/ui y React Bits. React Router gestiona la navegación.

## Ejecutar

Requiere Node.js 22.12 o superior dentro de la versión 22, o una versión posterior compatible con Vite.

Desde esta carpeta:

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Abrir `http://127.0.0.1:5173`. Para comprobar el código:

```powershell
npm run build
npm run lint
```

## Rutas

- `/`: landing con presentación, cómo funciona, acerca del proyecto, limitaciones y acceso al analizador.
- `/analizar`: formulario y resultados de demostración.
- `/login`: maqueta de acceso con Google y entrada al analizador sin cuenta.
- `/bandeja`: bandeja ficticia con búsqueda, filtros, detalle y análisis de los dos ejemplos.
- `/historial`: registros ficticios con búsqueda, clasificación, intervalo de fechas y detalle en un diálogo.
- `/cuenta`: acceso a la cuenta y conexión de Gmail, con estados ficticios y confirmación para restablecer el ejemplo.
- `/como-funciona`: guía de uso, resultados, privacidad, limitaciones y preguntas frecuentes.
- Las rutas desconocidas redirigen al inicio.

Para publicar `dist/`, el servidor deberá devolver `index.html` al abrir las rutas del frontend directamente. Vite ya permite recargar `/analizar` durante el desarrollo.

## Qué se puede probar

- Navegar desde la landing al analizador y regresar mediante el nombre del proyecto.
- Abrir las secciones Cómo funciona y Acerca del proyecto de la landing.
- Abrir el login, consultar el aviso de autenticación pendiente y continuar sin cuenta.
- Explorar la bandeja desde el login, buscar por asunto o remitente, filtrar por clasificación y seleccionar un mensaje.
- Analizar cada ejemplo en la bandeja; los resultados se mantienen por mensaje hasta abandonar la pantalla o recargar.
- Consultar el aviso de conexión pendiente de Gmail.
- Introducir asunto y cuerpo; el cuerpo vacío o con espacios se rechaza.
- Cargar dos ejemplos ficticios y ver resultados simulados, con una espera breve.
- Consultar clasificación y confianza de demostración.
- Editar el mensaje e invalidar el resultado anterior.
- Confirmar o cancelar la limpieza y el reemplazo del contenido.
- Abrir la ayuda sin perder lo escrito.
- Usar la pantalla en escritorio o celular.

**Flask y el modelo todavía no están conectados.** Solo los ejemplos exactos tienen una respuesta preparada. Cualquier otro texto presenta un aviso de integración pendiente; no se intenta clasificarlo mediante reglas. No hay almacenamiento persistente ni llamadas a una API.

La ayuda completa está en `/como-funciona`; el analizador conserva su ayuda breve en un diálogo y abre la guía completa en una pestaña nueva para mantener el borrador. La landing incluye una explicación general del flujo. El login es una maqueta: el botón de Google muestra un aviso y no inicia OAuth, crea sesiones ni lee correos. La bandeja de Gmail es una maqueta con dos mensajes ficticios; no lee correos reales. El historial es una maqueta independiente y no guarda los análisis de otras pantallas. La integración de Gmail, el almacenamiento del historial y la gestión real de cuenta y permisos siguen pendientes.

## Organización

- `src/App.tsx`: rutas de la aplicación.
- `src/features/landing/`: página de presentación y sus estilos.
- `src/features/auth/`: maqueta de login y sus estilos.
- `src/features/help/`: guía de uso y preguntas frecuentes, con detalles nativos.
- `src/features/account/`: cuenta y conexiones de demostración y sus estilos.
- `src/features/history/`: historial ilustrativo y sus estilos.
- `src/features/inbox/`: bandeja de demostración y sus estilos; reutiliza los ejemplos y el servicio simulado del analizador.
- `src/features/analysis/`: página de análisis, formulario, resultado y servicio de demostración.
- `src/components/ui/`: controles originales de shadcn/ui, estilo Base Nova.
- `src/components/react-bits/FadeContent.tsx`: transición de React Bits para el título de la landing y el resultado.
- `src/index.css`: tokens, estilos de la pantalla y adaptación a distintos tamaños.

## Componentes externos

Los controles se instalaron con la CLI oficial de [shadcn/ui](https://github.com/shadcn-ui/ui). Se ajustaron el texto de cierre al español, el tamaño del diálogo y las exportaciones de variantes que no se utilizan. Su licencia está en `src/components/ui/LICENSE.md`.

[FadeContent de React Bits](https://github.com/DavidHDev/react-bits/blob/main/public/r/FadeContent-TS-TW.json) se incorporó desde el registro TypeScript/Tailwind oficial. Se añadió soporte para movimiento reducido y se corrigieron las dependencias del efecto de React. Su licencia se conserva en `src/components/react-bits/LICENSE.md`. La ilustración del encabezado usa CSS y el icono de correo de Lucide; no pretende ser un componente de React Bits.

Las versiones instaladas se fijan en `package-lock.json`. Manrope se sirve desde la aplicación mediante Fontsource; no se solicitan fuentes a Google.

## Verificación de este avance

- `npm run build`: correcto, incluye comprobación de TypeScript; Vite avisa de un paquete JavaScript mayor de 500 kB antes de gzip.
- `npm run lint`: correcto, sin avisos.
- Pruebas Python existentes: 12 correctas.
- Revisión en navegador a 360, 768 y 1440 px: sin desplazamiento horizontal.
- Flujo comprobado: entrada vacía y espacios, carga con campos bloqueados, ejemplos legítimo y malicioso, invalidación al editar, cancelación y confirmación de limpieza, texto libre con aviso y ayuda en celular.

Las preferencias de movimiento reducido se contemplan en CSS y FadeContent; no se ha realizado una revisión con lector de pantalla ni una prueba cambiando esa preferencia del sistema.

### Verificación del historial

Build y lint correctos. Falta revisar visualmente `/historial` e interactuar con sus filtros y diálogo en navegador; las revisiones de navegador indicadas arriba corresponden a las pantallas previas. El aviso de Vite sobre tamaño del paquete sigue presente.

### Verificación de cuenta y conexiones

Build y lint correctos. La revisión visual y de interacción en navegador de `/cuenta` queda pendiente. El cambio de conexión ficticia solo modifica memoria local; no inicia peticiones externas ni concede o revoca permisos reales.

### Verificación de ayuda

Build y lint correctos. Se contrastó el límite de tokens con el clasificador local. Revisión visual, navegación por anclas y preguntas desplegables en navegador pendientes por falta de herramientas de navegador en esta sesión.

## Identidad visual

El símbolo Segunda mirada se sirve desde `public/brand/logo-segunda-mirada-v1.png`. `src/components/BrandMark.tsx` lo comparte entre los siete encabezados; `index.html` lo usa como favicon e icono de acceso directo. Es un PNG con transparencia, generado para el proyecto. Concepto y prompts en [docs/logo-propuesta-v1.md](../docs/logo-propuesta-v1.md). Revisión visual en navegador pendiente.
