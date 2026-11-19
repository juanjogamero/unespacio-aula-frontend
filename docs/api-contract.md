# Contrato inicial de API (propuesta, NO implementado en VPS)

Base `/api/v1` bajo HTTPS y mismo origen. Todas las respuestas JSON de éxito usan un contrato compartido con `types.ts`. Todos los identificadores son opacos y el servidor no acepta `workspaceId` del cliente para autorizar nada.

## Sesión y autenticación

- `GET /me/snapshot` → `Snapshot` filtrado por organización y permisos, con propiedad adicional opcional `csrfToken` **solo para el navegador autenticado**. Si no hay sesión: `401`.
- Inicio de sesión y recuperación de cuenta: **pendientes de definir**. Cookies `HttpOnly; Secure; SameSite=Lax/Strict`, rotación del ID al iniciar sesión y expiración apropiada. No usar JWT en localStorage.
- `403` para acciones sin permisos y `404` genérico cuando no debe confirmarse la existencia de un recurso ajeno.

## Operaciones que la interfaz ya llama

| Método | Ruta | Función |
|---|---|---|
| POST | `/topics` | Crear tema en clase asignada |
| PATCH | `/topics/:id` | Editar tema |
| POST | `/materials` | Material con multipart FormData y archivo opcional |
| GET | `/materials/:id/access` | Obtener URL temporal de descarga/lectura autorizada |
| POST | `/assignments` | Publicar actividad individual o de grupo |
| POST | `/assignments/:id/submissions` | Enviar entrega de alumno |
| PATCH | `/submissions/:id/grade` | Nota 0–10 y devolución |
| POST | `/lessons` | Registrar sesión |
| PATCH | `/lessons/:id` | Editar preparación/registro de sesión |

Para crear o modificar, enviar cabecera `X-CSRF-Token` obtenida de la sesión; el servidor también debe comprobar cookies, permisos y validación del contenido.

## Puntos por cerrar antes de implementar

- Entidades y paginación del snapshot (no devolver todo el centro indefinidamente).
- Endpoints para CRUD de alumnos, grupos, matrículas, asignación docente y recurrencias.
- Invitaciones, altas de alumnos, cuentas y restablecimiento de contraseña.
- Política de adjuntos: virus, tamaño, tipo real, cuotas, almacenamiento privado, auditoría y eliminación.
- Entregas con archivos, revisión, cambios posteriores al plazo y visibilidad de calificaciones.
- Límites de solicitudes, logs sin datos personales, eliminaciones y exportación.

**Importante:** el frontend realiza validaciones tempranas para usabilidad; el backend debe repetir toda validación y verificar autorización en cada operación. Nunca deducir el rol a partir de un parámetro del navegador.
