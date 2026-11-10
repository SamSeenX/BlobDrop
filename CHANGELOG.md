# Changelog

All notable changes to this project will be documented in this file.

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
