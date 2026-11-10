# Changelog

All notable changes to this project will be documented in this file.

## [1.5.1] - 2026-11-10
### Added
- Curved ballistic aim trajectory: `trajectory.js` forward-simulates 22 physical steps integrating gravity (`0.40 * scale`), air drag, and wall ricochet deflections.
- Multi-segment trajectory rendering: `renderer.js` paints a smooth gravity curve with gradient fade-out and landing dot indicator, eliminating aim discrepancy on angled bank shots.

## [1.5.0] - 2026-11-10
### Added
- Responsive screen normalization: Standardized 2:3 aspect ratio viewport layout (`layout.js`) scaling blob radii, danger limit, launch speeds, and physics uniformly across all mobile, tablet, and desktop display sizes.
- Competitive parity across devices: Smaller, shorter, or low-PPI screens now maintain the exact same relative playfield volume and stacking capacity as larger displays.
- Win 4096 celebration modal & 8192 Dare: Unlocking the 4096 milestone triggers a victory announcement with an interactive dare: *"Are you brave enough to keep going to the next milestone: 8192?"*.
- Tier 12 ("8192") blob: Added cosmic violet 8192 blob with 138 base radius and 8192 points, allowing players who accept the 4096 dare to keep merging towards the ultimate high score.
- Full PWA support: Added `public/manifest.webmanifest`, offline-capable Service Worker (`public/sw.js`), and high-resolution glowing vector app icon (`public/icon.svg`).
- Proactive file splitting: Extracted `ballMerge.js`, `layout.js`, and `modal.css` maintaining all code files strictly under 180 lines.

## [1.4.3] - 2026-11-10
### Added
- Elastic cannon reload entry animation: Active blob slides smoothly down from above screen boundaries into the cannon shoot position over ~260ms upon firing or starting game.
- Jelly touchdown wobble: Blob compresses on arrival with an exponential dampening harmonic wobble before firmly settling at the muzzle.

## [1.4.2] - 2026-11-10
### Fixed
- Perimeter edge containment during merges: Both merging blobs and their moving center of mass are clamped to screen boundaries and floor, completely eliminating side wall and bottom floor penetration during wobble and suction phases.
- Cross-blob physical collisions during merges: Merging blobs remain physically solid and collide with third-party falling or resting blobs, naturally bouncing and transferring momentum while keeping merge partners synchronized.
- In-solver boundary containment clamp: Iterative relaxation solver prevents stacked or compressed balls from being pushed past side walls, bottom floor, or ceiling.
- Contained spawn coordinates: Newly fused higher-tier blobs are clamped to playfield boundaries using their upgraded radius so they never spawn clipping into boundaries.

## [1.4.1] - 2026-11-10
### Fixed
- Continuous merge velocity integration: Center of mass and both merging blobs now continuously travel with shared momentum and gravity during wobble and suction phases, eliminating the mid-air freeze upon collision.
- Live velocity inheritance: Merged blob spawns directly with active accumulated velocity and boundary collision response.

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
