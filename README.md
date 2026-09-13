# Valle Esmeralda

Juego educativo para estudiantes de grados décimo y undécimo, desarrollado con React y Vite. La versión actual contiene 68 niveles distribuidos en mundos de experimentación, razonamiento lógico, coordenadas y funciones, laberintos, estrategia y un enfrentamiento final.

## Ejecutar y comprobar

Requiere Node.js 20.19 o una versión posterior compatible.

```sh
npm install
npm run dev
```

La versión lista para publicar se genera con:

```sh
npm test
npm run build
npm run preview
```

Los archivos resultantes quedan en `dist/`. Las rutas son relativas para que el juego funcione tanto en un dominio propio como dentro de una carpeta de GitHub Pages.

## Publicar en Vercel

1. Subir este proyecto a un repositorio de GitHub.
2. En Vercel, elegir **Add New > Project** e importar el repositorio.
3. Si el repositorio contiene una carpeta superior, seleccionar `outputs/valle-esmeralda` como directorio raíz.
4. Vercel reconocerá Vite. La compilación es `npm run build` y la carpeta de salida es `dist`.
5. Publicar y usar la dirección generada para enlazar el juego desde la página educativa.

`vercel.json` ya contiene la configuración necesaria.

## Publicar en GitHub Pages

El flujo `.github/workflows/deploy-pages.yml` prueba, compila y publica el juego automáticamente al enviar cambios a la rama `main`.

1. En GitHub, abrir **Settings > Pages**.
2. En **Build and deployment**, seleccionar **GitHub Actions**.
3. Enviar la rama `main`. La publicación aparecerá en la pestaña **Actions**.

## Estado de las cuentas

La pantalla de acceso actual es una demostración local. Guarda solamente una identidad y el progreso en el navegador; no crea cuentas reales ni envía contraseñas. Para registrar estudiantes, recuperar contraseñas, sincronizar avances, medir tiempo y ofrecer un panel de administrador hace falta conectar posteriormente un servicio de autenticación y una base de datos.

El acceso piloto posterior al Nivel 26 acepta un código de cuatro cifras. Puede configurarse durante la compilación con `VITE_PILOT_CODE`; este valor es visible en el navegador y sirve como control de prueba, no como secreto de seguridad.

## Recursos visuales

Las 43 imágenes que usa el juego se publican en WebP para reducir el tiempo de carga en celulares. Los PNG originales se conservan localmente en `artifacts/source-art/` y están excluidos del repositorio para evitar una descarga innecesaria. `scripts/optimize-assets.mjs` permite repetir la conversión si se agregan nuevas imágenes y se dispone de `sharp`.

## Validación

- 71 pruebas automatizadas cubren trayectorias, colisiones, niveles solucionables, progresión, acceso piloto y sesión local.
- La construcción de producción valida que los componentes y recursos puedan publicarse como sitio estático.
- Antes de compartirlo con estudiantes se recomienda una prueba piloto en varios celulares reales y navegadores, especialmente para controles táctiles, rendimiento y legibilidad.
