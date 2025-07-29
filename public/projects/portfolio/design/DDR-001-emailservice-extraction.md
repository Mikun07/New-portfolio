# DDR-001: EmailJS Extraction into Infrastructure Layer

**Status:** Accepted
**Date:** 2026-06-28
**Deciders:** Ayomikun Festus-Olaleye

## Context

Before this restructure, `Contact.tsx` directly imported `emailjs-com` and called `emailjs.send()` inline. This couples a UI feature component to an external third-party API call, making it harder to test, replace, or mock the send behaviour.

## Decision

Extract the EmailJS API call into `src/infrastructure/email/emailService.ts` as a typed function `sendContactEmail(payload: EmailPayload): Promise<void>`. `Contact.tsx` imports `sendContactEmail` instead of `emailjs` directly.

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Keep `emailjs.send()` inline in `Contact.tsx` | Simpler; fewer files | Feature component is tightly coupled to a specific external SDK; replacing EmailJS requires editing the UI component |
| Custom hook `useEmailSend()` | Encapsulates the call in a hook | Hooks are for stateful logic - this is a stateless I/O boundary, not a React concern |
| Infrastructure service (chosen) | Clear boundary; swappable; independently mockable | One extra file; slightly longer import path |

## Consequences

**Positive:**
- `Contact.tsx` is now independent of the specific email provider. Switching from EmailJS to a REST API or AWS SES requires editing only `emailService.ts`.
- The infrastructure layer has no React dependencies - it could be tested with `vitest` without a DOM environment.
- `EmailPayload` type is documented at the boundary, making the contract explicit.

**Negative:**
- One additional file in the project.
- The `[key: string]: unknown` index signature required by the emailjs-com SDK types leaks into `EmailPayload`, making the interface slightly less precise than desired.

## Future Considerations

If a proper backend is added (e.g., a `/api/contact` route on a Next.js or Express server), `sendContactEmail` in `emailService.ts` becomes the only file to change - `Contact.tsx` and the rest of the codebase remain untouched.
