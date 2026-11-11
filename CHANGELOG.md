# Changelog

All notable changes to this project will be documented in this file.

## [1.5.5] - 2026-11-11
### Added
- Standard PWA raster PNG icons: Generated 192x192 and 512x512 maskable PNG icons along with 180x180 `apple-touch-icon.png` from `icon.svg` to satisfy Chromium mobile installability criteria.
- In-app install button & prompt handler: `src/ui/pwaPrompt.js` captures `beforeinstallprompt`, prevents default mini-infobar suppression, and presents an interactive "📲 Install" status pill that triggers native installation.
- Safari iOS Web App compatibility: Linked dedicated 180x180 PNG apple-touch-icon ensuring clear home screen rendering.
- Cache manifest update: Bumped service worker cache to `blobdrop-v1.5.4` caching all raster icons for offline resilience.

## [1.5.4] - 2026-11-10
### Fixed
- Overflow grace countdown & cannon blockage detection: Replaced brittle velocity stillness check with a sustained 55-frame danger timer and direct muzzle obstruction detection, preventing drops when the top cannon is buried.
- Top-rim pulsing warning: The top dashed line pulses with `.danger-active` whenever stacked balls reach the danger zone, providing clear visual feedback before game over.
- Refined endgame radii: Tapered upper tiers (1024: 76px, 2048: 87px, 4096: 98px, 8192: 110px) giving ample room to maneuver without blobs clipping the top ceiling.

## [1.5.3] - 2026-11-10
### Changed
- Rebalanced endgame blob progression: Scaled tier radii down across upper tiers (1024: 78px, 2048: 90px, 4096: 102px, 8192: 115px) so two 1024s or 2048s can sit side-by-side on the bottom of the 360px playfield without forcing premature vertical overflow.
- Development service worker purge: Automatically unregister service workers and purge caches in dev mode (`import.meta.env.DEV`), ensuring instant HMR and fresh asset delivery.

## [1.5.2] - 2026-11-10
### Fixed
- Top-edge danger threshold alignment: Pinned `.danger-line` to `top: 0` along the container's top rim and eliminated the floating mid-canvas dashed line that appeared below the aiming blob.
- Overflow detection at top ceiling: Calibrated `dangerY` to the top rim threshold (`14 * scale`) so game over triggers only when stacked blobs genuinely breach the top boundary.

## [1.5.1] - 2026-11-10
### Added
- Curved ballistic aim trajectory: `trajectory.js` forward-simulates 22 physical steps integrating gravity (`0.40 * scale`), air drag, and wall ricochet deflections.
- Multi-segment trajectory rendering: `renderer.js` paints a smooth gravity curve with gradient fade-out and landing dot indicator, eliminating aim discrepancy on angled bank shots.
