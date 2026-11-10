# SCOPE.md - BlobDrop Project Scope

## In-Scope Features (Current)
- [x] Vite dev and build workflow.
- [x] Modular Vanilla JS architecture (< 200 lines per file).
- [x] Center-top cannon aiming system with multi-bounce trajectory line.
- [x] Wall bounce ricochet dynamics with energetic restitution.
- [x] In-flight next-ball queue preview badge during active aim hold.
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
