# BRAIN.md - Architectural & Memory Record for BlobDrop

## Architectural Philosophy
BlobDrop is a viral physics-based 4096 number-merge puzzle built with high performance, tactile squishy jelly physics, and zero external runtime dependencies. It adheres strictly to modern web standards, modular Vanilla ES2022 JavaScript, and native Vanilla CSS variables.

## Core Modules & Design
- **Responsive Screen Normalization & Fair Viewport (`src/game/layout.js`, `src/styles/canvas.css`)**:
  - Enforced 2:3 aspect ratio containment: Regardless of screen resolution or orientation, `.canvas-wrapper` locks to 2:3 proportions, eliminating unfair vertical stacking advantages on tall or high-PPI screens.
  - Uniform scale factor (`scale = width / 360`): All blob radii, danger limit (`14 * scale`), launch speed (`14 * scale`), and gravity (`0.40 * scale`) scale uniformly.
  - Danger limit on top rim: Pinned `.danger-line` to `top: 0` along the container ceiling with zero mid-playfield line obstruction.
  - Dynamic ball rescaling: Window resize or orientation change triggers `rescaleBalls()` without glitching or dropping balls out of bounds.
- **Physics Engine & Edge Containment (`src/game/physics.js`, `src/game/ball.js`, `src/game/ballMerge.js`)**:
  - Full perimeter edge containment: All blobs (moving, resting, or in merge wobble/suction) are strictly contained within `[radius, width - radius]` horizontally and `[radius, height - 20 - radius]` vertically.
  - Cross-blob physical collision during merges: Merging blobs remain solid entities colliding and bouncing naturally while preserving partner synchronization.
  - In-solver boundary containment clamp: Iterative relaxation solver prevents stacked piles or high-velocity collisions from displacing balls past screen boundaries.
  - Contained spawn coordinates: Upgraded blobs clamp to playfield boundaries using their upgraded scaled radius.
  - Continuous merge trajectory: Center of mass travels with shared momentum `((v1 + v2) / 2 * 0.85)` and gravity throughout wobble and suction phases.
  - Modular merge animation submodule: `src/game/ballMerge.js` handles wobble, cubic suction, and center-of-mass motion.
- **Progressive Spawner & Milestone Dares (`src/game/spawner.js`, `src/ui/uiManager.js`, `src/styles/modal.css`)**:
  - Sliding spawn floor: Dynamically phases out low-tier blobs (drops 2s after 512, drops 4s after 1024, drops 8s after 2048, drops 16s after 4096).
  - 4096 Victory Celebration & 8192 Dare: When players reach 4096, milestone modal announces the win and challenges the player: *"Are you brave enough to keep going to the next milestone: 8192?"*.
  - Tier 12 ("8192") blob: Added cosmic violet 8192 tier with mass 550 and 8192 points.
  - Standardized 300x100 ad placeholder container integrated on both milestone and game over overlays.
- **Progressive Web App (PWA) Support (`public/manifest.webmanifest`, `public/sw.js`, `public/icon.svg`)**:
  - Offline-first cache service worker for instant launches and offline play.
  - 512x512 glowing vector jelly squircle icon with maskable PWA badge support.
  - Native standalone display mode and theme-color styling.
- **Cannon Launcher, Ballistic Trajectory & Reload Animation (`src/game/trajectory.js`, `src/game/renderer.js`, `src/game/input.js`)**:
  - Center-top mounted cannon aiming from `(width / 2, 38 * scale)`.
  - Curved ballistic aim trajectory: 22-step forward simulation in `trajectory.js` integrating exact launch velocity (`14 * scale`), downward gravity (`0.40 * scale`), air drag (`0.985 / 0.99`), and wall bounce ricochets.
  - Elastic cannon reload entry animation: Blob slides smoothly down from off-screen above into shoot position over ~260ms.
  - Exponentially dampened harmonic bounce on arrival at the muzzle.
- **Sprite Texture Cache & Depth Rendering (`src/game/spriteCache.js`, `src/game/renderer.js`)**:
  - Pre-renders high-DPI offscreen canvas textures dynamically cached per tier and scaled radius.
  - Tier-based z-index draw sorting: Larger background blobs render first, smaller foreground blobs render last.
- **Fixed Timestep Loop (`src/main.js`)**:
  - Deterministic 60 FPS physics accumulator loop decoupled from display refresh rate.
  - Timing accumulator cleanly reset upon unpause/resume events.
- **Audio Synthesis (`src/audio/sound.js`)**:
  - Zero sound assets or external audio files. Web Audio API real-time synthesis.
- **State & Event Architecture (`src/core/eventBus.js`, `src/core/storage.js`)**:
  - Decoupled pub/sub event bus coordinating game states (`START`, `PLAYING`, `PAUSED`, `GAMEOVER`).

## Technical Decisions
- **No Tailwind / No React**: Pure Vanilla ES modules and modern semantic CSS variables to guarantee lightweight execution, fast loading, and zero runtime overhead.
- **Strict 200-Line Modular Limit**: Every code module is kept strictly below 180 lines through single-responsibility separation (`layout.js`, `ballMerge.js`, `modal.css`, `spriteCache.js`, etc.).
- **Vite Build System**: Pre-configured with ES2022 targets and automated console/debugger drop in production builds.
