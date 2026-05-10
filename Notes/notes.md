# Detailed React Notes

A compact but thorough set of notes covering practical React concepts, patterns, and examples. Use this as your daily reference while building apps.

---

## Purpose & Scope

These notes collect pragmatic details beyond the basics: common patterns, hook behaviours, data-fetching strategies, performance tips, testing pointers, and useful commands. They are opinionated but practical — adapt them to your projects.

## Quick Start

Prerequisites:
- Node.js (LTS)
- A package manager: `npm`, `yarn`, or `pnpm`

Create a minimal app with Vite:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

Useful npm scripts (Vite):
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally

Environment variables:
- Prefix environment variables with `VITE_` to expose them to client code (e.g. `VITE_API_URL`).

---

## Recommended Project Structure

src/
- components/ — small, reusable UI components
- hooks/ — custom hooks (useFetch, useForm)
- pages/ or views/ — route-level components
- services/ — API helpers, data layer
- context/ — React Context providers
- styles/ — global styles or CSS variables
- utils/ — small pure utilities
- App.jsx, main.jsx

Keep components small and colocate styles when it helps clarity.

---

## JSX & Rendering Details

- JSX is sugar for `React.createElement` — expressions live inside `{}`.
- Use fragments (`<>...</>`) to avoid extra DOM nodes.
- Prefer explicit `null` over `false` when intentionally rendering nothing.
- Children: `props.children` may be any renderable value; validate with PropTypes or TypeScript where useful.

---

## Components: Function vs Class

Function components (preferred):
- Simpler syntax, hooks support, easier testing.
- Use arrow or named function declarations.

Class components (older):
- Still required for Error Boundaries (until React supports functional error boundaries).
- Use sparingly.

Naming:
- Components should start with uppercase letters.
- File names: `PascalCase.jsx` for components.

---

## Props & State (practical)

- Props are immutable inside the receiving component; treat them as read-only.
- Do not copy props into state unless you intentionally want to create a controlled snapshot.
- When deriving values from props, compute them in render or via `useMemo` if expensive.

useState tips:
- Use functional updates when new state depends on previous state: `setValue(v => v + 1)`.
- Lazy initializers: `useState(() => computeHeavyDefault())`.

Avoid unnecessary state:
- If a value can be computed from props/state, prefer computing it instead of duplicating.

---

## Hooks — deeper notes

useEffect:
- Runs after render. The second arg (dependency array) controls when it runs.
- Common pattern: cleanup via return function to avoid memory leaks (timers, subscriptions).
- Pitfall: stale closures — when effect reads outdated values. Use refs or include values in deps.
- ESLint plugin `react-hooks/exhaustive-deps` helps keep deps correct.

useRef:
- `useRef()` returns a stable object `{ current }` — great for DOM refs and mutable values that persist across renders without causing re-renders.
- Do not use refs to hold component "state" that affects rendering.

useMemo vs useCallback:
- `useMemo` memoizes a computed value: `const memo = useMemo(() => compute(x), [x]);`
- `useCallback` memoizes a function reference: `const cb = useCallback(() => doSomething(x), [x]);`
- Only use them to avoid expensive re-computations or to stabilize function identity when passing to memoized children.

useReducer:
- Prefer for complex state logic or when next state depends on previous in non-trivial ways.
- Often paired with Context to build small state stores.

Rules of hooks:
- Call hooks only at the top-level of React function components and custom hooks.
- Hooks must be called in the same order on every render.

Custom hooks:
- Name them `useSomething`.
- Keep them focused and reusable; they can combine multiple hooks.

Other hooks:
- `useLayoutEffect` runs before browser paint — use for measuring DOM/layout.
- `useImperativeHandle` for controlling instance values with `forwardRef`.

---

## Data Fetching & Side Effects

Patterns:
- Simple fetch in `useEffect` for component-level fetches — remember `AbortController` for cleanup.
- Centralize API calls in `services/` and wrap fetch logic with small custom hooks (`useFetch`, `usePosts`).

Production-ready approach:
- Use React Query (TanStack Query) or SWR for caching, retries, background refetching, and simplified loading/error states.

Example: `useFetch` pattern (simplified)

```jsx
useEffect(() => {
  const ac = new AbortController();
  fetch(url, { signal: ac.signal })
    .then(r => r.json())
    .then(setData)
    .catch(handleErr);
  return () => ac.abort();
}, [url]);
```

Error handling:
- Surface errors to the UI; avoid silent failures.
- Show loading, empty, error states clearly.

---

## State Management Strategies

- Local component state: for UI concerns and ephemeral state.
- Context: good for app-wide but low-frequency updates (theme, locale, auth).
- Context + `useReducer`: simple global store for medium apps.
- Redux / Zustand / MobX: consider when you need predictable, testable flows or fine-grained performance control.

Guideline:
- Start with local state; only escalate to global solutions when patterns clearly benefit.

---

## Performance & Optimization

When to optimize:
- Measure first — use React Profiler to identify bottlenecks.

Common strategies:
- Avoid re-render cascades: break components into smaller pieces.
- `React.memo` to memoize pure functional components.
- Memoize expensive computed values with `useMemo`.
- Memoize callbacks passed to children with `useCallback`.
- Virtualize large lists with `react-window` or `react-virtualized`.
- Code-splitting: `React.lazy()` + `<Suspense>` for large components.

React 18+ features:
- `startTransition` and `useTransition` for marking updates as non-urgent.
- `useDeferredValue` for deferring expensive values.
- `useId` for stable ids in SSR + hydration.

Pitfalls:
- Overusing memoization can add complexity; memoize only after identifying issues.

---

## Accessibility (A11y)

- Prefer semantic HTML: `<button>`, `<main>`, `<nav>`, `<form>`.
- Ensure keyboard accessibility: tabbable elements, visible focus states.
- Label form controls with `<label>` or `aria-label` when necessary.
- Use roles and ARIA attributes sparingly and correctly.
- Test with screen readers and keyboard-only navigation.

---

## Testing

Unit & component tests:
- Use Jest + React Testing Library (RTL): test behavior, not implementation.
- Prefer queries like `getByRole`, `getByLabelText`.

Testing hooks:
- Use `@testing-library/react-hooks` or `renderHook` utilities.

E2E tests:
- Use Cypress, Playwright, or Playwright Test for critical user flows.

Example (RTL):

```jsx
import { render, screen } from '@testing-library/react';
render(<Greeting name="Alex"/>);
expect(screen.getByRole('heading')).toHaveTextContent('Hello, Alex');
```

---

## Styling Approaches

Options:
- Global CSS + modules: simple and predictable.
- CSS Modules: component-scoped CSS (`Component.module.css`).
- Tailwind CSS: utility-first approach for rapid UIs.
- styled-components / emotion: CSS-in-JS for dynamic styling.

Tip: choose one approach consistently across a project.

---

## Debugging Tools

- React DevTools — inspect component tree, props, hooks, and profiler.
- Browser devtools network tab for API checks.
- Console logging with clear labels.
- `why-did-you-render` to detect unnecessary renders (development only).

---

## Build, Deployment & Environment

- For SPAs use Vite/CRA; for SSR/SSG use Next.js.
- Typical commands:

```bash
npm run dev
npm run build
npm run preview
```

- Hosting: Vercel, Netlify, or static hosting for SPA.
- Keep secrets out of client bundles; use server-side envs for sensitive values.

---

## Best Practices Checklist

- Keep components small and focused.
- Prefer composition (children/props) over prop drilling.
- Keep side effects isolated and cleaned up.
- Use TypeScript or PropTypes for contracts.
- Add tests for critical logic and UI flows.
- Document major architectural decisions in the repo.

---

## Useful Commands & Packages

- Create Vite app: `npm create vite@latest my-app -- --template react`
- Add router: `npm install react-router-dom`
- Add React Query: `npm install @tanstack/react-query`
- Dev server: `npm run dev`  — Build: `npm run build`

ESLint + Prettier starter packages (example):
```
npm install -D eslint prettier eslint-plugin-react eslint-config-prettier
```

---

## Short Examples

useEffect + fetch with AbortController:

```jsx
useEffect(() => {
  const ac = new AbortController();
  fetch(url, { signal: ac.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => { if (err.name !== 'AbortError') setError(err); });
  return () => ac.abort();
}, [url]);
```

Custom `useToggle` hook:

```jsx
import { useState, useCallback } from 'react';
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(v => !v), []);
  return [on, toggle];
}
```

---

## Further Reading

- Official React docs: https://reactjs.org
- Hooks guide: https://reactjs.org/docs/hooks-intro.html
- React Query: https://tanstack.com/query/latest
- React Router: https://reactrouter.com

---

If you'd like, I can:
- Split this file into topic files under `Notes/` (hooks.md, performance.md, testing.md),
- Add runnable example projects (Vite) with these components, or
- Link `Notes/notes.md` from the main `README.md`.

Tell me which you'd prefer next.
