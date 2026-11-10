# SCOPE.md - BlobDrop Project Scope

## In-Scope Features (Current)
- [x] Vite dev and build workflow.
- [x] Modular Vanilla JS architecture (< 200 lines per file).
- [x] Milestone overlay modals for 1024, 2048, and 4096 with game pause.
- [x] Standardized ad container slots (300x100) on milestone and game over screens.
- [x] Progressive sliding spawner phasing out low-tier blobs as higher tiers unlock.
- [x] Center-top cannon aiming system with fade-off laser trajectory.
- [x] Wall bounce ricochet dynamics with energetic restitution (0.88).
- [x] Hardware-accelerated offscreen sprite texture cache for guaranteed 60+ FPS.
- [x] Inelastic momentum inheritance and relative-mass collision deflection.
- [x] 12 blob tiers (2 to 4096) with dynamic mass, radii, and color gradients.
- [x] Dynamic audio synthesizer using Web Audio API.
- [x] Chain combo score multiplier and high score tracking in `localStorage`.
- [x] Safe-area inset handling and mobile touch ergonomics.
- [x] Global error boundaries and persistent storage request.

## Backlog / Future Enhancements
- [ ] Haptic feedback support using `navigator.vibrate`.
- [ ] 1-Click JSON high-score backup and restore modal.
- [ ] Additional particle shockwave animations for 2048+ merges.
- [ ] Custom themes (neon, pastel, synthwave).

## Out-of-Scope Boundaries
- Backend authentication or external multiplayer servers.
- Heavy runtime framework dependencies (React, Vue, Tailwind, Phaser).
