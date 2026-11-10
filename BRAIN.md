# BRAIN.md - Architectural & Memory Record for BlobDrop

## Architectural Philosophy
BlobDrop is a viral physics-based 4096 number-merge puzzle built with high performance, tactile squishy jelly physics, and zero external runtime dependencies. It adheres strictly to modern web standards, modular Vanilla ES2022 JavaScript, and native Vanilla CSS variables.

## Core Modules & Design
- **Physics Engine & Edge Containment (`src/game/physics.js`, `src/game/ball.js`)**:
  - Full perimeter edge containment: All blobs (moving, resting, or in merge wobble/suction) are strictly contained within `[radius, width - radius]` horizontally and `[radius, height - 20 - radius]` vertically, eliminating wall clipping and floor dipping.
  - Cross-blob physical collision during merges: Merging blobs remain physically solid entities, allowing third-party falling or resting blobs to bounce off them naturally while keeping merge partners moving together in sync.
  - In-solver boundary containment clamp: Iterative relaxation solver prevents stacked piles or high-velocity collisions from displacing balls past screen boundaries or through the floor.
  - Contained spawn coordinates: Newly fused higher-tier blobs are clamped to playfield boundaries using their upgraded radius so they never spawn clipping into boundaries.
  - Continuous merge trajectory: Center of mass and both merging blobs continuously travel with shared momentum `((v1 + v2) / 2 * 0.85)` and gravity throughout wobble and suction phases, completely eliminating mid-air freezing.
  - Live momentum inheritance: Merged blobs spawn directly with active accumulated velocity and wall/floor collision responses.
  - Relative mass dynamics: Inverse-mass displacement partitioning and amplified restitution (0.38) when light blobs impact heavy masses.
  - Two-stage tactile merge animation: 8-frame elastic collision wobble/compression followed by 10-frame cubic suction into the moving fusion center.
  - Dual-pass merge detection: Pre-solver sweep catching incoming dynamic contacts, plus post-relaxation confirmation sweep ensuring touching resting blobs never stall.
  - Generous contact buffer (+1.8px) preventing floating point solver separation from freezing adjacent blobs.
  - Iterative relaxation solver (4 sub-steps) providing rock-solid, jitter-free stacking stability for heavy piles.
  - Dynamic wall restitution: High bounce factor (0.88 for fast bank shots with `|vx| > 1.2`) settling to 0.40 and deadband for resting blobs.
  - High-performance broadphase: Fast AABB coordinate rejection and squared-distance checks avoiding unnecessary square root operations, maintaining locked 60+ FPS.
- **Progressive Spawner & Milestones (`src/game/spawner.js`, `src/ui/uiManager.js`)**:
  - Sliding spawn floor: Dynamically phases out low-tier blobs (drops 2s after 512, drops 4s after 1024, drops 8s after 2048) to keep endgame boards playable.
  - Milestone unlock overlays: Celebrated pause events for 1024, 2048, and 4096.
  - Standardized 300x100 ad placeholder container integrated on both milestone and game over overlays.
- **Cannon Launcher, Reload Animation & Trajectory (`src/game/trajectory.js`, `src/game/renderer.js`, `src/game/input.js`)**:
  - Center-top mounted cannon aiming from `(width / 2, 38)`.
  - Elastic cannon reload entry animation: Blob slides smoothly down from off-screen above into shoot position over ~260ms upon firing or starting game.
  - Jelly touchdown wobble: Exponentially dampened harmonic bounce on arrival at the muzzle.
  - Focused single aim trajectory ray with linear opacity fade-off towards screen center and edge boundaries.
  - Directional impulse launch with initial velocity (`speed: 14`).
- **Sprite Texture Cache & Depth Rendering (`src/game/spriteCache.js`, `src/game/renderer.js`)**:
  - Pre-renders high-DPI offscreen canvas textures once per tier (radial body, soft aura glow, gloss highlight, tier typography).
  - Tier-based z-index draw sorting: Larger background blobs render first, smaller foreground blobs render last to prevent visual obscuration.
  - Single hardware-accelerated `ctx.drawImage` blit per ball per frame (< 1ms frame rendering).
- **Fixed Timestep Loop (`src/main.js`)**:
  - Deterministic 60 FPS physics accumulator loop decoupled from display refresh rate.
  - Timing accumulator cleanly reset upon unpause/resume events.
- **Audio Synthesis (`src/audio/sound.js`)**:
  - Zero sound assets or external audio files.
  - Web Audio API real-time synthesis: sine waveforms for drops, pitch-ramped triangle waves for merges, and sawtooth drops for gameover alerts.
- **State & Event Architecture (`src/core/eventBus.js`, `src/core/storage.js`)**:
  - Decoupled pub/sub event bus coordinating game states (`START`, `PLAYING`, `PAUSED`, `GAMEOVER`), combo multipliers, and score updates.
  - Safe-wrapped `localStorage` persistence with persistent storage request (`navigator.storage?.persist()`).

## Technical Decisions
- **No Tailwind / No React**: Pure Vanilla ES modules and modern semantic CSS variables to guarantee lightweight execution, fast loading, and zero runtime overhead.
- **Strict 200-Line Modular Limit**: Every code module is kept below 180 lines through single-responsibility separation (`input.js`, `renderer.js`, `engine.js`, `trajectory.js`, `spriteCache.js`, `spawner.js`).
- **Vite Build System**: Pre-configured with ES2022 targets and automated console/debugger drop in production builds.
