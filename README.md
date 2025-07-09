# 🎮 Tetris Game

Un juego de Tetris clásico desarrollado con React, TypeScript y Tailwind CSS. Incluye todas las funcionalidades básicas del Tetris original con una interfaz moderna y animaciones suaves.

## 🚀 Características

- **Gameplay completo**: Todas las piezas clásicas del Tetris (I, J, L, O, S, T, Z)
- **Sistema de puntuación**: Gana puntos completando líneas
- **Niveles progresivos**: El juego se acelera con cada nivel
- **Controles intuitivos**: Usa las flechas del teclado para jugar
- **Animaciones suaves**: Efectos visuales con Framer Motion
- **Diseño responsive**: Funciona en desktop y móvil
- **Pausar/Reanudar**: Pausa el juego con la barra espaciadora

## 🎯 Cómo jugar

### Controles
- **←** / **→**: Mover la pieza hacia la izquierda/derecha
- **↓**: Acelerar la caída de la pieza
- **↑**: Rotar la pieza
- **ESPACIO**: Pausar/Reanudar el juego

### Objetivo
- Completa líneas horizontales para eliminarlas y ganar puntos
- Evita que las piezas lleguen a la parte superior
- Cada 500 puntos subes de nivel y el juego se acelera

## 🛠️ Tecnologías utilizadas

- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de estilos
- **Framer Motion**: Animaciones
- **Vite**: Herramienta de construcción
- **Lucide React**: Iconos

## 📦 Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/tu-usuario/tetris-game.git
cd tetris-game
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🏗️ Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la build de producción
- `npm run lint`: Ejecuta el linter

## 🎨 Personalización

### Colores de las piezas
Puedes modificar los colores de las piezas en el objeto `TETROMINOS` en `src/App.tsx`:

```typescript
const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: 'cyan-500' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue-500' },
  // ... más piezas
}
```

### Velocidad del juego
Ajusta la velocidad inicial y el factor de aceleración:

```typescript
const INITIAL_DROP_TIME = 800 // milisegundos
const SPEED_INCREASE_FACTOR = 0.95 // multiplicador por nivel
```

## 🚀 Despliegue

### Netlify
1. Ejecuta `npm run build`
2. Sube la carpeta `dist` a Netlify

### Vercel
1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente que es un proyecto Vite

### GitHub Pages
1. Instala `gh-pages`: `npm install --save-dev gh-pages`
2. Añade en `package.json`:
```json
{
  "homepage": "https://tu-usuario.github.io/tetris-game",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```
3. Ejecuta `npm run deploy`

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas para mejoras:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎯 Próximas mejoras

- [ ] Mostrar la siguiente pieza
- [ ] Guardar high score en localStorage
- [ ] Efectos de sonido
- [ ] Modo multijugador
- [ ] Temas de color personalizables
- [ ] Controles táctiles para móvil

## 👨‍💻 Autor

Creado con ❤️ como proyecto de aprendizaje.

---

¡Diviértete jugando Tetris! 🎮