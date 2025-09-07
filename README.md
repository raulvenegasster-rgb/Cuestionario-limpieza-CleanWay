
# Cuestionario de Transporte (React + Vite + Tailwind)

## Desarrollo local
```bash
npm install
npm run dev
```
Abre http://localhost:5173

## Build de producción
```bash
npm run build
npm run preview
```

## Desplegar en Vercel (recomendado)
1. Crea un repo y súbelo: `git init && git add . && git commit -m "init"`
2. En Vercel, **New Project** > importa el repo.
3. Framework: **Vite**. Comando de build: `npm run build`. Directorio: `dist/`.
4. Deploy y listo. Obtendrás un link tipo `https://tu-app.vercel.app`.

## Desplegar en Netlify
1. Conecta el repo en https://app.netlify.com
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

## Sin Git (arrastrar y soltar)
- Build local (`npm run build`). Sube la carpeta `dist/` a **Netlify Drop**: https://app.netlify.com/drop o a **Vercel** usando la integración de arrastrar carpeta `dist`.
