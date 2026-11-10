# BRAIN.md - Architectural & Memory Record for BlobDrop

## Architectural Philosophy
BlobDrop is a viral physics-based 4096 number-merge puzzle built with high performance, tactile squishy jelly physics, and zero external runtime dependencies. It adheres strictly to modern web standards, modular Vanilla ES2022 JavaScript, and native Vanilla CSS variables.

## Core Modules & Design
- **Physics Engine & Momentum Transfer (`src/game/physics.js`, `src/game/ball.js`)**:
  - Inelastic momentum inheritance: merged blobs inherit `((v1 + v2) / 2 * 0.82)` velocity, carrying active impact without freezing.
  - Relative mass dynamics: inverse-mass displacement partitioning and amplified restitution (0.38) when light blobs impact heavy masses.
  - Two-stage tactile merge animation: 8-frame elastic collision wobble/compression followed by 10-frame cubic suction into the fusion center.
  - Dual-pass merge detection: pre-solver sweep catching incoming dynamic contacts, plus post-relaxation confirmation sweep ensuring touching resting blobs never stall.
  - Generous contact buffer (+1.8px) preventing floating point solver separation from freezing adjacent blobs.
  - Iterative relaxation solver (4 sub-steps) providing rock-solid, jitter-free stacking stability for heavy piles.
  - Tangential friction impulse and resting restitution thresholds (inelastic contact under 0.6 relative velocity).
  - Dynamic wall restitution: high bounce factor (0.88 for fast bank shots with `|vx| > 1.2`) settling to 0.40 and deadband for resting blobs.
  - High-performance broadphase: fast AABB coordinate rejection and squared-distance checks avoiding unnecessary square root operations.
  - Velocity deadband and rigidity damping over time so resting blobs settle firmly.
- **Sprite Texture Cache & Depth Rendering (`src/game/spriteCache.js`, `src/game/renderer.js`)**:
  - Pre-renders high-DPI offscreen canvas textures once per tier (radial body, soft aura glow, gloss highlight, tier typography).
  - Tier-based z-index draw sorting: larger background blobs render first, smaller foreground blobs render last to prevent visual obscuration.
  - Single hardware-accelerated `ctx.drawImage` blit per ball per frame (< 1ms frame rendering).
- **Fixed Timestep Loop (`src/main.js`)**:
  - Deterministic 60 FPS physics accumulator loop decouple from display refresh rate.
  - Zero lag or jitter on 60Hz, 120Hz ProMotion, or low-power mobile displays.
- **Cannon Launcher & Trajectory (`src/game/trajectory.js`, `src/game/input.js`)**:
  - Center-top mounted cannon aiming from `(width / 2, 38)`.
  - Focused single aim trajectory ray with linear opacity fade-off towards screen center and edge boundaries.
  - Directional impulse launch with initial velocity (`speed: 14`).
- **Audio Synthesis (`src/audio/sound.js`)**:
  - Zero sound assets or external audio files.
  - Web Audio API real-time synthesis: sine waveforms for drops, pitch-ramped triangle waves for merges, and sawtooth drops for gameover alerts.
- **State & Event Architecture (`src/core/eventBus.js`, `src/core/storage.js`)**:
  - Decoupled pub/sub event bus coordinating game states (`START`, `PLAYING`, `GAMEOVER`), combo multipliers, and score updates.
  - Safe-wrapped `localStorage` persistence with persistent storage request (`navigator.storage?.persist()`).

## Technical Decisions
- **No Tailwind / No React**: Pure Vanilla ES modules and modern semantic CSS variables to guarantee lightweight execution, fast loading, and zero runtime overhead.
- **Strict 200-Line Modular Limit**: Every code module is kept below 180 lines through single-responsibility separation (`input.js`, `renderer.js`, `engine.js`, `trajectory.js`, `spriteCache.js`).
- **Vite Build System**: Pre-configured with ES2022 targets and automated console/debugger drop in production builds.
