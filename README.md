# 🌌 Cosmic Evolution Simulator

An interactive educational visualizer that brings the story of our universe to life — from cosmic origins to the formation of our Solar System. Explore planets with real NASA scientific data in a stunning 3D environment.


## ✨ Features

- **Interactive 3D Solar System**: Click on any planet to view detailed scientific information
- **Real NASA Data**: Accurate planetary data including mass, radius, temperature, composition, and more
- **Smooth Animations**: Watch planets orbit the Sun with realistic motion
- **Adjustable Controls**: Play, pause, reset, and adjust orbital speed
- **Beautiful Cosmic Design**: Deep space aesthetics with glowing effects and glass-morphism UI
- **Responsive**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd cosmic-evolution-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 🎮 How to Use

1. **Explore**: The app automatically loads with the Solar System in view
2. **Interact**: 
   - Hover over planets to see their names
   - Click on any planet to open detailed information panel
   - Use the control panel at the bottom to:
     - Play/Pause orbital motion
     - Reset the view
     - Adjust orbital speed (0.1x to 3x)
3. **Learn**: Read scientific data about each planet including composition, atmosphere, moons, and fascinating facts

## 📊 Data Sources

All planetary data is sourced from:
- [NASA Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/)
- ESA Space Science Database

## 🏗️ Project Architecture

```
src/
├── components/
│   ├── CosmicCanvas.tsx      # Main 3D Three.js scene
│   ├── PlanetInfoPanel.tsx   # Modal displaying planet data
│   ├── ControlPanel.tsx      # Playback controls
│   └── ui/                   # Reusable UI components
├── pages/
│   └── Index.tsx             # Main app page
├── index.css                 # Design system & cosmic theme
└── main.tsx                  # App entry point

public/
└── data/
    └── planets.json          # Planetary scientific data
```

## 🛠️ Technologies

- **Three.js** (v0.160.0) - 3D rendering and visualization
- **GSAP** (v3.12.5) - Smooth animations
- **React** (v18.3.1) - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom cosmic design system
- **Vite** - Fast development and building

## 🎨 Design System

The app uses a carefully crafted cosmic design system:

- **Colors**: Deep space blacks, cosmic purples/blues, star golds, nebula pinks
- **Effects**: Glow effects, glass-morphism panels, smooth transitions
- **Animations**: Orbital rotations, pulse glows, floating elements
- **All design tokens are defined in `src/index.css` and `tailwind.config.ts`**

## 📝 Modifying Planet Data

Planet data is stored in `public/data/planets.json`. You can:

1. Edit existing planet information
2. Add new data fields
3. Update composition percentages
4. Modify orbital parameters

Example planet structure:
```json
{
  "id": "earth",
  "name": "Earth",
  "mass_kg": 5.97237e24,
  "radius_km": 6371,
  "distance_au": 1.0,
  "mean_temp_c": 15,
  "composition": { "Fe": 32, "O": 30, "Si": 15, "Mg": 14 },
  "atmosphere": "N2 (78%), O2 (21%)",
  "moons": 1,
  "info": "Earth is the only known planet to harbor life."
}
```

## 🔧 Configuration

### Scaling Factors

Visual scaling can be adjusted in `src/components/CosmicCanvas.tsx`:

```typescript
const planetData = [
  { id: 'earth', size: 2.3, distance: 45, speed: 0.025 },
  // size: visual radius
  // distance: orbital radius from sun
  // speed: orbital velocity multiplier
];
```

### Performance

For better performance on lower-end devices:
- Reduce star count in `createStarField()` function
- Lower planet geometry detail (reduce segments)
- Adjust renderer pixel ratio


## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

WebGL support required.

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more celestial bodies
- Implement animation phases (Big Bang, Nebula, etc.)
- Add sound effects
- Improve mobile experience
- Extend with asteroid belt, Kuiper belt

## 🙏 Acknowledgments

- NASA for planetary data
- ESA for space science information
- Three.js community for excellent 3D libraries

## 🔗 Useful Links

- [Three.js Documentation](https://threejs.org/docs/)
- [NASA Planetary Data](https://nssdc.gsfc.nasa.gov/planetary/)
- [Lovable Documentation](https://docs.lovable.dev/)
