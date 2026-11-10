# RULES.md - Project Specific Constraints & Rules

1. **Strict 200-Line Limit**: Every code file (`.js`, `.css`) must strictly target under 200 lines of code. Proactively split files when approaching ~180 lines.
2. **Vanilla Philosophy**: Pure Vanilla JavaScript (ES2022) and Vanilla CSS tokens. No Tailwind CSS, no React, no external runtime bloat.
3. **Tooling**: Vite as standard build and development tool with console/debugger stripping in production.
4. **Offline Persistence**: Tier 1 `localStorage` for high scores and audio settings; persistent storage via `navigator.storage?.persist()`.
5. **Ergonomics & Mobile**: All interactive buttons must adhere to 48px minimum touch target size and handle safe-area insets (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`).
6. **Git & Release Protocol**: Feature branching (`feature/<name>`), automated PR/merge to `main`, and `deploy` branch sync for Cloudflare CI/CD.
