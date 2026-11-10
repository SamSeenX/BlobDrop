# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-11-10
### Added
- Milestone modal overlay for 1024, 2048, and 4096 unlock events displaying current achievement and next target.
- Game loop pause mechanics: physics and inputs freeze in `PAUSED` state while milestone modal is displayed, with timing accumulator reset upon resume.
- Standardized ad placeholder slots (300x100) incorporated in both Milestone celebration and Game Over loss overlays.
- Progressive spawner sliding floor in `spawner.js`: dynamically phases out 2s after 512, 4s after 1024, and 8s after 2048 to prevent endgame board clutter.

## [1.3.5] - 2026-11-10
### Added
- Inherited merge momentum: Newly created upgraded blobs now carry 82% of combined incoming velocity `((v1 + v2) / 2 * 0.82)` instead of stalling to zero.
- Mass-disparity impact restitution: Enhanced deflection coefficient (0.38) when light blobs hit heavy dense masses, making size differences physically tactile.

## [1.3.4] - 2026-11-10
### Added
- Tier-based z-index draw sorting in `renderer.js`: larger blobs render first to background, ensuring smaller blobs always appear visible in the foreground upon overlap.

## [1.3.3] - 2026-11-10
### Added
- Pre-cached offscreen sprite textures in `spriteCache.js` for all 12 tiers, eliminating expensive runtime `shadowBlur` and per-frame `createRadialGradient` allocations.
- Fixed 60 FPS timestep accumulator loop in `main.js` preventing frame drops and timing jitter across variable refresh rate displays.
- Full physical backing buffer clear in `renderer.js` to eliminate fractional pixel clipping artifacts on high-DPI Retina screens.

## [1.3.2] - 2026-11-10
### Added
- Pre-merge impact wobble phase: 8-frame elastic compression and squish animation before suction fusion.
- Dual-pass merge detection: pre-solver contact pass and post-relaxation confirmation pass.
- Contact distance tolerance buffer (+1.8px) preventing floating point solver stalls on settled touching blobs.

## [1.3.1] - 2026-11-10
### Fixed
- Corrected top-left status bar `Next:` badge to show the upcoming ball before launch.
- Removed duplicate queue badge from the canvas muzzle to keep the active ball unobstructed.
- Replaced multi-bounce trajectory line with a single clean laser ray that smoothly fades off toward the side edge or screen center.
- Increased side wall bank shot bounce restitution factor to 0.88 for punchier ricochets.

## [1.3.0] - 2026-11-10
### Added
- Center-top cannon aiming system replacing top-drop spawner.
- Multi-bounce laser trajectory guide with wall reflection physics in dedicated `trajectory.js`.
- Responsive wall ricochet mechanics with tuned restitution (0.75 for fast bank shots).
- In-flight queue preview displaying the upcoming next ball directly above the cannon muzzle during aim hold.
- Spawn grace period (45 frames) to prevent false game-over triggers during launch exit.

## [1.2.0] - 2026-11-10
### Added
- Multi-pass (4x) iterative relaxation solver in `physics.js` eliminating pyramid stacking jitter.
- Tangential contact friction damping to stop infinite rolling oscillations.
- Separation of normal velocity restitution with soft deadband (0 bounce when resting).
- AABB bounding box and squared-distance broadphase early rejection avoiding costly `Math.sqrt` calculations.
- Velocity deadband and sleep thresholds on settling blobs in `ball.js`.

## [1.1.0] - 2026-11-10
### Added
- Ease-in suction merge animation (~200ms cubic curve) creating visual chain reaction anticipation.
- Expanding circular `Shockwave` ripple effect upon merge completion.
- Spawn pop elastic squash-and-stretch on newly created blobs.
- Danger line bypass for actively merging blobs.

## [1.0.0] - 2026-11-10
### Added
- Modular Vite project setup targeting ES2022 with production minification.
- Full conversion from monolithic HTML to standard ES6+ modules and semantic Vanilla CSS.
- Centralized CSS tokens system (`tokens.css`, `base.css`, `header.css`, `status.css`, `canvas.css`, `overlay.css`).
- Decoupled `EventBus` pub/sub communication and safe persistent storage wrapper (`storage.js`).
- Web Audio API synthesizer for drop, merge, and game-over sounds.
- Squishy blob physics engine with collision solver, rigidity scaling, and burst particle effects.
- Input handler supporting touch and pointer ergonomics (>= 48px targets).
- Standard project documentation (`BRAIN.md`, `README.md`, `CHANGELOG.md`, `RULES.md`, `SCOPE.md`).
