# Changelog

All notable changes to this project will be documented in this file.

## [1.8.0] - 2026-11-12
### Added
- Native Android launcher adaptive icons: Exported pixel-perfect launcher PNGs across all density buckets (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) from the 512x512 master icon with a custom `#020617` background color and 72% safe-zone foreground padding matching system adaptive squircle and circle shapes.
- Dual-tier haptic feedback system: Created `src/audio/haptics.js` using `@capacitor/haptics` on Android with automatic fallback to web `navigator.vibrate`, bringing crisp physical vibrations to blob drops, merges, milestone celebrations, and game over sequences.
- Android vibration permissions: Added `android.permission.VIBRATE` to `AndroidManifest.xml` and synced `@capacitor/haptics` plugin into native Gradle workspace.

## [1.7.0] - 2026-11-12
### Added
- Unified Capacitor Android project: Integrated `@capacitor/core`, `@capacitor/android`, and `@capacitor-community/admob` into the root repository, allowing single-command synchronization from web build into native Android.
- Smart dual-mode ad system: On native Android, AdMob initializes with banner and interstitial ads on milestones/game over; on Web/PWA, an automated House Ad Rotator promotes SamSeen's EloRun game with direct Play Store click-throughs.
- Local Android build pipeline: Configured Gradle with memory caps and SDK 36 compliance, compiling both debug APK (`app-debug.apk`, 8.8MB) and release App Bundle (`app-release.aab`, 6.8MB) locally.
- Modular ad architecture: Split into `houseAds.js`, `admobService.js`, and `adManager.js` with all source files strictly under 180 lines.

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
