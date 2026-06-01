# Security Policy

## Supported Versions

This policy applies to the latest version on the `main` branch.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Use [GitHub's private vulnerability reporting](https://github.com/wsamuelw/mimo-storyteller/security/advisories/new)
3. Include steps to reproduce, potential impact, and suggested fix (if any)

We aim to acknowledge reports within 48 hours and provide a fix within 7 days for confirmed vulnerabilities.

## In Scope

- Cross-site scripting (XSS) via user input
- API key exposure or leakage
- Content injection through story text or voice descriptions
- Unsafe HTML rendering

## Out of Scope

- API key stored in localStorage (by design — documented limitation)
- Third-party API (MiMo) security issues
- Social engineering attacks

## Best Practices for Users

- Use a dedicated API key for this app, not your main account key
- Do not share screenshots that include your API key
- Use the eye icon to verify your key before pasting
