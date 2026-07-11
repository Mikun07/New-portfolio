# Security Policy

## Supported Version

| Version | Status |
|---------|--------|
| 1.0.x | Supported |

## Reporting a Vulnerability

Please report security issues privately through email:

```text
ayomikunolaleye@gmail.com
```

Do not open a public issue for secrets, credential exposure, or vulnerabilities involving private data.

## Security Expectations

- Do not commit `.env.local`.
- Do not commit API keys, tokens, passwords, or private certificates.
- Review files under `public/` before publication because they are served publicly.
- Rotate any exposed credential before continuing development.
