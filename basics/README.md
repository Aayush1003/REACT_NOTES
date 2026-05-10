# React Fundamentals — Essentials

A concise, well-organized summary of core React concepts to use as a quick reference while learning or building apps.

---

## Purpose

Collect the fundamental concepts, patterns, and best practices of React in one readable file. Use this as a checklist while studying or as a reference while coding.

## Core Principles

- Declarative UI: describe what the UI should look like for a given state.
- Component-based: build UIs from small, reusable pieces (components).
- Unidirectional data flow: data flows down via props; state drives UI.
- Composition over inheritance: compose components rather than extend.

## Quick Setup

- Node.js + package manager (npm / yarn / pnpm)
- Starter tools: Vite (recommended), Create React App, Next.js (for SSR / full-stack)

## JSX

- JSX looks like HTML but is JavaScript.
- Expressions inside JSX use `{}`.

Example:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

## Components

- Function components (prefer): simple functions that return JSX.
- Class components: legacy; still used for error boundaries and lifecycle examples.
- Components must start with an uppercase letter.

Function component example:

```jsx
function Counter() {
  return <div>Count</div>;
}
```

Class component example:

```jsx
class Counter extends React.Component {
  render() {
    return <div>Count</div>;
  }
}
```

## Props

- Props are read-only inputs to components.
- Use props to configure or pass data/handlers down the tree.

```jsx
<MyButton disabled={isSaving} onClick={handleSave} />
```

## State

- State holds data that changes over time inside a component.
- useState for local state in function components.

```jsx
const [count, setCount] = useState(0);
```

## Lifecycle vs Hooks

Class lifecycle (common):
- constructor -> componentDidMount -> componentDidUpdate -> componentWillUnmount

Hook equivalents (function components):
- `useEffect(() => { ... }, [])` -> componentDidMount
- `useEffect(() => { ... }, [deps])` -> componentDidUpdate for deps
- Cleanup function in `useEffect` -> componentWillUnmount

## Rules of Hooks

- Call hooks only at the top level of React function components or custom hooks.
- Call hooks only from React function components or custom hooks.

## Common Hooks (brief)

- `useState(initial)` — local state.
- `useEffect(fn, deps)` — side effects and subscriptions.
- `useRef()` — mutable ref container for DOM or values.
- `useContext(Context)` — read context value.
- `useReducer(reducer, init)` — alternative to complex state logic.
- `useMemo(() => value, deps)` — memoize expensive values.
- `useCallback(fn, deps)` — memoize callbacks.
- `useLayoutEffect(...)` — runs before paint (rare).

Example: state + effect

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{seconds}s</div>;
}
```

## Event Handling

- Use camelCase names: `onClick`, `onChange`.
- Pass function references: `<button onClick={handleClick}>`.
- Event is a SyntheticEvent — similar to DOM events.

## Conditional Rendering

- Ternary: `{isLoggedIn ? <Profile /> : <Login />}`
- Short-circuit: `{items.length && <List items={items} />}` (careful with 0)

## Lists & Keys

- Use `key` prop to help React identify items.
- Avoid using array index as key unless list is static.

```jsx
items.map(item => <li key={item.id}>{item.text}</li>)
```

## Forms

- Controlled components: React state drives input value (`value` + `onChange`).
- Uncontrolled components: ref-based access when you don't need controlled behavior.

Controlled input example:

```jsx
function NameInput() {
  const [name, setName] = useState('');
  return (
    <input value={name} onChange={e => setName(e.target.value)} />
  );
}
```

## Lifting State Up & Composition

- Lift shared state to nearest common ancestor and pass via props.
- Prefer composing components (children, props) rather than global state for everything.

## Context API

- Use for global-like data: theme, auth, locale.
- Create a context and provide value at a high level.

```jsx
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

## Refs & Portals

- `useRef` to access DOM nodes or persist mutable values.
- `createPortal(children, container)` to render outside parent DOM hierarchy.

## Error Boundaries

- Error boundaries use class components with `componentDidCatch`.
- They catch render/lifecycle errors in descendant tree.

## Patterns (older & current)

- HOCs and render props are patterns for reuse — hooks are preferred now.
- Custom hooks encapsulate reusable logic.

## Performance

- Avoid unnecessary re-renders: `React.memo`, `useMemo`, `useCallback`.
- Code splitting: `React.lazy()` + `<Suspense>` to load components on demand.
- Virtualization for long lists (react-window, react-virtualized).

## Routing

- Use `react-router` (v6) for client-side routing: `<BrowserRouter>`, `<Routes>`, `<Route>`.

## State Management Patterns

- Local component state for UI details.
- Context + useReducer for app-wide state without external libs.
- Redux / Zustand / MobX for complex global state needs.
- React Query / SWR for server-state and caching.

## Data Fetching Best Practices

- Fetch in `useEffect` or via data libraries (React Query) for caching and background updates.
- Handle loading, error, and success states explicitly.
- Use `AbortController` to cancel fetches on unmount.

## Testing

- Use Jest + React Testing Library for component tests.
- Test behavior over implementation details; prefer queries like `getByRole`.

## Accessibility (A11y)

- Use semantic HTML (`button`, `form`, `header`, etc.).
- Ensure keyboard navigation and focus management.
- Use `aria-*` attributes when necessary; avoid using them as a substitute for semantics.

## Styling

- Options: plain CSS, CSS Modules, Tailwind CSS, styled-components, emotion.
- Keep styles co-located with components when it improves maintainability.

## Build & Deployment

- Use Vite / CRA for SPA; Next.js for SSR/SSG.
- Common hosts: Vercel, Netlify, GitHub Pages.

## Best Practices

- Keep components small and focused (single responsibility).
- Prefer composition and props over global state.
- Use descriptive names and consistent file structure.
- Type-check with TypeScript or `prop-types`.
- Avoid heavy computations in render; memoize when necessary.
- Keep effects idempotent and cleanup subscriptions.

## Quick Example (function component with state + effect)

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/data')
      .then(r => r.json())
      .then(d => { if (!cancelled) setData(d); });
    return () => { cancelled = true; };
  }, []);
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

## Resources

- Official docs: https://reactjs.org
- Hooks guide: https://reactjs.org/docs/hooks-intro.html
- React Router: https://reactrouter.com
- React Query: https://tanstack.com/query/latest

---

If you want, I can expand any section with examples, diagrams, or add a separate `basics/exercises.md` with practice tasks. Full solutions for the exercises are available in `solutions.md`: [basics/solutions.md](basics/solutions.md)
