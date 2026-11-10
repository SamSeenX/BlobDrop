# BRAIN.md - Architectural & Memory Record for BlobDrop

## Architectural Philosophy
BlobDrop is a viral physics-based 4096 number-merge puzzle built with high performance, tactile squishy jelly physics, and zero external runtime dependencies. It adheres strictly to modern web standards, modular Vanilla ES2022 JavaScript, and native Vanilla CSS variables.

## Core Modules & Design
- **Cannon Launcher & Trajectory (`src/game/trajectory.js`, `src/game/input.js`)**:
  - Center-top mounted cannon aiming from `(width / 2, 38)`.
  - Multi-bounce downward raycasting calculating left and right wall collision points and reflection vectors.
  - Directional impulse launch with initial velocity (`speed: 13`).
- **Physics Engine (`src/game/physics.js`, `src/game/ball.js`)**:
  - Iterative relaxation solver (4 sub-steps) providing rock-solid, jitter-free stacking stability for heavy piles.
  - Tangential friction impulse and resting restitution thresholds (inelastic contact under 0.6 relative velocity).
  - Dynamic wall restitution: 0.75 for fast bank shots (`|vx| > 1.5`) dropping to 0.35 and deadband for settled blobs.
  - High-performance broadphase: fast AABB coordinate rejection and squared-distance checks avoiding unnecessary square root operations.
  - Velocity deadband and rigidity damping over time so resting blobs settle firmly.
  - Ease-in cubic suction merge animation with ~200ms fuse duration, radial `Shockwave`, and spawn squash-and-stretch.
- **Audio Synthesis (`src/audio/sound.js`)**:
  - Zero sound assets or external audio files.
  - Web Audio API real-time synthesis: sine waveforms for drops, pitch-ramped triangle waves for merges, and sawtooth drops for gameover alerts.
- **State & Event Architecture (`src/core/eventBus.js`, `src/core/storage.js`)**:
  - Decoupled pub/sub event bus coordinating game states (`START`, `PLAYING`, `GAMEOVER`), combo multipliers, and score updates.
  - Safe-wrapped `localStorage` persistence with persistent storage request (`navigator.storage?.persist()`).
- **UI & Presentation (`src/ui/uiManager.js`, `src/game/renderer.js`, `src/styles/`)**:
  - Design token system (`tokens.css`) specifying colors, safe area insets, and typography.
  - Trajectory laser rendering with bounce ripple rings and landing reticle.
  - In-flight queue preview displaying the upcoming ball right above the cannon muzzle during aim hold.
  - Dedicated sub-styles (`header.css`, `status.css`, `canvas.css`, `overlay.css`, `base.css`).
  - Mobile touch-ergonomic targets (>= 48px).

## Technical Decisions
- **No Tailwind / No React**: Pure Vanilla ES modules and modern semantic CSS variables to guarantee lightweight execution, fast loading, and zero runtime overhead.
- **Strict 200-Line Modular Limit**: Every code module is kept below 180 lines through single-responsibility separation (`input.js`, `renderer.js`, `engine.js`, `trajectory.js`).
- **Vite Build System**: Pre-configured with ES2022 targets and automated console/debugger drop in production builds.
