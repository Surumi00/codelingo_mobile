# codelingo mobile

Expo (React Native) client for the CodeLingo backend.

## Requirements

- Node.js 20+
- The CodeLingo backend running locally (`codelingo-backend`, `npm run dev`, default port `3000`)

## Setup

```bash
npm install
npx expo start
```

## Environment

Copy `.env.example` to `.env` and point it at your backend:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Because the value is inlined at bundle time, restart the dev server (`npx expo start`) after changing it.

Which host to use:

| Target           | `EXPO_PUBLIC_API_URL`           |
| ---------------- | ------------------------------- |
| Web / iOS sim    | `http://localhost:3000`         |
| Android emulator | `http://10.0.2.2:3000`          |
| Physical device  | `http://<computer-LAN-IP>:3000` |

A physical device must be on the same network as the backend machine. Requests from React Native are not subject to browser CORS rules.

## API layer

Everything that talks to the backend lives in `src/api`. Screens must never call `axios` directly — import the typed functions instead:

```ts
import { login, getMe, getSyllabus } from "@/api";
```

`client.ts` creates a single `axios` instance with `baseURL` from `EXPO_PUBLIC_API_URL` and installs:

- a **request interceptor** that adds `Authorization: Bearer <token>` when a token is stored;
- a **response interceptor** that, on `401` from any endpoint other than `/auth/login` and `/auth/register`, clears the stored token and calls the callback registered with `setOnUnauthorized`, so a bad token sends the user back to Login from one place.

Helpers: `getApiErrorMessage(error)` reads `{ error: { message } }` (the backend's error shape) and `getHttpStatus(error)` returns the HTTP status.

### Local storage

Mobile has no `localStorage`, so `src/storage` holds the two persisted keys:

- `auth-storage.ts` — `getToken` / `setToken` / `clearToken`, backed by `expo-secure-store` under the key `token`, with an in-memory copy so the axios interceptor does not hit disk on every request.
- `diagnostic-storage.ts` — `getDiagnosticResult` / `setDiagnosticResult` / `clearDiagnosticResult`, backed by `AsyncStorage` under the key `diagnostic_result` and stored as JSON.

Every read is wrapped in `try/catch` and returns `null` on failure; writes never throw. The token cache survives an app restart because it is loaded from the store on the first read, and `clearToken` clears both the store and the in-memory copy.

`App.tsx` registers the token store with `setTokenStore(...)` at startup: `src/api/token-store.ts` owns the `TokenStore` interface, and `src/storage` is the only place that imports `expo-secure-store` or `AsyncStorage`.

The web app's `codelingo_profile` key was deliberately not ported — it only held local profile edits that were never sent to the server.

### Endpoints

| Function                 | Request                     | Response                                                |
| ------------------------ | --------------------------- | ------------------------------------------------------- |
| `login`                  | `POST /auth/login`          | `{ user, token }`                                       |
| `register`               | `POST /auth/register`       | `{ user, token }` (201)                                 |
| `getMe`                  | `GET /auth/me`              | `User`                                                  |
| `saveOnboarding`         | `POST /me/onboarding`       | `{ message, user }`                                     |
| `getDiagnosticQuestions` | `GET /diagnostic/questions` | `DiagnosticQuestion[]` (15 questions)                   |
| `submitDiagnostic`       | `POST /diagnostic/submit`   | `DiagnosticSubmitResponse`                              |
| `getDiagnosticResult`    | `GET /diagnostic/result`    | `DiagnosticSubmitResponse` or `null` when there is none |
| `getSyllabus`            | `GET /api/syllabus`         | `SyllabusLevel[]`                                       |

Request/response shapes are in `src/api/types.ts` and next to each function.

Backend rules worth knowing:

- `saveOnboarding` requires `occupation`, one of the `ExperienceLevel` values, and `language: "PYTHON"` (other languages are rejected with 400).
- `submitDiagnostic` expects exactly 15 answers (`{ questionId, selectedOptionIndex }`); a mistyped payload is a 500, so send the full set from `getDiagnosticQuestions`.
- `GET /diagnostic/result` does not exist yet and answers `404` (non-JSON). `getDiagnosticResult` maps `400`, `404`, `422` and `204` to `null` so callers can treat "no result yet" as a normal state.
- `GET /api/syllabus` is public; the other endpoints need a bearer token.

## Theme and assets

`src/theme/theme.ts` is the only place with colour values; screens and components import `colors`, `spacing`, `radii` and `fontSizes` from `@/theme`.

- `colors` mirrors the web app's CSS variables in `src/index.css`: `bg #09070f`, `surface #0d0a14`, `border #292335`, `accent #8c4ff2`, `accentDark #7438d8`, `text #aaa2bd`, `textStrong #f7f4ff`, plus `onAccent #ffffff` for text on coloured buttons.
- `gradients.primary` is `["#9255f5", "#713bd5"]` — the purple-500 → purple-600 gradient used by the web primary buttons (`linear-gradient(100deg, #9255f5, #713bd5)` in `features/auth/components/auth-page.css`).
- `spacing` (4px grid), `radii` and `fontSizes` follow the sizes used across the web app's CSS.
- Fonts: the web app uses `Avenir Next`/`Segoe UI`. This app keeps the platform default font instead of bundling one; add `expo-font` later if a custom look is wanted.

Mascot art copied from the web app lives in `src/assets/characters` (in the web filenames, so `strugling.png` keeps its spelling) and `src/assets/hero.png` (`heroImage` from `@/assets`).

`Mascot` (`@/components/mascot`) takes a `mood` and renders the matching image:

```tsx
import { Mascot } from "@/components/mascot";

<Mascot mood="struggling" size={96} />;
```

Valid moods: `mascotMoods` from `@/components/mascot-images` — `happy`, `hi`, `excited`, `confused`, `crying`, `sad`, `thinking`, `celebrating`, `struggling` (the prop spelling normalises `strugling.png`). `PrimaryButton` (`@/components/primary-button`) renders the gradient button.

The `MascotGallery` screen is the current app entry point and shows every mascot, the hero image and both button states.

## Scripts

```bash
npx expo start      # dev server
npx tsc --noEmit    # typecheck
npx expo lint       # lint
npx prettier --write .
```
