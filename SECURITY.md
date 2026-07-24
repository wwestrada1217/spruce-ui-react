# Security Policy

## Supported Versions

Spruce React is currently in its 0.x release line. Only the latest published
release receives security fixes.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, use one of these private channels:

- **GitHub private vulnerability reporting** (preferred): open a report via
  [Security Advisories](https://github.com/wwestrada1217/spruce-ui-react/security/advisories/new).
- **Email**: <support@sprucestack.com> with the subject line
  `[SECURITY] spruce-react`.

Please include as much of the following as you can:

- The affected component or module and the version you tested
- A description of the vulnerability and its potential impact
- Step-by-step instructions or a minimal reproduction
- Any suggested remediation, if you have one

## What to Expect

- **Acknowledgement** of your report within **5 business days**.
- An assessment and, when the report is confirmed, a remediation plan and
  timeline.
- Credit in the release notes for the fix, unless you prefer to remain
  anonymous.

Please give us a reasonable opportunity to investigate and release a fix before
any public disclosure.

## Scope Notes

Spruce React is a client-side component library with zero runtime
dependencies. Reports we consider in scope include (but are not limited to):

- Cross-site scripting (XSS) through component props or rendered content
  (e.g., HTML injection via user-supplied strings)
- Prototype pollution or unsafe object merging in theming/token utilities
- Vulnerabilities in the build artifacts published to npm

Issues in the documentation site that cannot affect consumers of the library
are appreciated but treated as regular bugs — feel free to open a public issue
for those.
