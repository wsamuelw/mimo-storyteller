# Contributing

Thanks for your interest in contributing to MiMo Storyteller!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/<your-username>/mimo-storyteller.git`
3. Open `index.html` in your browser — no build step required
4. Get a MiMo API key from [platform.xiaomimimo.com](https://platform.xiaomimimo.com) and paste it in Settings

## Project Structure

```
├── index.html          # App structure
├── style.css           # Neon glass design system
├── app.js              # Core logic (segmentation, TTS, playback)
├── i18n.js             # 3-language translations (~148 keys each)
├── API.md              # API integration details
├── README.md           # English documentation
├── README-zh-CN.md     # Simplified Chinese documentation
├── README-zh-TW.md     # Traditional Chinese documentation
├── LICENSE             # MIT License
├── CONTRIBUTING.md     # This file
├── SECURITY.md         # Vulnerability reporting policy
├── CODE_OF_CONDUCT.md  # Community guidelines
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   ├── feature_request.md
    │   └── config.yml
    └── pull_request_template.md
```

## API Key for Local Testing

The app stores the API key in localStorage (per-origin, never committed). To test locally:

1. Get a key from [platform.xiaomimimo.com](https://platform.xiaomimimo.com)
2. Open the app, click ⚙️ Settings, paste your key
3. The key persists in your browser — no `.env` file needed
4. **Never commit API keys** — the PR checklist includes a reminder

## Making Changes

1. Create a branch:
   - `feature/your-feature` — new features
   - `fix/your-fix` — bug fixes
   - `docs/your-docs` — documentation changes
2. Make your changes
3. Test in at least one browser (Chrome, Firefox, Safari, or Edge)
4. Commit with a clear message: `git commit -m "feat: add X"`
5. Push and open a PR using the PR template

## Code Conventions

- Pure HTML/CSS/JS — no frameworks, no build tools
- Use `escapeHtml()` for any user input inserted via innerHTML
- Use `t()` for all user-visible strings (add keys to all 3 locales)
- Keep mobile-first: 44px touch targets, responsive grid
- Use CSS custom properties (`--cyan`, `--bg`, etc.) for theming

## Commit Messages

Use conventional commits:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `perf:` — performance improvement
- `refactor:` — code change that neither fixes nor adds

## Reporting Issues

Use the [issue templates](https://github.com/wsamuelw/mimo-storyteller/issues/new/choose). Include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshot if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
