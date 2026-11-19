# Desarrollo en GitHub

Repositorio: [juanjogamero/unespacio-aula-frontend](https://github.com/juanjogamero/unespacio-aula-frontend).

## Flujo de trabajo

- Rama principal: `main`.
- Cada cambio de producto se entrega en un commit descriptivo; para cambios grandes, utilizar ramas `feature/*` y revisiones.
- `Frontend checks` ejecuta compilación, análisis de TypeScript y las pruebas del repositorio.
- No incluir `.env` con secretos, credenciales, datos reales de menores ni archivos privados en el repositorio.

## Vista previa en GitHub Pages

El workflow `deploy-preview.yml` genera una versión de demostración **con datos ficticios exclusivamente** desde `main`. No contiene login real ni integración con el VPS.

1. GitHub → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Comprobar que el plan contratado permite GitHub Pages con un repositorio privado; en GitHub Free normalmente exige repositorio público. No cambiar a público sin autorización expresa.
3. Ejecutar `Publish safe preview to GitHub Pages` o realizar un commit para iniciar el workflow.
4. Revisar el estado en Actions y la dirección indicada por la tarea `deploy`.

El URL esperado, si Pages se habilita en el repositorio, es `https://juanjogamero.github.io/unespacio-aula-frontend/`. No se debe comunicar como operativo hasta que exista despliegue verificado.

### Producción futura

El build `npm run build` excluye la vista previa y sus datos ficticios. La API `/api/v1` y el acceso real requieren configurar el VPS, HTTPS, sesión segura y autorización de servidor por usuario/academia.
