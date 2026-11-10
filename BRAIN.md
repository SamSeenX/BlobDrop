# BRAIN.md - Architectural & Memory Record for BlobDrop

## Architectural Philosophy
BlobDrop is a viral physics-based 4096 number-merge puzzle built with high performance, tactile squishy jelly physics, and zero external runtime dependencies. It adheres strictly to modern web standards, modular Vanilla ES2022 JavaScript, and native Vanilla CSS variables.

## Core Modules & Design
- **Physics Engine (`src/game/physics.js`, `src/game/ball.js`)**:
  - Custom rigid-body dynamics with impulse-based collision resolution.
  - Smooth rigidity transition from squishy jello (dynamic `scaleX` and `scaleY`) to solid mass over time.
  - Pairwise collision detection with mass-proportional impulse and merge coalescence into higher-tier blobs.
  - Ease-in cubic suction merge animation with ~200ms fuse duration, allowing chain-reaction visual readability before popping the merged blob with a radial `Shockwave` and spawn squish.
- **Audio Synthesis (`src/audio/sound.js`)**:
  - Zero sound assets or external audio files.
  - Web Audio API real-time synthesis: sine waveforms for drops, pitch-ramped triangle waves for merges, and sawtooth drops for gameover alerts.
- **State & Event Architecture (`src/core/eventBus.js`, `src/core/storage.js`)**:
  - Decoupled pub/sub event bus coordinating game states (`START`, `PLAYING`, `GAMEOVER`), combo multipliers, and score updates.
  - Safe-wrapped `localStorage` persistence with persistent storage request (`navigator.storage?.persist()`).
- **UI & Presentation (`src/ui/uiManager.js`, `src/styles/`)**:
  - Design token system (`tokens.css`) specifying colors, safe area insets, and typography.
  - Dedicated sub-styles (`header.css`, `status.css`, `canvas.css`, `overlay.css`, `base.css`).
  - Mobile touch-ergonomic targets (>= 48px).

## Technical Decisions
- **No Tailwind / No React**: Pure Vanilla ES modules and modern semantic CSS variables to guarantee lightweight execution, fast loading, and zero runtime overhead.
- **Strict 200-Line Modular Limit**: Every code module is kept below 180 lines through single-responsibility separation (`input.js`, `renderer.js`, `engine.js`).
- **Vite Build System**: Pre-configured with ES2022 targets and automated console/debugger drop in production builds.
