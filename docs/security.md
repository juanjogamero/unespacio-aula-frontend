# Seguridad — Requisitos y límites de la fase frontend

**No es una certificación ni una auditoría de seguridad.** No exponer datos reales hasta implementar y verificar el servidor.

## Aplicado en este repositorio

- Compilación productiva sin selector de rol ni `preview.html` ni `core/preview.js`.
- Sin autenticación ficticia presentada como real: cuando falla `/me/snapshot` se bloquea el campus.
- El código no almacena contraseñas, tokens de sesión ni datos educativos en `localStorage`/`sessionStorage`.
- Solicitudes same-origin, sin incluir tokens en URLs, cookies enviadas por el navegador y cabecera CSRF para mutaciones.
- Textos de usuarios escapados al pintar HTML. Recursos externos restringidos a URL `http:` o `https:` (no `javascript:` ni `data:`).
- Límite inicial de 10 MB y extensiones/MIME admitidos para adjuntos en el cliente (debe revalidar el servidor).
- Servidor de desarrollo con CSP, `nosniff`, protección de iframe, política de permisos y caché desactivada.
- Sin scripts, paquetes ni fuentes cargados desde terceros en runtime.
- La vista previa únicamente tiene datos ficticios en memoria y se activa en desarrollo (localhost o archivo local), no en producción.

## Obligatorio antes del piloto

1. **Autenticación del backend**: inicio de sesión con protección antibruteforce, sesiones rotativas, cierre de sesión, restablecimiento, expiración, bloqueo adecuado. Cookies `Secure`, `HttpOnly`, `SameSite` y CSRF completo.
2. **Autorización de servidor**: comprobar `workspace_id`, rol, matrícula, asignación de profesor y destinatario para cada lectura y mutación, también para archivos y mensajes. Probar aislamiento entre dos academias.
3. **Base de datos**: claves foráneas, ámbito de organización en cada entidad, migraciones, límites, operaciones transaccionales y copias de seguridad verificadas.
4. **Adjuntos**: almacenamiento privado, antivirus, inspección de tipo real y tamaño, cuota por centro, nombres aleatorios, descarga autenticada y caducidad de enlaces.
5. **Despliegue**: HTTPS, HSTS tras confirmar certificados, cabeceras CSP estrictas en Nginx, secreto fuera del frontend y de GitHub, actualizaciones, firewall, usuarios mínimos, logs y monitorización sin datos sensibles.
6. **Privacidad y menores**: análisis RGPD/LOPDGDD, minimización de datos, bases jurídicas y contratos pertinentes, control de accesos, retención/borrado, exportación, posibles autorizaciones, análisis de riesgos.
7. **Pruebas**: E2E por rol, pruebas negativas de IDOR/BOLA, CSRF, XSS, permisos, subida de ficheros, errores y accesibilidad. Preparar plan de respuesta a incidencias.

## Riesgos residuales

El filtrado visual de datos y los checks en `PreviewGateway` son didácticos; cualquier usuario puede inspeccionar el código JavaScript. **No sirven para aislar información real.** El backend deberá devolver solo lo permitido y rechazar todas las operaciones sin autorización, incluso si el cliente se modifica a mano.
