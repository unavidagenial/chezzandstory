OCULA — Plataforma Asistiva en React (Cuento y Ajedrez)
Plataforma web de accesibilidad controlada por movimiento cefálico/ocular (MediaPipe Face Mesh) con selección por fijación de mirada (dwell-to-click) y síntesis de voz en español.
Estructura del Proyecto
index.html: Punto de entrada que carga React 18, Babel y MediaPipe desde CDN (no requiere compilación con Node.js, ideal para GitHub Pages y Netlify).
styles.css: Estilos responsivos, grilla del cuento y tablero de ajedrez accesible.
app.js: Lógica en React con componentes modulares (HomeMenu, StoryBoard, ChessGame y el motor global de rastreo por punta de nariz).
