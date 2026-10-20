# Backend work needed

For the backend owner, from the mobile port (MOB-15). Every item below was observed against the running backend — nothing here is speculative. Ordered by what unblocks the most.

## 1. `GET /diagnostic/result` does not exist

- Observed: `404` with a non-JSON body for an authenticated account.
- The mobile client treats that as "no saved result" (`getDiagnosticResult()` maps `400`, `404`, `422` and `204` to `null`) and falls back to the result it stored on the device after `POST /diagnostic/submit`. The flow works, but the result is lost on reinstall, and a second device sees none.
- Asked for: return the account's latest result in the same shape as `POST /diagnostic/submit`, with `204`/`404` when there is none.

## 2. Profile update — blocks MOB-B2

- The Profile screen is read-only because name/email/password/language cannot be changed.
- The web's Edit form only ever wrote to the browser's `localStorage`, which is why the port did not copy it.
- Asked for: an endpoint such as `PATCH /me` for the editable fields, plus the validation rules, so the screen can grow a form that actually persists.

## 3. Lessons and progress — blocks MOB-B3

- The web's `START` and `START TOPIC` buttons do nothing, so the syllabus screen does not render them and the concept list is display-only.
- Asked for: a lesson/concept content endpoint (and a completion endpoint) so the buttons can have an action and progress can be stored server-side.

## 4. XP / progress — blocks MOB-B4

- There is no XP, streak, level or rank anywhere in the API. The web hardcodes an `8 XP` badge on Profile; the port dropped it rather than fake it.
- Asked for: the XP model (per diagnostic? per lesson?) and the field(s) on the user payload.

## 5. Onboarding: `occupation` is not validated, `language` is Python-only, answers are not returned

- Observed: `POST /me/onboarding` accepts any `occupation` string (one test account has `TEACHER` stored even though the app only sends `STUDENT` / `PROFESSIONAL` / `HOBBYIST`) and rejects every `language` except `PYTHON`.
- `GET /auth/me` returns the resulting `occupation`, `experienceLevel` and `language`, but not the onboarding answers, so Profile's `Occupation` row was dropped as unreliable.
- Asked for: an `occupation` enum, a decision on when the other languages become accepted (the app hides them behind `Coming soon`), and either the onboarding answers on `GET /auth/me` or a confirmation that they are not needed.

## 6. A stable `conceptSlug` vocabulary

- `POST /diagnostic/submit` returns a `breakdown` keyed by 15 slugs: `variables-data-types`, `operators`, `if-elif-else`, `loops`, `lists`, `oop-classes-constructors`, `oop-inheritance`, `recursion`, `modules`, `apis`, `decorators`, `generators`, `concurrency`, `memory-management`, `type-hinting`.
- The skill radar draws six fixed axes (`Variables`, `Loops`, `Functions`, `OOP`, `Data Struct.`, `Exceptions`), so only three of them can ever match a slug — the other three always read `0`.
- Asked for: either slugs (or an alias map) at the same granularity as the radar, or confirmation that the radar should be replaced by a plain per-slug list.

## Small inconsistencies worth knowing

- `GET /diagnostic/questions` returns `{ questions: [...] }` while `GET /api/syllabus` returns `{ data: [...] }`. Both are handled client-side, but one convention would be less error-prone.
- `POST /diagnostic/submit` requires exactly 15 answers; a malformed payload is a `500` rather than a `400`, which made debugging harder.
- `GET /api/syllabus` is public (no token); the other endpoints need a bearer token.
