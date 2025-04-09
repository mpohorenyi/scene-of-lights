# Scene of Lights

A 3D scene with dynamic day-night cycle where the sun orbits the landscape, controlling light intensity and shadows while street lamps automatically illuminate at night.

## 📋 Technical Requirements

1. Add a plane (floor) that will receive shadows
2. Add a house model to the scene
3. Add a street lamp model that will emit a SpotLight
4. Add a lamp model that will emit a PointLight
5. Add a yellow sphere that will behave like the sun:
   - It will rotate around the scene
   - It will emit a DirectionalLight
   - When the sun is at its highest point - maximum light intensity
   - When it sets below the horizon - minimum intensity
6. Add an AmbientLight that will synchronously change its intensity with the DirectionalLight
7. SpotLight and PointLight will turn on when the DirectionalLight sets below the horizon
8. All objects must cast shadows on the ground

## 🛠️ Technologies

- [Three.js](https://threejs.org/) - JavaScript 3D library
- [Tween.js](https://github.com/tweenjs/tween.js/) - Animation library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [lil-gui](https://lil-gui.georgealways.com/) - Lightweight GUI library
- [Vite](https://vitejs.dev/) - Modern build tool

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mpohorenyi/scene-of-lights.git
cd scene-of-lights
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run format` - Format code
- `npm run type-check` - Run TypeScript type checking
