# Changelog

All notable changes to this project will be documented in this file.

## [1.6.1] - 2026-11-11
### Fixed
- Cloudflare Pages EBADPLATFORM build error: Removed accidental top-level `@rollup/rollup-linux-arm64-gnu` dependency from `package.json` and regenerated clean cross-platform `package-lock.json`, restoring compatibility with Cloudflare's Linux x64 CI/CD environment.

## [1.6.0] - 2026-11-11
### Added
- Browser state persistence: Serializes live board blobs, score, combos, and upcoming tiers to `localStorage` across drops, merges, and tab switches, seamlessly restoring games on page refresh.
- Top-bar Pause/Resume toggle button: Added interactive `#pauseBtn` in `.status-actions` right next to the Sound button, freezing the game loop and physics cleanly.
- Celebratory milestone fanfare: Synthesized a bright 4-note ascending Web Audio fanfare (C5-E5-G5-C6 harmonic chime with sparkle shimmer) triggered when milestone and win modals open.
- Dedicated `stateStorage.js` submodule to handle state serialization while keeping `engine.js` under 180 lines.

## [1.5.5] - 2026-11-11
### Added
- Standard PWA raster PNG icons: Generated 192x192 and 512x512 maskable PNG icons along with 180x180 `apple-touch-icon.png` from `icon.svg` to satisfy Chromium mobile installability criteria.
- In-app install button & prompt handler: `src/ui/pwaPrompt.js` captures `beforeinstallprompt`, prevents default mini-infobar suppression, and presents an interactive "📲 Install" status pill that triggers native installation.
- Safari iOS Web App compatibility: Linked dedicated 180x180 PNG apple-touch-icon ensuring clear home screen rendering.
- Cache manifest update: Bumped service worker cache to `blobdrop-v1.5.4` caching all raster icons for offline resilience.
