# Contributing

Thanks for your interest in contributing to MiMo Storyteller!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/<your-username>/mimo-storyteller.git`
3. Open `index.html` in your browser — no build step required

## Project Structure

```
├── index.html      # App structure
├── style.css       # Neon glass design system
├── app.js          # Core logic (segmentation, TTS, playback)
├── i18n.js         # 3-language translations (zh-CN, zh-TW, en)
└── README.md       # Documentation
```

## Making Changes

1. Create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test in at least one browser (Chrome, Firefox, Safari, or Edge)
4. Commit with a clear message: `git commit -m "feat: add X"`
5. Push and open a PR

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

Use the issue templates. Include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshot if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
