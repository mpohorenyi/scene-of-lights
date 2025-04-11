# Scene of Lights

A 3D interactive scene with a realistic day-night cycle where the sun moves across the sky based on astronomical formulas, controlling light intensity and shadows while street lamps and other light sources automatically illuminate at night.

[Live Demo](https://scene-of-lights.vercel.app/)

## ✨ Key Features

- **Realistic sun movement** based on astronomical calculations
- **Dynamic day-night cycle** with smooth lighting transitions
- **Customizable parameters**:
  - Time of day (0-24 hours)
  - Geographic latitude (-80° to 80°)
  - Day of year (1-365)
  - Animation speed
- **Automatic light activation** when sun sets below the horizon
- **Interactive 3D environment** with orbit controls
- **Visualizations** including sun path trajectory

## 🌞 SkySystem

The heart of this project is the SkySystem module, which simulates the sun's movement using astronomical calculations:

### Components:

- **SunAstronomyCalculator**: Handles solar position calculations
  - Solar declination based on day of year
  - Sun position (azimuth and elevation) for any time and location
  - Sunrise and sunset times
  - Daylight duration calculations
  
- **SkyRenderer**: Manages the visual aspects of the sky and lighting
  - Three.js Sky model with atmospheric rendering
  - Dynamic directional light that follows the sun
  - Ambient light that adjusts based on sun elevation
  - Color temperature changes (warmer at sunrise/sunset)
  
- **SunPathVisualizer**: Shows the sun's trajectory across the sky
  - Visual representation of sun's path throughout the day
  - Hour markers at key positions (0h, 6h, 12h, 18h)

### Astronomical Model:

- Considers Earth's axial tilt (23.44°)
- Provides realistic sun positions for different latitudes
- Handles edge cases like polar days and polar nights
- Simulates twilight periods for smooth day-night transitions

## 📋 Technical Aspects


1. **Sun visualization** using Three.js Sky:
   - Moves across the sky based on astronomical calculations
   - Emits DirectionalLight that changes intensity with elevation
   - Controls environment lighting and shadow behavior
2. **Dynamic AmbientLight** that synchronously changes with sun position
3. **Automatic light activation** when the sun sets below the horizon

## 🎮 Controls

- **Orbit Controls** (when enabled in UI panel)
- **Time Controls**:
  - Enable/disable sun animation
  - Adjust time of day
  - Change animation speed
- **Location Settings**:
  - Set geographic latitude
  - Set day of year
- **Visibility Options**:
  - Toggle light helpers
  - Show/hide sun path visualization

## 🛠️ Technologies

- [Three.js](https://threejs.org/) - 3D WebGL library
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript
- [lil-gui](https://lil-gui.georgealways.com/) - UI controls library
- [Vite](https://vitejs.dev/) - Modern frontend build tool

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

## 🙏 Credits

**3D Models**:
  - "LP Americans House Mobile" by [spaceparmesan](https://sketchfab.com/spaceparmesan) licensed under [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/)
  - "Candle Lantern" by [Laetitia Irata](https://sketchfab.com/LaetitiaIrata) licensed under [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/)
  - "Stylized Street Light" by [Willowboxart](https://sketchfab.com/willowboxart) licensed under [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/)
