# Changelog

All notable changes to this project will be documented in this file.

## [1.18.1] - 2026-11-23
### Changed
- Service Worker Cache Version Bump: Bumped `CACHE_NAME` in `public/sw.js` to `blobdrop-v1.18.0` to trigger immediate background cache invalidation and prefetch the new pastel anime PWA icons and web manifest across all user devices.
- Returning Player Theme Migration: Streamlined `storage.getTheme()` so legacy `'default'` sessions automatically upgrade to the new cozy pastel anime theme, preserving `'dark'` strictly for players who deliberately selected it.

## [1.18.0] - 2026-11-23
### Changed
- Cozy Pastel Anime App Icons: Redesigned `public/icon.svg`, `public/icon-512.png`, `public/icon-192.png`, and `public/apple-touch-icon.png` to feature a strawberry cream squircle, cute pastel ambient sparkles, a hero anime chibi 4096 blob with cel shadows and blush cheeks, and a white card bottom pill.
- Native Android Adaptive Launcher Suite: Re-rendered all Android launcher density assets (mdpi through xxxhdpi) including `ic_launcher.png`, `ic_launcher_round.png`, and safe-zone centered `ic_launcher_foreground.png` with `@color/ic_launcher_background` updated to `#fff0f3`.
- Web App Manifest Sync: Updated `background_color` and `theme_color` in `public/manifest.webmanifest` to `#fff0f3` for seamless PWA loading.

## [1.17.0] - 2026-11-23
### Changed
- Cozy Pastel Anime as Primary Default Theme: Configured `storage.getTheme()` and `index.html` to load the cozy pastel anime theme by default on startup, with the header toggle icon displaying `🌙` to easily switch to midnight dark.
- High-Flair Cyberpunk Neon Dark Theme: Rebuilt the dark mode in `src/styles/themeDark.css` featuring deep space dual-vignette backgrounds, luminous cyan playfield border glows with inner crimson warmth, frosted cyber glass scoreboards with neon drop shadows, and electric laser danger lines.
- Enhanced Cyber Neon Ball Sprites: Upgraded `src/game/spriteCache.js` for dark theme to render 3D spherical neon orbs with laser rim rings, intense outer aura halos, dual specular gleams, and white numbers framed by deep dark contour strokes.
- Modular Theme Stylesheet Split: Proactively partitioned theme styles into `src/styles/themePastel.css` and `src/styles/themeDark.css` united under `src/styles/themes.css` to respect the 180-line modular rule.

## [1.16.1] - 2026-11-23
### Changed
- Streamlined Game Header: Removed redundant "Balanced Jelly Physics" subtitle text from `index.html` and stylesheets, letting the main title breathe and cleanly aligning with scoreboard cards.
- High-Contrast Score Readability: Replaced washed-out yellow score text with vivid high-contrast tones (deep crimson rose for Score, royal violet for Best) backed by crisp text-shadows and subtle drop shadows across both pastel and dark themes.
- Pastel Anime Onboarding Elements: Restyled `#phantomBadge` toast and `#phantomHand` SVG to render as a white anime chibi hand with soft pink outlines, glowing pink contact ripple, and white-card toast pill with dark plum text.
- Theme-Adaptive Floating Scores & Grid: In-game `+N` floaters and canvas grid lines dynamically adapt between dark plum outlines on sakura pink in pastel mode and dark slate outlines on golden amber in default mode.

## [1.16.0] - 2026-11-23
### Added
- Anime Cel-Shaded Chibi Ball Rendering: Built `src/game/animeSprite.js` replacing 3D glossy gradients with authentic anime cel-shading when the pastel anime theme is active.
- Two-Tone Cel Shadows & Ink Outlines: Features crisp clipped crescent shadow bands, dark plum cel strokes, soft pink chibi blush marks, and dual anime eye/bubble gleam speculars.
- Fredoka Sticker Typography: Numbers render in soft rounded Fredoka with crisp white sticker borders and dark plum text.
- Theme-Aware Sprite Caching: `spriteCache.js` keys sprites by theme (`anime` vs `gloss`), preserving the glossy neon look in default mode and instant anime rendering in pastel mode.

## [1.15.0] - 2026-11-23
### Added
- Cozy Pastel Anime Theme: Created `src/config/tierThemes.js`, `src/core/themeManager.js`, `src/ui/themeToggle.js`, and `src/styles/themes.css` introducing a soft, aesthetic pastel color scheme inspired by cozy anime visuals.
- In-Place Theme Palette Swapping: Seamlessly swaps tier colors and glows between default neon and pastel palettes (Sakura Pink, Peach Custard, Butter Mochi, Matcha Milk, Boba Sky, Lavender Dream, Taro, etc.) without mutating object references or disrupting in-flight physics.
- Dynamic Sprite Cache Purge: Flushes pre-rendered ball canvas sprites via `spriteCache.clear()` and emits `theme:changed` and `next:update` events for instantaneous visual re-rendering.
- Header Theme Toggle Button: Added `#themeToggleBtn` (`🌸` / `⚡`) in the header actions bar with multi-touch event bindings (`pointerup`, `touchend`, `click`) and local storage persistence.
- Pastel Modal & HUD Overrides: Styled overlays, high-score celebration screens, milestone dared cards, score counters, and combo banners to seamlessly match the cozy pastel anime aesthetic.

## [1.14.1] - 2026-11-23
### Fixed
- High Score Modal Duplicate Triggering: Relocated record-break evaluation into `Engine.handleMerge()`, tracking `sessionStartBest` and strictly latching `hasCelebratedBest = true` on the engine state so the celebration fires exactly once per round.
- Enhanced High Score Modal Padding & Breathing Room: Upgraded `.highscore-modal` padding in `src/styles/highscore.css` to `28px 18px 24px` with expanded vertical spacing around the crown icon and record box.
- Featured Promo Slot in High Score Modal: Integrated `.promo-slot-wrap` and populated rotating cross-promo cards (EloRun & ZenCash) between the high score display and the "KEEP GOING 🚀" button with multi-touch event bindings.

## [1.14.0] - 2026-11-23
### Added
- New High Score Celebration Screen: Created `#highScoreOverlay`, `src/ui/highScoreModal.js`, and `src/styles/highscore.css` to celebrate the instant a player shatters their previous record during an active run.
- Single-Trigger Record Detection: Evaluates in `src/ui/uiManager.js` against the session start record (`sessionRecord > 0`), firing celebratory fireworks, confetti bursts, golden crown animations, and victory fanfare exactly once per run.
- Seamless Resume Protocol: Pauses game physics cleanly and provides a prominent "KEEP GOING 🚀" button that dismisses the celebration and resumes gameplay without disrupting board state.

## [1.13.0] - 2026-11-23
### Added
- Retro Nintendo Floating Score Popups: Built `FloatingScore` particle class in `src/game/particle.js` that emits bold arcade "+N" point values right from the merge epicenter with dark outlines, decelerating upward float, and gentle fade-out.
- Centered In-Playfield Combo Banner: Relocated `#comboBadge` from top status header into `#canvasWrapper` with `pointer-events: none` and dynamic `combo-pop` keyframe animations, giving high-visibility multiplier feedback (`🔥 COMBO x2`, `x3`) right in the active playfield.

## [1.12.2] - 2026-11-23
### Added
- Organic Multi-Drop Demonstration & Adaptive Aim Solver: Upgraded `src/game/tutorial.js` and extracted `src/game/tutorialActions.js` to shoot an organic sequence of 6 to 10 blobs using whatever blobs the game engine naturally provides.
- Distinct Tap vs Drag Demonstrations: Visually differentiates instantaneous single-tap drops from controlled tap-and-hold drag aiming where the phantom hand and trajectory line visibly sweep across angles before release.
- Dynamic Merge Detection: Intelligently detects matching tiers present on the board and prioritizes aimed merge shots, while alternating wall ricochets and lane balances when waiting for matches.

## [1.12.1] - 2026-11-23
### Fixed
- Client-Side AdBlocker Startup Crash: Replaced static promotional imports in `src/main.js` with an asynchronous dynamic loader wrapped in error handling, preventing browser adblocker extensions from halting game engine initialization with `ERR_BLOCKED_BY_CLIENT`.
- Renamed Ad-Related Modules & Selectors: Renamed `adManager.js` to `promoManager.js`, `houseAds.js` to `crossPromo.js`, `admobService.js` to `monetizationService.js`, and `src/styles/ad.css` to `src/styles/promo.css`. Neutralized DOM classes and IDs to `.promo-*` to prevent cosmetic adblock filtering.

## [1.12.0] - 2026-11-23
### Added
- Interactive Phantom Hand Demonstration: Created `src/game/tutorial.js` and `src/styles/tutorial.css` delivering a sleek, minimalist SVG pointer hand that executes an interactive 5-drop demonstration upon fresh starts.
- Multiple Trajectory & Mechanic Showcase: Demonstrates direct downward shots, high-angle wall ricochets off both left and right walls, and an intentional same-tier collision illustrating the core 2+2=4 blob merge with particle sparkles and combo chime.
- Instant Zero-Latency Touch Takeover: Wrapped user input listeners (`pointerdown`, `touchstart`) to immediately abort the demonstration sequence, dismiss the phantom hand, and grant players 100% responsive control without any delay or frozen state.

## [1.11.1] - 2026-11-16
### Fixed
- Confetti & Fireworks Viewport Detection: Fixed zero-dimension calculation in `src/ui/confetti.js` by unhiding modal overlay before sizing canvas and adding robust dimension fallbacks with `getBoundingClientRect()`.
- Elevated Particle Layer & Multi-Emitter Celebration: Elevated confetti canvas to `z-index: 10` with click-through pointer events, added dual-cannon fluttering ribbons with 35 radiating center firework sparks, and applied a gleaming golden card border with radial aura in `src/styles/modal.css`.

## [1.11.0] - 2026-11-16
### Added
- 4096 & 8192 Victory Confetti Engine: Built zero-dependency `src/ui/confetti.js` with hardware-accelerated 2D canvas particle physics running at 60 FPS without memory leaks or main thread lag.
- Celebratory Golden Card Flare & Typography: Enhanced `src/styles/modal.css` with shimmering gradient victory text, bouncing trophy badge, and glowing radial halo for 4096 and 8192 milestones.
- Triumphant Victory Fanfare: Added 6-note sine victory fanfare in `src/audio/sound.js` to distinguish climactic milestone unlocks from ordinary progress popups.

## [1.10.1] - 2026-11-13
### Fixed
- Play Store House Ad metadata & authentic branding: Fetched official Google Play Store metadata and high-resolution icons for EloRun ("EloRun: Master Chess Puzzles", tactical chess puzzle engine with 112K+ puzzles) and FinTrack ("ZenCash | Master your Money", minimalist financial intelligence and wealth tracker). Bundled offline-cached WebP icons in `public/assets/ads/` and updated `src/ui/houseAds.js`.

## [1.10.0] - 2026-11-13
### Added
- Custom in-game confirmation modal: Built `#confirmResetOverlay` and decoupled `src/ui/confirmModal.js` to replace ugly system-level `window.confirm` dialogs with theme-matched frosted glass styling, smooth animations, and Cancel/Restart buttons with native haptic feedback.
- Universal house ad rotator for EloRun and FinTrack: Updated `src/ui/houseAds.js` with rotating promotional banners for EloRun and FinTrack, enabled across both web and native Android platforms via `src/ui/adManager.js` until AdMob is deployed.

## [1.9.1] - 2026-11-13
### Fixed
- Web Service Worker Network-First HTML delivery: Upgraded `public/sw.js` cache name to `blobdrop-v1.9.0` and converted navigation and HTML fetch requests to network-first with offline cache fallback, ensuring web users receive live HTML and UI updates immediately upon deployment rather than serving stale cache-first HTML.

## [1.9.0] - 2026-11-13
### Added
- New Game and Restart button: Added a circular reset button (`🔄`) to the top action bar with state check confirmation (`window.confirm`) to restart boards cleanly without forcing artificial game over states.
- Sleek icon-only action group: Removed text labels ("Install", "Pause", "Sound") from header action buttons, transitioning to modern 44px circular pills with centered iconography and full mobile touch targets.

## [1.8.2] - 2026-11-13
### Fixed
- Native Android Service Worker caching conflict: Guarded Service Worker registration strictly to non-native web browsers and unregister any stale service workers or caches on Capacitor Android builds, preventing stale index.html files from referencing deleted JavaScript bundle hashes.

## [1.8.1] - 2026-11-12
### Fixed
- Android Play Now touch responsiveness: Bound dual `pointerup`, `touchend`, and `click` listeners with debouncing on the primary action button to eliminate synthetic click drops and touch latency on Android WebViews.
- Canvas touch obstruction: Applied `display: none` (`.hidden`) to `#gameOverlay` on game start so invisible overlay elements with backdrop-filter no longer trap touch events intended for the game canvas.
- Modular milestone architecture: Extracted milestone modal logic into `src/ui/milestoneModal.js` to keep `uiManager.js` under 150 lines in accordance with the 180-line target.
- Initialization sequence: Initialized `uiManager` before `engine` so game state restoration events are immediately captured by UI listeners.

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
