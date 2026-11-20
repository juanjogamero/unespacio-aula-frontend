# Unespacio Aula · Frontend

Aplicación web educativa para **profesores particulares** y **pequeñas academias**. Código frontend modular en TypeScript, sin frameworks ni dependencias de ejecución. Esta es la implementación en curso del producto, no un HTML monolítico.

## Estado del proyecto (0.2.0)

**Implementado:** navegación y pantallas por perfil; pantalla de inicio de sesión; dashboard docente; clases y temas; materiales (texto, enlace, archivo); actividades; entregas y correcciones; agenda; ficha individual de alumno; creación básica de alumnos y grupos; formularios y diseño adaptable.

**Pendiente para operar con cuentas reales:** autenticación en el VPS, autorización servidor por organización y rol, base de datos, almacenamiento privado, invitaciones, correo, recuperación de contraseña, políticas de privacidad y pruebas de seguridad integrales.

> ⚠️ **La URL de GitHub Pages es un entorno de desarrollo público con datos ficticios locales. No es una autenticación real ni debe usarse con información de menores.** La pantalla de acceso y los endpoints de autenticación de producción ya están preparados, pero el VPS aún no los proporciona.

## Sitios

- [Entorno de desarrollo](https://juanjogamero.github.io/unespacio-aula-frontend/): abre la pantalla de acceso y permite entrar con cuatro **cuentas de desarrollo**, claramente identificadas. No solicita contraseñas de prueba.
- [Repositorio](https://github.com/juanjogamero/unespacio-aula-frontend): fuente y GitHub Actions.

La experiencia es única, con roles diferentes:

- **Profesor particular:** Mis alumnos, materias, sesiones, materiales y tareas individuales.
- **Profesor de academia:** dashboard, Mis clases, temas, materiales, tareas, entregas y sesiones.
- **Administrador de academia:** grupos, alumnos y organización básica.
- **Alumno:** Mi aprendizaje, tareas, respuestas y calificaciones.

Los datos ficticios del entorno de desarrollo se guardan **solo en el navegador** (metadatos en `localStorage`, sesión de desarrollo en `sessionStorage`, archivos en IndexedDB), separados de cualquier cuenta real. Esto permite probar la continuidad entre sesiones y los perfiles en el mismo navegador, pero **no habilita seguridad, colaboración entre dispositivos, copias de seguridad ni almacenamiento privado**.

## Desarrollo local

Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre `http://127.0.0.1:4173/`. La compilación local de desarrollo incluye exclusivamente cuentas de prueba.

```bash
npm run check         # tipado, pruebas y compilación productiva
npm run build         # compilación productiva, sin datos ni cuentas de desarrollo
npm run pages:build   # compilación especial con datos ficticios para GitHub Pages
```

En producción, el frontend no permite seleccionar perfiles ni acceder a datos ficticios: requiere una sesión válida en `/api/v1/me/snapshot`. El formulario de login apunta a `/api/v1/auth/csrf` y `/api/v1/auth/login`; el cierre de sesión a `/api/v1/auth/logout`. El VPS deberá servir la UI y proxy HTTPS de la API **desde el mismo origen**.

## Código

```text
src/
  core/
    types.ts          Tipos y contratos API
    http.ts           Gateway de la API real (cookies same-origin, CSRF)
    development.ts    Datos ficticios persistentes solo en build de desarrollo
    local-files.ts    Archivos ficticios en IndexedDB, solo desarrollo
    security.ts       Escapado, validación de enlaces y archivos
  ui/
    app.ts            Sesión, navegación, acceso y formularios
    views.ts          Pantallas por rol
    helpers.ts        Utilidades de presentación
    icons.ts          Iconografía SVG
  main.ts             Arranque
  styles.css          Sistema visual
public/               HTML y favicon
scripts/              Compilación, publicación Pages y servidor local
.github/workflows/    Pruebas y despliegue de desarrollo
```

## Seguridad y siguiente fase

Revisar [requisitos de seguridad](docs/security.md), [contrato de API](docs/api-contract.md) y [arquitectura](docs/architecture.md) **antes de conectar el VPS**. GitHub Pages no ofrece controles de autenticación de servidores. Nunca utilizar el selector de roles de desarrollo como mecanismo de autorización.

**Alcance MVP:** el documento maestro de producto está en `docs/producto/Documento_maestro_MVP_v2.md`. Precios, prueba gratuita y límites comerciales permanecen como hipótesis. No incluimos IA, pagos, facturación ni videoconferencias.
