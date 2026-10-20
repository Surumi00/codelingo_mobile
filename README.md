# codelingo mobile

Expo (React Native) client for the CodeLingo backend.

## Requirements

- Node.js 20+
- The CodeLingo backend running locally (`codelingo-backend`, `npm run dev`, default port `3000`)

## Setup

Clone this repository, then:

```bash
npm install          # install dependencies
cp .env.example .env # then edit EXPO_PUBLIC_API_URL (Windows: Copy-Item .env.example .env)
npx expo start       # start Metro
```

The backend lives in its own repository (`codelingo-backend`). Start it there (`npm run dev`, port `3000` by default) before the app — every screen after Login talks to it.

| Command                   | What it does                               |
| ------------------------- | ------------------------------------------ |
| `npm run start`           | Expo dev server (QR code for Expo Go)      |
| `npm run android` / `ios` | Same, opening an emulator/simulator        |
| `npm run typecheck`       | `tsc --noEmit`                             |
| `npm run lint`            | `expo lint`                                |
| `npm run format`          | `prettier --write .`                       |
| `npx expo-doctor`         | Diagnose dependency/config problems        |
| `npx expo install --fix`  | Align packages with the installed Expo SDK |

### Run it on a phone or emulator

Every native module this app uses ships inside Expo Go (`expo-secure-store` and `@react-native-async-storage/async-storage` are documented as included in Expo Go, and `react-native-svg`, `react-native-safe-area-context`, `react-native-screens` and `expo-linear-gradient` are on Expo Go's bundled list), so `npx expo start` plus the Expo Go app is enough for the whole flow. Only a library outside that list needs a development build (`npx expo run:android`, or `eas build --profile development`).

- Pick the right `EXPO_PUBLIC_API_URL` from the table under "Environment". A physical device needs the computer's LAN IP (`ipconfig` → IPv4), and Metro must be restarted with `npx expo start -c` after the change.
- Check the phone can reach the backend _before_ blaming the app: open `http://<LAN-IP>:3000/health` in the phone's browser. A timeout is almost always the Windows firewall (allow Node.js on private networks) or a guest/isolated Wi-Fi network.
- The LAN IP changes when the computer reconnects to Wi-Fi (seen in practice: `192.168.1.3` → `192.168.1.2`). If a screen suddenly cannot load or save while earlier steps worked, check `ipconfig`, fix `EXPO_PUBLIC_API_URL`, restart Metro with `-c` and reload. A stopped backend looks the same: the stored token still gets you past Login, but onboarding and the diagnostic fail with their generic error.
- If the phone cannot be on the same network, `npx expo start --tunnel` gets Metro through, but the backend is still on the LAN — `EXPO_PUBLIC_API_URL` has to stay an address the phone can reach.
- Android emulator uses `http://10.0.2.2:3000`; iOS simulator and web use `http://localhost:3000`.

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

- `colors` mirrors the web app's CSS variables in `src/index.css`: `bg #09070f`, `surface #0d0a14`, `surfaceRaised #1f1d29` (web `--surface-raised`: option cards, speech bubble), `border #292335`, `borderStrong #4b415c` (web `--border-strong`: card outlines), `accent #8c4ff2`, `accentDark #7438d8`, `accentSoft #c5a5ff` (web `--accent-soft`: the `Coming soon` chip text), `accentMuted #8c4ff240` (web `--accent-muted`: inactive step dots, chip background), `text #aaa2bd`, `textStrong #f7f4ff`, plus `onAccent #ffffff` for text on coloured buttons.
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

The `MascotGallery` screen (`src/components/mascot-gallery-screen.tsx`) shows every mascot, the hero image and both button states. It is no longer part of the navigators — it is kept as a dev screen to check the assets.

## Navigation and auth gate

The app decides once at startup which screens exist, so a signed-out user cannot reach any signed-in screen.

| File                                  | Role                                                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/features/auth/auth-provider.tsx` | `AuthProvider` — holds `status` (`loading \| signedOut \| signedIn`) + `entryRoute`, `signIn(token)`, `signOut()` |
| `src/features/auth/auth-context.ts`   | Context + `useAuth()` (split out so the provider file only exports a component)                                   |
| `src/features/auth/entry-route.ts`    | `resolveEntryRoute()` — decides `Onboarding` vs `DiagnosticResults` once, before the signed-in stack mounts       |
| `src/components/splash-screen.tsx`    | Shown while `status === "loading"`                                                                                |
| `src/navigation/root-navigator.tsx`   | Renders `SignedOutNavigator` or `SignedInNavigator` from the status                                               |
| `src/navigation/types.ts`             | Typed param lists                                                                                                 |

- Signed out: `Login`, `Register` (functional — wired to `login`/`register`).
- Signed in: `Onboarding` (functional — the ported 7-step flow), `Diagnostic` (functional — the 15-question placement quiz), `DiagnosticResults` (functional — renders the result from the route param, or from storage when the param is missing), `Syllabus` (functional — the level/topic/concept browser), `Profile` (functional — identity, diagnostic summary, skill radar and concept breakdown).
- `Syllabus` and `Profile` are peers, so each carries a `headerRight` link to the other (`@/components/header-link`). No tab navigator was added — it would need `@react-navigation/bottom-tabs` and would restructure the stack around `entryRoute`.
- `DiagnosticResults` takes `{ result?: DiagnosticSubmitResponse }` — optional, because the screen falls back to the saved result (see "Diagnostic results screen"). The quiz screen always passes it.

Wiring:

- `AuthProvider` reads the token from `src/storage` on mount, so a signed-in user skips Login. `signOut` clears both the token and the saved diagnostic result.
- The provider registers `signOut` with `setOnUnauthorized`, so any `401` other than `/auth/login` and `/auth/register` clears the session and returns the user to Login.
- `App.tsx` still calls `setTokenStore(...)`, so the axios request interceptor reads the token from the same module the provider writes to.
- Register shows a success banner and returns the user to Login, like the web app. The register response does include a token (verified), so auto sign-in could be enabled later.
- The signed-in stack starts on `entryRoute` (see "After-login routing and logout"), not always `Onboarding`.
- `colors.danger` (`#ff8f8f`) and `colors.success` (`#86efac`) were added for form feedback: the web's `.field-error` uses `#b42318` on a light card, which is unreadable on this app's dark background. MOB-14 added `colors.warning` (`#fde047`) for the diagnostic `Developing` status.

## Login screen

`src/features/auth/components/login-screen.tsx` mirrors the web login page (`login-page.tsx`) in one column: a mascot hero and the card (`Welcome back` / `Log in to continue your path.`).

- Submits `{ email, password }` (trimmed email) to `login`, then `signIn(token)`. The auth gate swaps in the signed-in stack — the screen itself never navigates.
- Failures show the server's `{ error: { message } }` text when there is one, otherwise `Login failed.` A `401` from `/auth/login` is excluded from the interceptor's `setOnUnauthorized` path, so a wrong password cannot trigger a sign-out loop.
- `PrimaryButton` takes a `loading` prop: while a request is in flight the button is disabled and shows an `ActivityIndicator`.
- Double taps are blocked by a `useRef` flag, not just `isSubmitting` — state updates are async, so two taps in the same tick would both pass a state-only check.
- `KeyboardAvoidingView` (`padding` on iOS) wraps a `ScrollView`, so the form stays reachable on a small screen; Android relies on Expo's default `softwareKeyboardLayoutMode: "resize"`.
- The web's GitHub/Google buttons and the `OR CONTINUE WITH` divider are omitted (tracked as MOB-B1).

## Register screen

`src/features/auth/components/register-screen.tsx` mirrors the web register page (`register-page.tsx`) in one column: a mascot hero with the `Let's get / you set up.` heading, then the card (`Create your account` / `Takes about a minute.`).

- Uses the ported `validate()` from `@/features/auth`: `Name is required.` / `Email is required.` / `Password is required.` / `Password must be at least 8 characters.` Errors render under their own field, and the field border turns red (`inputError`). Validation stops before any request is sent.
- Submits `{ name, email, password }` with `name`/`email` trimmed (password is sent as typed, like the web app).
- Failures show the server's `{ error: { message } }` text (e.g. `Email already in use` for a duplicate, `Password must be at least 8 characters`), otherwise `Registration failed.`
- On success it shows an in-app banner (`Registration successful! You can now log in.`) and redirects to Login after 1.4s. There is no `alert()`; the timer is cleared on unmount.
- Registering does **not** sign the user in — the same as the web app. The `201` response does carry a token, so this can change later (MOB-8 "watch out").
- Same `loading` button, `useRef` double-tap guard and `KeyboardAvoidingView` treatment as the Login screen.

## After-login routing and logout

The web app always sends users to Onboarding (even returning ones) and has no logout. Mobile resolves an entry route instead, in `src/features/auth/entry-route.ts`, once per sign-in — before `SignedInNavigator` mounts, so the stack's `initialRouteName` is already correct and there is no visible jump out of Onboarding.

The backend cannot report whether the diagnostic is done:

- `/auth/me` returns the user row (no `onboardingCompleted`/`diagnosticCompleted` flag). Onboarding is _inferable_ from `occupation` + `experienceLevel` (both written by `POST /me/onboarding`, both `null` for a fresh user).
- `POST /diagnostic/submit` persists a `diagnostic_attempts` row, but the router only mounts `/questions` and `/submit` — there is no `GET /diagnostic/result`, and `placementReadinessScore` is never written. Verified live: the endpoint answers `404`.

So `resolveEntryRoute()` is:

1. `getMe()` → if `occupation` or `experienceLevel` is missing, `Onboarding` (a fresh user, or someone who skipped onboarding).
2. `getDiagnosticResult()` (the endpoint) → if it returns a result, `DiagnosticResults`.
3. otherwise the locally saved result from `@/storage` (written when the Diagnostic screen submits) → `DiagnosticResults`, else `Onboarding`.

Step 3 is a deviation from the ticket's fallback, agreed with the ticket owner: without it nobody could ever land past Onboarding, because step 2 always returns `null` today. It becomes a no-op the day the backend exposes `GET /diagnostic/result`. Caveat: `signOut` clears the local result, so after an explicit logout a returning user lands on Onboarding — the local copy only survives while the session does.

A returning user lands on `DiagnosticResults` (not `Syllabus`) because that screen renders the saved result without a route param — which is also what makes "reopening the app shows the saved result" visible. The screen's `Start Learning →` button then opens `Syllabus`. Decided with the ticket owner during MOB-12; it replaces MOB-9's original "saved result → Syllabus" behaviour.

Logout:

- `profile-screen.tsx` has the **Log out** button, which calls `signOut()`.
- `signOut` clears the token and the saved diagnostic result and sets `status = "signedOut"`. `RootNavigator` then renders `SignedOutNavigator` in place of `SignedInNavigator`, so Android's back button has nothing to pop into — it exits the app rather than returning to a signed-in screen.
- Logout is also wired to `setOnUnauthorized`, so an expired token lands in the same place.

## Onboarding flow

`src/features/onboarding/components/onboarding-screen.tsx` ports the web's `OnboardingPage`, driven by the same seven steps in `onboarding-data.ts` (`welcome`, two `message`/`project-intro` screens, three `learning` screens, then the final ready message).

- Step content is rendered per `variant`: `welcome` shows the mascot, title and description; `message`/`project-intro` show a speech bubble above the mascot; `learning` shows a left-hand mascot with the question in a speech bubble beside it, then a full-width list of option rows.
- Layout, redesigned to the mocks: the seven step dots sit centred at the top; the `Continue` button is full-width in a footer pinned to the bottom (it drops below the content instead of overlapping it when a step is taller than the screen). `welcome`, `message` and `project-intro` centre their content in the remaining space — on the welcome step that gives the `codelingo` wordmark (36pt, tight tracking) and the `learn to code for real` tagline over the `happy` mascot. The `learning` steps are top-aligned instead: mascot (`happy`, 72pt) + bubble with a left-pointing tail, then the rows, so the question and its answers read like the mock. The `‹ Back` control is positioned absolutely on the left of the dots row so the dots stay centred.
- Option rows (`components/onboarding-option-card.tsx`): one full-width row per option (68pt tall, rounded), emoji on the left and the label in 18pt bold. The selected row fills with `gradients.primary` (the `optionFill` layer behind the text); unselected rows use `surfaceRaised` with a `border` outline.
- Answers live in `OnboardingAnswers` (`{ occupation, experienceLevel, language }`, all `""` initially) and are kept in the screen's state, so stepping back preserves what was picked. Only offered options can be selected — `Continue` stays disabled (and dimmed) until the current step has an answer.
- Java and JavaScript keep their `comingSoon` flag: their rows render at 45% opacity with a `Coming soon` chip on the right and are `disabled`, so they can never be picked.
- `toSaveOnboardingRequest()` in `onboarding-answers.ts` is the only way a payload is built. It checks `occupation` and `experienceLevel` against the option values declared in `onboarding-data.ts`, and requires `language === "PYTHON"`; anything else returns `null` and nothing is sent. This matters because the backend does **not** validate `occupation` — verified live: `POST /me/onboarding` with `occupation: "TEACHER"` answers `200` and stores it, with `language: "JAVA"` and `experienceLevel: "EXPERT"` answer `400`.
- The save runs once, on the final (ready) step, like the web: `"I'm ready — start the test!"` posts `{ occupation, experienceLevel, language }` to `saveOnboarding` and then `navigation.navigate("Diagnostic")`. While it is in flight the button shows its spinner; a `useRef` guard blocks a second submit.
- On failure the screen stays on the final step and shows `We couldn't save your answers. Please try again.` (the web's copy) above the same button, so tapping again retries. The error clears as soon as an answer changes or the step changes.
- Back moves one step, keeping answers. The web has no back control at all, so this is an addition for mobile: a `‹ Back` button in the top row, plus a `BackHandler` listener that maps Android's hardware back to the same move (and falls through to the navigator on the first step). Dots sit in that top row, per the ticket — the web renders them at the bottom of the page.
- The screen has `headerShown: false`, so it pads its own top by `insets.top` and its bottom by `insets.bottom` (so the footer button clears the gesture bar). That needs a `SafeAreaProvider`, which `App.tsx` now wraps the app in.
- Deviations: the web's sparkle accents around the mascot are not drawn, and the active step dot is a 32px `gradients.primary` bar with no width transition.

## Diagnostic quiz

`src/features/diagnostic/components/diagnostic-screen.tsx` replaces the MOB-6 placeholder with the 15-question placement quiz, ported from the web's `DiagnosticPage`. The backend grades it and picks the starting level, so the app only collects answers and shows the response.

- Four states: `loading` (spinner + `Loading questions…`), `error` (`Unable to start the diagnostic` plus the server's `{ error: { message } }` text, or `We could not load the diagnostic. Please try again.`, with a Retry button), `empty` (`No diagnostic questions.` with Retry, shown when the endpoint returns an empty list) and `ready`.
- Retry re-runs `getDiagnosticQuestions()` — the web's `window.location.reload()` is deliberately not ported. It also resets the answers and returns to question 1.
- Loading happens in an effect keyed on a `loadAttempt` counter rather than a callback invoked from the effect body, which keeps the `react-hooks/set-state-in-effect` lint rule happy while giving Retry a single request path.
- One question per screen: the `Question N of 15` label next to a gradient progress bar, a `CONCEPT · DIFFICULTY` line (`formatConceptLabel` + `difficulty.toUpperCase()`), the prompt, and one radio row per option (`accessibilityRole="radio"` inside a `radiogroup`).
- Answers are `DiagnosticAnswers` — an array of `number | null` with one slot per question, in question order (the ticket's shape; the web used a map keyed by question id). Stepping back shows the previous pick and it can be changed.
- `Next →` is disabled until the current question is answered, `Back` is disabled on the first question, and `Finish test` is disabled until every question is answered. That matches the backend, which rejects a partial payload with `400`.
- Finish builds the request with `toSubmitDiagnosticRequest(questions, answers)`: it walks the questions array rather than the tap order, and returns `null` unless every question has an in-range option index, so the submitted order always matches question order. Verified live: a full in-order submit answers `200` with the documented shape, while partial answers, an out-of-range `selectedOptionIndex` and an unknown `questionId` are all rejected with `400`. A `useRef` guard stops a double tap from submitting twice.
- On success the result is written with `setDiagnosticResult` from `@/storage` (MOB-3) before navigating to `DiagnosticResults` with the result as a param — that stored copy is what makes the next launch open `DiagnosticResults` with the saved result (`resolveEntryRoute()` reads it), and it is also what this screen falls back to when no param is passed.
- On failure the screen stays on the final question with every answer intact and shows the inline error above the buttons, so `Finish test` can be pressed again.
- Live shape check: `GET /diagnostic/questions` returns 15 questions (ids `1`–`15`, four options each, difficulties `BEGINNER`/`INTERMEDIATE`/`ADVANCED`, `conceptSlug`s such as `variables-data-types`), and `POST /diagnostic/submit` returns `score`, `totalQuestions`, `percentage`, `level`, `review`, `startingSyllabusLevel` and `breakdown`. Only `level: "BEGINNER"` was observed (the test submissions were mostly wrong); the type also allows `ELEMENTARY`/`INTERMEDIATE`/`ADVANCED`.
- Deviations: the web stacks the primary button above Back on narrow screens, here they sit side by side. The web's `Please select an answer before continuing.` message is unreachable here because Next is already disabled until an answer exists. Android's hardware back leaves the quiz instead of stepping back a question (the web behaves the same way: leaving loses the answers). The page's radial purple background glow is not drawn.
- Supporting files: `diagnostic-session.ts` (the framework-free helpers above), `components/diagnostic-option-row.tsx` (radio row), `components/diagnostic-secondary-button.tsx` (feature-local outlined button — the app has no shared secondary button yet) and `components/diagnostic-quiz-styles.ts`.

## Diagnostic results screen

`src/features/diagnostic/components/diagnostic-results-screen.tsx` ports the web's `ResultsPage`. It makes no API call: it renders what MOB-11 produced.

- The result comes from `route.params.result`. When that is missing it is read from `@/storage` with `getDiagnosticResult()` (MOB-3), showing a spinner while the read is in flight — which is why the route param is typed optional (`{ result?: DiagnosticSubmitResponse } | undefined`).
- If neither source has a result the screen shows its empty state — `Results are not available yet` with a `Take the diagnostic` button that returns to the quiz.
- Score hero: `score / totalQuestions` plus the `percentage`, next to the assigned level badge (`formatLevelLabel(level)` → `Beginner`) and `Recommended start: <title>` when `startingSyllabusLevel` exists. The web's two-column hero is stacked here, with the placement block separated by a top border.
- AI review: the `review` string in its own block. The whole screen is a `ScrollView` and the review is a single wrapping `Text`, so a long multi-line review (the live one is 222 characters with embedded newlines) scrolls instead of clipping.
- Concept breakdown: one row per `breakdown` key via `toBreakdownRows()` — `formatConceptLabel(slug)` uppercased on the left, `correct / total` on the right. Only the object-map shape the backend actually returns (`{ slug: { correct, total } }`) is handled, so the web's `Array.isArray` branch is not ported. Rows keep the backend's order; an empty breakdown renders `No concept breakdown was returned.`
- `Start Learning →` navigates to `Syllabus`. The web also passes a `startingLevel` in route state; `Syllabus` takes no params here, so that was not ported — the syllabus ticket can read `startingSyllabusLevel` from the saved result instead.
- `formatLevelLabel` lives in `@/features/syllabus`: this is the first import from another feature, because the ticket asked for that helper by name. Move it to a shared module if a third feature needs it.
- Deviations: the web's `Start Learning` button is styled as disabled (dimmed, `cursor: not-allowed`) although it is clickable; here it is a normal enabled button, since the ticket asks for it to go to Syllabus. The page's radial purple glow is not drawn.
- Open question resolved: the ticket owner chose to route returning users to this screen, so `resolveEntryRoute()` now answers `DiagnosticResults` when a saved result exists (see "After-login routing and logout"). That makes the param-less path — and therefore the storage fallback — reachable from the UI, while the empty state stays defensive: it only appears if a result is somehow neither passed nor stored.

## Syllabus browser

`src/features/syllabus/components/syllabus-screen.tsx` replaces the MOB-6 placeholder with the level → topic → concept browser, ported from the web's `SyllabusPage`.

- On open it requests `getSyllabus()` (once) and reads `getDiagnosticResult()` from `@/storage` in the same `Promise.all`, before anything is rendered — that is why the star and the initial tab are correct on the first paint instead of flashing in. The payload goes through `extractLevels()`, so both `{ data: [...] }` and a bare array are accepted.
- Four states: `loading` (spinner + `Loading syllabus…`), `error` (`Syllabus unavailable` plus the server's `{ error: { message } }` text, or `We could not load the syllabus right now. Please try again.`, with a Retry button), `empty` (`No syllabus content yet` / `The backend has not published any syllabus levels for this account.`) and `ready`.
- Retry re-runs the request through a `loadAttempt` counter — the web's `window.location.reload()` is deliberately not ported. It resets the level/topic selection.
- Level tabs: a horizontal strip, one pill per level (`number · formatLevelLabel(name)`, `★` when recommended). Tapping a tab always selects it; the web toggled an already-active tab closed, which would leave a phone with no content showing.
- Level card: a `gradients.primary` header with a `LEVEL n` pill, the `Recommended start` badge and the level name, then the description and the topics.
- Topics: a horizontal strip of glyph cards (`getTopicGlyph`), first topic selected by default. The selected topic's detail panel shows its icon, name and the concept list (dot + name), or the topic's description / `Concepts for this topic are coming soon.` when it has no concepts.
- Switching levels or topics only changes state — no request is repeated.
- The web's `START` and `START TOPIC` buttons are not rendered: they do nothing on the web, and the ticket says to hide or disable anything without an action until lessons exist (MOB-B3). The concept list is display-only for the same reason, so no control on the screen is inert.
- The web's sidebar is not ported. Its `LEARN`/`PRACTICE`/`PROJECTS`/`RANKS` items were dead links, so only the `Syllabus` ↔ `Profile` pair survives, as header links (see "Navigation and auth gate"). The decorative mascot in the page corner is not drawn either.
- Recommended level: `resolveRecommendedLevelIndex(levels, result)` matches `startingSyllabusLevel.id` against the level ids first, then falls back to the web's text match (`getDiagnosticLevelText()` — `startingSyllabusLevel.title`, else the diagnostic `level` — compared after `normalizeComparableValue` against each level's `name`, `title`, `description` and `id`), and finally to the first level. With no saved result at all there is no star; the first level is just selected. Verified against live data: the level returned by `POST /diagnostic/submit` resolves by id, by title and by enum level to the same tab.
- Layout deviations from the web: topics sit in a horizontal strip instead of a 270px left column, and the topic detail is a full-width card instead of a 300px panel, because the web's two-column map does not fit a phone.
- Supporting files: `recommendation.ts` (the pure matcher above), `components/syllabus-level-tabs.tsx`, `components/syllabus-level-panel.tsx`, `components/syllabus-topic-strip.tsx`, `components/syllabus-topic-detail.tsx` and `components/syllabus-styles.ts`.

## Profile screen

`src/features/profile/components/profile-screen.tsx` replaces the MOB-6 placeholder with a read-only port of the web's `ProfilePage` (its `Edit` form is not ported — it only ever wrote to the browser's `localStorage`, MOB-B2).

- On open it runs `getMe()` (MOB-2, which unwraps `{ user }`), then the diagnostic result: `getDiagnosticResult()` from `@/api` first, and — because that endpoint does not exist on the backend (verified: `GET /diagnostic/result` → `404`) — `getDiagnosticResult()` from `@/storage` as the fallback, before anything renders. The same fallback the entry route and the syllabus screen already use. Only if both are empty does the screen show its "No diagnostic yet" state.
- Three states: `loading` (spinner + `Loading profile…`), `error` (`Profile unavailable` plus the server's message or `We could not load your profile. Please try again.`, with a Retry button) and `ready`. A failed `getMe()` is an error; a failed diagnostic fetch is not — it just means "no diagnostic".
- Retry re-runs both requests through a `loadAttempt` counter (the web's `window.location.reload()` is not ported); an `isMounted` ref drops the responses of a screen that has already unmounted.
- Header: `Your profile` eyebrow plus `Diagnostic complete — here's what Coda found.` and ` Your path starts now.` (the accent half is a nested `Text`), or `Welcome to your profile` when there is no result.
- Identity card: initials in a `gradients.primary` circle (`getInitials()` → `AL` for an empty name), name, email and a `Python · Beginner` tag (`formatLevelLabel(language)` / `formatLevelLabel(diagnosis.level)`); the score block (`score / scoreTotal`, `diagnostic score`) appears only when there is a result.
- `About You`: `Name`, `Email`, `Language Chosen` (the `PYTHON` enum through `formatLevelLabel`, so the raw enum is never shown) and `Diagnostic Taken` (`n questions` / `Not yet taken`), then `Level Assigned` as a pill (`Pending` without a result). The web's `Occupation` row was dropped: the live account stores a junk enum value, and the onboarding answers are not persisted.
- `Skill Radar`: `react-native-svg` polygons drawn by `components/profile-radar.tsx` from the pure geometry in `radar.ts` — four grid rings, six spokes, the filled data polygon and a dot per axis, with the six labels drawn as `SvgText` inside a padded `viewBox` (`-70 -24 440 348`) so `Functions` / `Data Struct.` / `Exceptions` stay on screen at phone width. Side length is `min(windowWidth - 96, 320)`; the SVG keeps the web's aspect ratio.
- Insight banner: the `C` mark plus `diagnosis.insight`, which `normalizeDiagnosis` fills from `review` (the real payload's field) or falls back to a default line.
- `Concept breakdown from your diagnostic`: one row per concept — name, five progress dots (`score` filled) and a `Strong` / `Developing` / `Weak` pill coloured with `colors.success` / `colors.warning` / `colors.danger`, the web's `#86efac` / `#fde047` / `#fca5a5` mapped onto theme tokens.
- Empty state: `No diagnostic yet` with `Start Diagnostic →`, which navigates to `Diagnostic`. This is the same screen MOB-12's empty state points at, so the two agree.
- `Log out` reuses `useAuth().signOut` (MOB-9). The web's hardcoded `8 XP` badge is not ported: XP does not exist yet (MOB-B4).
- Deviations: the web's `Edit Profile` form, avatar upload and `Check session` button are gone; the page's radial glow is not drawn; the web's two-column (identity + radar) layout is stacked because it does not fit a phone.
- Data shape: `normalizeDiagnosis` accepted only the web's mock (`concepts: [{ name, score, status }]`) and would have produced no concepts from the real response. It now also consumes the verified `POST /diagnostic/submit` shape — each `breakdown` slug becomes a concept named by `formatLevelLabel(slug)` (`variables-data-types` → `Variables Data Types`), scored `round(correct / total * 5)` clamped to `0–5` and labelled `Strong` (≥ 4) / `Developing` (≥ 2) / `Weak`, with `scoreTotal`/`questionsAnswered` from `totalQuestions` and the insight from `review`.
- Radar axis matching: `resolveRadarAxes()` maps the six fixed `radarAxisOrder` axes onto concept names, whole-word and punctuation-insensitive, then by exact label. Only `Variables`, `Loops` and `OOP` can match the real 15-slug breakdown; `Functions`, `Data Struct.` and `Exceptions` have no corresponding slug, so those axes read `0`. The web's substring match was tightened to whole words because `"loops".includes("oop")` is true, which fed the `Loops` score into the `OOP` axis.
- Supporting files: `radar.ts` (pure geometry + axis matching), `components/profile-radar.tsx`, `components/profile-concept-list.tsx`, `components/profile-styles.ts`.

## Shared types and helpers

`src/features` holds the framework-free code ported from the web app's feature folders. Every feature re-exports its public surface from its own `index.ts`:

| Import                  | Exports                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@/features/auth`       | `validate`, `RegisterInput`, `RegisterErrors`, `initialRegisterInput` (web: `initialInput`)                                                                                                                                                                                                                  |
| `@/features/onboarding` | `onboardingData`, `OnboardingStep`, `OnboardingOption`, `OnboardingAnswers`, `OnboardingAnswerKey`, `initialOnboardingAnswers`, `isOnboardingOptionValue`, `toSaveOnboardingRequest`                                                                                                                         |
| `@/features/diagnostic` | `DiagnosticLevel`, `DiagnosticSubmitResponse`, `DiagnosticBreakdown`, `formatConceptLabel`, `DiagnosticAnswers`, `createDiagnosticAnswers`, `setAnswerAt`, `getSelectedOption`, `areAllQuestionsAnswered`, `getProgressPercentage`, `toSubmitDiagnosticRequest`, `DiagnosticBreakdownRow`, `toBreakdownRows` |

| `@/features/syllabus` | `SyllabusLevel`, `SyllabusTopic`, `SyllabusConcept`, `DiagnosticStartingLevel`, `DiagnosticLikeResult`, `normalizeLevel`, `normalizeTopic`, `normalizeConcept`, `extractLevels`, `normalizeComparableValue`, `formatLevelLabel`, `getTopicGlyph`, `getDiagnosticStartingLevelText`, `getDiagnosticLevelText`, `resolveRecommendedLevelIndex` |
| `@/features/profile` | `ProfileData`, `Diagnosis`, `DiagnosisConcept`, `languageOptions`, `radarAxisOrder`, `getInitials`, `normalizeConceptStatus`, `clampConceptScore`, `getConceptStatusFromScore`, `normalizeDiagnosis`, `RadarAxisValue`, `RadarPoint`, `RadarLabelAnchor`, `RADAR_GRID_SCALES`, `RADAR_MIN_RADIUS`, `RADAR_MAX_RADIUS`, `RADAR_LABEL_RADIUS`, `RADAR_CENTER`, `RADAR_VIEW_BOX`, `RADAR_ASPECT_RATIO`, `resolveRadarAxes`, `getRadarRadius`, `getRadarPoint`, `getRadarPolygonPoints`, `getRadarLabelPlacement` |

Porting notes:

- `src/api` stays the owner of the wire shapes. `DiagnosticSubmitResponse` and `DiagnosticBreakdown` are re-exported from `@/features/diagnostic/types` rather than redeclared, so each payload has a single definition.
- `extractLevels` takes a raw `getSyllabus()` result (the `{ data: [...] }` wrapper is unwrapped) and runs it through the web's tolerant normalizers, which produce the `SyllabusLevel` / `SyllabusTopic` / `SyllabusConcept` UI shape. Ids stay `string | number` because the backend returns cuid strings while the web also tolerated numbers; the web's `startingSyllabusLevel.id: number` was widened to `string | number` to match the verified response.
- `normalizeDiagnosis`, `getInitials`, `normalizeConceptStatus`, `radarAxisOrder` and `languageOptions` were extracted out of the web's `profile-page.tsx`. `languageOptions` lives in `@/features/profile`, not in the register form. MOB-14 added `radar.ts` (the web kept its radar maths inline in the page) and extended `normalizeDiagnosis` for the real `breakdown` shape.
- Onboarding copy lives in `src/features/onboarding/onboarding-data.ts` (web: `src/mocks/onboarding-data.ts`) so it sits behind a feature barrel like everything else.
- These modules are pure — no React, Expo, axios, `window`, `document` or `localStorage`. The web's `readSavedResult` is replaced by `src/storage/diagnostic-storage.ts`, and the web's `readStartingLevelName` is ported as `getDiagnosticStartingLevelText` in `recommendation.ts`.
- Behaviour was checked with throwaway Node + esbuild harnesses (`C:\Users\SIMI\AppData\Local\Temp\opencode`: MOB-10 onboarding, MOB-11 quiz, MOB-12 results + entry route, MOB-13 syllabus/recommendation — 45 checks including a live `GET /api/syllabus` + `POST /diagnostic/submit` reconciliation; MOB-14 profile/radar — 75 checks including a live `GET /auth/me` and the `GET /diagnostic/result` → `404` check; MOB-15 end-to-end — 46 checks over the whole register→logout request sequence plus the 10-check entry-route rerun, see "Verifying the whole path"). There is no test runner in the project yet — run `npx expo install --dev jest-expo jest` if you want these to live in the repo.

## Verifying the whole path

The flow is `register → login → onboarding → diagnostic → results → syllabus → profile → logout`. What is verified automatically, against the running backend, is the request sequence every screen makes — a throwaway MOB-15 harness (`C:\Users\SIMI\AppData\Local\Temp\opencode\mob15`) drives the real modules (`@/api`, `@/features/onboarding`, `@/features/diagnostic`, `@/features/profile`, `@/features/syllabus`) through the flow: register, wrong password (`401 Invalid credentials`), login, `setToken` + `getMe`, onboarding (`language` is `null` before it and `PYTHON` after), the 15 questions, a full submit, `normalizeDiagnosis` + `resolveRadarAxes` on the live result, the syllabus (4 levels), `GET /diagnostic/result` → `null`, a bad token (401 → the auth gate is notified once and the token is cleared) and a no-response network error (the screen falls back to its own copy instead of crashing). 46/46 checks pass; the entry-route harness (reopen → `Onboarding` / `DiagnosticResults`) passes 10/10.

### Manual pass on a device

Still to be run on a real phone or emulator — open the app in Expo Go on the same network as the backend and walk through:

1. **Register** a new account → success banner → Login.
2. **Login with a wrong password** → inline error, no crash.
3. **Login** correctly → Onboarding.
4. **Onboarding** — all three steps, `Coming soon` options inert, hardware back returns to the previous step.
5. **Diagnostic** — answer all 15, progress bar reaches 100%; kill the app mid-quiz and reopen → Onboarding (quiz progress is deliberately not persisted).
6. **Results** — score, level, review, breakdown; `Start Learning →` opens the syllabus.
7. **Syllabus** — level tabs, topics, the `★ Recommended start` on the level the diagnostic returned; stop the backend and Retry shows the error state.
8. **Profile** — initials, name, email, `Python · <level>`, skill radar with all six labels on screen, insight, concept breakdown.
9. **Logout** → Login; reopen the app → Login (the token is gone).
10. **Network off on a loading screen** (Syllabus or Profile — both fetch on mount) → error card with Retry, not a spinner that never ends.
11. **Kill and reopen while signed in** → straight to `DiagnosticResults` from the saved result, not Onboarding.

Anything that fails is a bug for the ticket that owns that screen; so far the pass above has needed no code change.

## Known gaps

Recorded rather than hidden. None of these break the flow above; the backend items are written up in `docs/backend-work.md` for the backend owner.

| Gap                                                            | Why                                                                                | Tracked as              |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------- |
| Quiz progress is lost if the app is killed mid-diagnostic      | only the submitted result is stored; there is no draft key                         | by design               |
| Profile is read-only — no edit form                            | no profile-update endpoint; the web's form only wrote to `localStorage`            | MOB-B2 (profile update) |
| No XP, streak or rank badges                                   | no XP/progress endpoints; the web's `8 XP` badge is hardcoded                      | MOB-B4 (XP/progress)    |
| `START` / `START TOPIC` are not rendered                       | lessons do not exist, so the buttons had no action                                 | MOB-B3 (lessons)        |
| Three of the six radar axes can never score                    | the fixed `radarAxisOrder` labels do not match the 15 backend `conceptSlug`s       | `docs/backend-work.md`  |
| Only Python is offered                                         | `saveOnboarding` rejects other languages; the rest are `Coming soon` options       | `docs/backend-work.md`  |
| `GET /diagnostic/result` does not exist (404)                  | the client reads the locally saved result instead, so a reinstall loses it         | `docs/backend-work.md`  |
| `Occupation` is not shown on Profile                           | the live account stores a junk enum value, and onboarding answers are not returned | `docs/backend-work.md`  |
| No custom font                                                 | the web uses `Avenir Next`/`Segoe UI`; bundling one needs `expo-font` + an asset   | styling ticket          |
| `MascotGallery` is unreachable from the app                    | kept as a dev screen to check the assets                                           | by design               |
| The web's radial page glow and mascot corner art are not drawn | decorative, and the web's two-column layouts do not fit a phone                    | by design               |

## Scripts

```bash
npx expo start      # dev server
npx tsc --noEmit    # typecheck
npx expo lint       # lint
npx prettier --write .
```
