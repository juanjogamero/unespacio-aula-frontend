# Unespacio Aula · Frontend

Primera base **de código real** para el frontend del MVP de Unespacio Aula. Mantiene la línea visual de la v26, pero está dividida en módulos TypeScript, CSS y contratos de acceso a la API. El backend se conectará en una fase posterior al VPS.

> **Estado:** frontend inicial implementado y compilable; **no** es una plataforma de producción lista para alumnos reales. No dispone todavía de autenticación, API operativa, controles de permisos de servidor ni almacenamiento privado. Las pantallas de prueba utilizan exclusivamente datos ficticios en memoria.

## Diseño y alcance

- Plan **Profesor**: Mis alumnos, ficha única con varias materias, preparación y registro de sesiones, tareas y materiales individuales.
- Plan **Academia**: inicio docente, Mis clases, grupos, temas, materiales, tareas, entregas y calificación sencilla. Vista del administrador de grupos.
- Plan **Alumno**: Mi aprendizaje, actividades, respuesta de texto, calificaciones y agenda.
- Elementos comunes: menú lateral, búsqueda, avisos compactos, perfil, agenda, formularios y estados vacíos.
- No se implementan pagos, facturación, IA, videoconferencia ni funciones administrativas avanzadas.

## Requisitos

Node.js 20 o superior. Ejecuta `npm install` para instalar **TypeScript como única dependencia de desarrollo**. La interfaz no requiere paquetes de terceros en producción.

## Arrancar la vista previa

```bash
npm install
npm run preview
```

Abre **http://127.0.0.1:4173/preview.html**. Solo esta vista habilita datos ficticios y cambio de perfil. También se puede abrir el `preview.html` compilado localmente en determinados navegadores, pero el servidor local es la opción recomendada.

Los cambios en la vista previa son **temporales y se pierden al recargar**. No utilizar nombres, notas ni archivos de menores reales durante esta fase.

## Compilar para producción

```bash
npm run check
```

El resultado está en `dist/`. **El build de producción excluye la página de vista previa y sus datos ficticios.** Si aún no hay backend, se muestra la pantalla de acceso pendiente sin permitir entrar a los perfiles.

No publiques datos reales hasta completar la fase de API, seguridad, permisos, despliegue y cumplimiento.

## Estructura

```text
src/
  core/
    types.ts        # DTO y contratos entre UI y backend
    http.ts         # peticiones same-origin a /api/v1, CSRF, archivos
    preview.ts      # datos ficticios en memoria, EXCLUIDO del build productivo
    security.ts     # escape, enlaces y validación inicial de archivos
  ui/
    app.ts          # shell, navegación, formularios y flujos
    views.ts        # pantallas y contenidos por perfil
    icons.ts        # iconos SVG coherentes
    helpers.ts      # fechas, textos, estados
  main.ts
  styles.css
scripts/
  build.mjs         # compilación sin dependencias de runtime
  serve.mjs         # servidor de desarrollo estático con CSP
public/            # HTML y favicon
.github/workflows/  # verificación automática
```

## API futura

La aplicación solo pide datos mediante `Gateway`. La implementación real `HttpGateway` consulta `/api/v1/me/snapshot` y utiliza rutas de temas, materiales, tareas, sesiones y calificaciones. El VPS deberá servir el frontend y exponer la API mediante proxy **en el mismo origen**, con HTTPS.

La respuesta de sesión deberá estar **filtrada en el servidor por usuario, rol y organización** y puede incluir un token CSRF por sesión (`csrfToken`) que solo estará en memoria. No introducir tokens, claves o contraseñas en archivos `.env` destinados al navegador.

Consulta [docs/api-contract.md](docs/api-contract.md), [docs/security.md](docs/security.md), [docs/architecture.md](docs/architecture.md) y [docs/github.md](docs/github.md).

## Pruebas y límites

`npm run check` verifica tipos, pruebas estáticas y compilación productiva. Hay comprobaciones visuales con Chromium local; no constituyen una auditoría de seguridad ni una prueba E2E exhaustiva. Faltan pruebas reales de multiusuario, permisos, carga de archivos en VPS y accesibilidad completa antes de un piloto.

## Referencias de producto

- `docs/producto/Documento_maestro_MVP_v2.md`: alcance y decisiones de producto.
- `docs/producto/Propuesta_pantallas_v22.md`: recorridos de profesor, academia y alumno.
- La v26 original se conserva fuera del repositorio como referencia histórica; su HTML monolítico no forma parte del frontend productivo.
