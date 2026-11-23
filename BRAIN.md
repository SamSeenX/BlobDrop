# BRAIN.md - Architectural & Memory Record for BlobDrop

## Architectural Philosophy
BlobDrop is a viral physics-based 4096 number-merge puzzle built with high performance, tactile squishy jelly physics, and zero external runtime dependencies. It adheres strictly to modern web standards, modular Vanilla ES2022 JavaScript, and native Vanilla CSS variables.

## Core Modules & Design
- **Interactive Phantom Hand Onboarding & Head Start (`src/game/tutorial.js`, `src/game/tutorialActions.js`, `src/styles/tutorial.css`)**:
  - Minimalist SVG pointer indicator: Clean, glassmorphic pointing hand with cyan vector styling and expanding contact ripple that demonstrates game mechanics on new game starts.
  - Multi-trajectory mechanical demonstration: Dynamically shoots 6 to 10 natural blobs using whatever tiers the engine naturally produces. Showcases quick tap drops, tap-and-hold drag aiming with visible trajectory sweeps, wall ricochets off both left and right walls, and adaptive matching shots targeting identical resting blobs for live merges.
  - Pre-seeded starter basin: Seeds 6 to 8 settled blobs across the floor to eliminate the empty board feeling while maintaining balanced stack safety.
  - Instant zero-latency player takeover: Any pointerdown or touch event anywhere on the canvas wrapper immediately cancels active timeouts, clears the animation frame, and hands complete control to the player with zero lag.
- **Touch Ergonomics & Header Actions (`src/ui/uiManager.js`, `src/ui/milestoneModal.js`, `src/styles/status.css`)**:
  - Icon-only header action buttons: Circular 44px touch targets with no text labels prevent viewport overflow on narrow mobile screens and present clean iconography (`📲`, `🔄`, `⏸️`/`▶️`, `🔊`/`🔇`).
  - Active session reset protocol: The restart button (`🔄`) clears in-memory balls and saved state via `handleReset()`, featuring confirmation protection against accidental board losses during live games.
  - Tri-event input binding: Primary interactive buttons bind `pointerup`, `touchend`, and `click` with execution debouncing to eliminate 300ms mobile touch delays and avoid dropped taps on Android WebViews.
  - Complete layout tree detachment: Overlays apply `display: none` (`.hidden`) after transition animations rather than relying solely on `pointer-events: none`, preventing backdrop-filter compositing layers from capturing canvas gestures.
- **Tactile Haptic Feedback & Audio Sync (`src/audio/haptics.js`, `src/audio/sound.js`)**:
  - Dual-platform tactile response: Native `@capacitor/haptics` impacts and notifications on mobile, coupled with standard `navigator.vibrate` pulse patterns on browsers.
  - Distinct event vibrations: Light impact on blob launch and drop, medium impact on blob merges, fanfare vibration sequence on milestone unlocks, and dual pulse on game over.
  - Non-blocking execution: Haptic triggers fire asynchronously without impacting the 60 FPS deterministic physics accumulator loop.
- **Native Android Adaptive Launcher Assets (`android/app/src/main/res/`)**:
  - Full density raster coverage: Pixel-perfect launcher icons for mdpi (48px), hdpi (72px), xhdpi (96px), xxhdpi (144px), and xxxhdpi (192px).
  - Modern adaptive icon support: Adaptive foreground assets with 72% safe-zone margin on a `#020617` background color, supporting dynamic Android 14+ launcher shapes (circles, squircles, pebbles).
- **Single-Source Unified Multi-Platform Architecture (`capacitor.config.json`, `android/`)**:
  - Unified codebase for Web and Android: Capacitor wraps the web build (`dist/`) directly inside the local `android/` directory without splitting or duplicating repositories.
  - Native cache isolation: Service Worker (`/sw.js`) registration is restricted exclusively to standard web environments, actively unregistering legacy workers and purging caches in native Capacitor builds to eliminate 404 stale asset hashes across APK updates.
  - Single build command: Web deploys to Cloudflare Pages via Vite, while `npx cap sync android` synchronizes the exact same tested web assets into Android Studio / Gradle.
  - Target SDK 36 and Android 14+ compliance with memory-capped Gradle daemon (`2048m`) ensuring fast, freeze-free local builds.
  - Both debug APK (`app-debug.apk`) and release App Bundle (`app-release.aab`) compile cleanly in under 4 minutes using local Android SDK.
- **AdBlock-Resilient Dual-Mode Monetization (`src/ui/promoManager.js`, `src/ui/crossPromo.js`, `src/ui/monetizationService.js`)**:
  - Non-blocking dynamic loader: Promotional modules are loaded asynchronously via dynamic `import()` in `main.js` with error isolation, guaranteeing that client-side adblock extensions (uBlock, AdGuard, Brave Shields) never halt game startup with `ERR_BLOCKED_BY_CLIENT`.
  - Neutralized asset naming: Files and DOM classes avoid adblock regex triggers by using `promo-` prefixes rather than `ad-` or `houseAds`.
  - Native Android (Google AdMob): Uses `@capacitor-community/admob` via `monetizationService.js` to display bottom banners and preloaded interstitial ads upon Milestones and Game Over.
  - Web & PWA (Cross-Promo): Uses `src/ui/crossPromo.js` with auto-rotating cards promoting EloRun and ZenCash on the Google Play Store with direct click-throughs.
- **Responsive Screen Normalization & Fair Viewport (`src/game/layout.js`, `src/styles/canvas.css`)**:
  - Enforced 2:3 aspect ratio containment: Regardless of screen resolution or orientation, `.canvas-wrapper` locks to 2:3 proportions, eliminating unfair vertical stacking advantages on tall or high-PPI screens.
  - Rebalanced tier curve: Tier radii gracefully taper from 13px (tier 0) up to 98px (4096) and 110px (8192), ensuring large blobs can fit comfortably on the floor (2x 1024 = 304px <= 360px).
  - Sustained overflow timer & muzzle obstruction check: Fixed late-game failure where vibrating crowded stacks bypassed game over. If stacked balls reach `dangerY = 45 * scale` for > 55 frames or bury the cannon for > 25 frames, Game Over triggers reliably with `.danger-active` pulsing along the top rim.
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
  - 192x192 and 512x512 maskable PNG icons along with 180x180 `apple-touch-icon.png` meeting Chromium and Safari installability heuristics.
  - Interactive install prompt handler (`src/ui/pwaPrompt.js`).
- **Cannon Launcher, Ballistic Trajectory & Reload Animation (`src/game/trajectory.js`, `src/game/renderer.js`, `src/game/input.js`)**:
  - Center-top mounted cannon aiming from `(width / 2, 38 * scale)`.
  - Curved ballistic aim trajectory: 22-step forward simulation in `trajectory.js` integrating exact launch velocity (`14 * scale`), downward gravity (`0.40 * scale`), air drag (`0.985 / 0.99`), and wall bounce ricochets.
  - Elastic cannon reload entry animation: Blob slides smoothly down from off-screen above into shoot position over ~260ms.
  - Exponentially dampened harmonic bounce on arrival at the muzzle.
- **Sprite Texture Cache & Depth Rendering (`src/game/spriteCache.js`, `src/game/renderer.js`)**:
  - Pre-renders high-DPI offscreen canvas textures once per tier.
  - Tier-based z-index draw sorting: Larger background blobs render first, smaller foreground blobs render last.
  - Single hardware-accelerated `ctx.drawImage` blit per ball per frame (< 1ms frame rendering).
- **Fixed Timestep Loop & State Persistence (`src/main.js`, `src/core/storage.js`, `src/game/stateStorage.js`)**:
  - Deterministic 60 FPS physics accumulator loop decoupled from display refresh rate.
  - Session state persistence in `localStorage`: active balls, positions, score, combos, and upcoming tiers survive browser reloads.
- **Audio Synthesis (`src/audio/sound.js`)**:
  - Real-time Web Audio API synthesis: sine drops, triangle merges, sawtooth gameover, and ascending 4-note celebratory fanfare for milestones.

## Technical Decisions
- **No Tailwind / No React**: Pure Vanilla ES modules and modern semantic CSS variables to guarantee lightweight execution, fast loading, and zero runtime overhead.
- **Strict 200-Line Modular Limit**: Every code module is kept below 180 lines through single-responsibility separation.
- **Vite Build System**: Pre-configured with ES2022 targets and automated console/debugger drop in production builds.
