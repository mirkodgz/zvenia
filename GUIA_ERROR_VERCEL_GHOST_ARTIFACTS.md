# 👻 Guía de Solución: El Bug de los "Artefactos Fantasma" en Vercel

> **Nombre Clave:** Vercel Ghost Artifacts / Prebuilt Output Error
> **Síntoma Principal:** Error 500 en producción con `ERR_MODULE_NOT_FOUND` (React, Piccolore, etc.), aunque el código esté perfecto.

## 🚨 El Problema

Este error ocurre cuando **subimos accidentalmente la carpeta `.vercel` o `dist`** (archivos generados en tu computadora local con Windows) al repositorio de GitHub.

Vercel detecta esa carpeta y dice:
> _"¡Ah! El usuario ya construyó el sitio. No necesito compilar nada. Usaré lo que subió."_

### ¿Por qué falla?
Vercel intenta ejecutar en sus servidores **Linux** unos archivos binarios y rutas pre-calculadas en **Windows**.
- Las rutas de archivos son diferentes (`C:\...` vs `/var/task/...`).
- Las dependencias se empaquetan distinto.
- Resultado: El servidor explota buscando archivos que no existen en las rutas esperadas.

---

## 🕵️‍♂️ Cómo Detectarlo (El Diagnóstico)

Si tienes un error persistente en Vercel que no tiene sentido, revisa los **Build Logs** en el panel de Vercel.

Busca esta línea ESPECÍFICA al inicio del log:
```log
Cloning github.com/tu-usuario/tu-proyecto...
Skipping build cache, deployment was triggered without cache.
Using prebuilt build artifacts from .vercel/output  <-- 💀 LA PISTA MORTAL
Deploying outputs...
```
Si ves `Using prebuilt build artifacts`, **TIENES ESTE BUG.**
(Vercel debería decir `Running "npm run build"`, no usar artefactos pre-construidos).

---

## 🛠️ La Solución (El Fix "Nuclear")

Debemos eliminar esos archivos "basura" del repositorio de Git y asegurarnos de que nunca vuelvan a subir.

### Paso 1: Ejecuta estos comandos en tu terminal
Esto borra las carpetas problemáticas de la "memoria" de Git (el índice), pero **NO** borra tus archivos locales (gracias a `--cached`).

```bash
git rm -r --cached .vercel dist .astro
```
_Si te da error diciendo que no encuentra algún archivo, no pasa nada, continúa._

### Paso 2: Asegura tu `.gitignore`
Abre el archivo `.gitignore` y verifica que tenga estas líneas:

```gitignore
# build artifacts
.vercel/
dist/
.output/
.astro/
```

### Paso 3: Sube el cambio
```bash
git add .gitignore
git commit -m "fix: remove ghost artifacts to force clean vercel build"
git push
```

### Paso 4: ¡Redeploy!
Vercel detectará el nuevo commit. Al no encontrar la carpeta `.vercel` en el repositorio, se verá obligado a ejecutar `npm run build` desde cero en su entorno Linux limpio. El error desaparecerá.

---

## 📝 Resumen para el Futuro

Si Vercel se comporta raro, **SIEMPRE** verifica si por accidente subiste la carpeta `.vercel`. Es un error muy común al trabajar desde Windows.
