# BRAIN.md - Architectural & Memory Record for BlobDrop

## Architectural Philosophy
BlobDrop is a viral physics-based 4096 number-merge puzzle built with high performance, tactile squishy jelly physics, and zero external runtime dependencies. It adheres strictly to modern web standards, modular Vanilla ES2022 JavaScript, and native Vanilla CSS variables.

## Core Modules & Design
- **Cannon Launcher & Trajectory (`src/game/trajectory.js`, `src/game/input.js`)**:
  - Center-top mounted cannon aiming from `(width / 2, 38)`.
  - Focused single aim trajectory ray with linear opacity fade-off towards screen center and edge boundaries.
  - Directional impulse launch with initial velocity (`speed: 14`).
- **Physics Engine (`src/game/physics.js`, `src/game/ball.js`)**:
  - Two-stage tactile merge animation: 8-frame elastic collision wobble/compression followed by 10-frame cubic suction into the fusion center.
  - Dual-pass merge detection: pre-solver sweep catching incoming dynamic contacts, plus post-relaxation confirmation sweep ensuring touching resting blobs never stall.
  - Generous contact buffer (+1.8px) preventing floating point solver separation from freezing adjacent blobs.
  - Iterative relaxation solver (4 sub-steps) providing rock-solid, jitter-free stacking stability for heavy piles.
  - Tangential friction impulse and resting restitution thresholds (inelastic contact under 0.6 relative velocity).
  - Dynamic wall restitution: high bounce factor (0.88 for fast bank shots with `|vx| > 1.2`) settling to 0.40 and deadband for resting blobs.
  - High-performance broadphase: fast AABB coordinate rejection and squared-distance checks avoiding unnecessary square root operations.
  - Velocity deadband and rigidity damping over time so resting blobs settle firmly.
- **Audio Synthesis (`src/audio/sound.js`)**:
  - Zero sound assets or external audio files.
  - Web Audio API real-time synthesis: sine waveforms for drops, pitch-ramped triangle waves for merges, and sawtooth drops for gameover alerts.
- **State & Event Architecture (`src/core/eventBus.js`, `src/core/storage.js`)**:
  - Decoupled pub/sub event bus coordinating game states (`START`, `PLAYING`, `GAMEOVER`), combo multipliers, and score updates.
  - Safe-wrapped `localStorage` persistence with persistent storage request (`navigator.storage?.persist()`).
- **UI & Presentation (`src/ui/uiManager.js`, `src/game/renderer.js`, `src/styles/`)**:
  - Top-left status bar `Next:` badge continuously displays the true upcoming ball before launch.
  - Clean cannon muzzle rendering active ball without obstructing badges.
  - Mobile touch-ergonomic targets (>= 48px).

## Technical Decisions
- **No Tailwind / No React**: Pure Vanilla ES modules and modern semantic CSS variables to guarantee lightweight execution, fast loading, and zero runtime overhead.
- **Strict 200-Line Modular Limit**: Every code module is kept below 180 lines through single-responsibility separation (`input.js`, `renderer.js`, `engine.js`, `trajectory.js`).
- **Vite Build System**: Pre-configured with ES2022 targets and automated console/debugger drop in production builds.
