# React Fundamentals — Exercises

Practical exercises to reinforce the core React concepts from `README.md`.

How to use:
- Create a small project (Vite recommended) or add files to an existing folder.
- Try each exercise, then check the hints/solutions below.

---

## Warm-up

1) Greeting component (Easy)
- Build `Greeting` that accepts a `name` prop and renders "Hello, {name}".
- Goal: JSX, props, simple function component.

2) Counter (Easy)
- Build `Counter` using `useState` with increment/decrement buttons.
- Goal: local state and event handlers.

3) Todo list (Easy → Medium)
- Create `TodoList` and `TodoItem` components. Add items via an input.
- Goal: lists, keys, controlled input.

---

## Intermediate

4) Conditional UI & Loading states (Medium)
- Create `Profile` that shows loading, error, or user data.
- Goal: conditional rendering and managing async states.

5) Fetch data with `useEffect` (Medium)
- Fetch a JSON resource (e.g., `https://jsonplaceholder.typicode.com/posts`) and render titles.
- Goal: side effects, cleanup, dependency array.

6) Controlled Form (Medium)
- Build a signup form (name, email, password) that validates and shows a summary on submit.
- Goal: controlled inputs and form handling.

7) `useRef` DOM focus (Medium)
- Auto-focus an input on mount and add a "Focus" button.
- Goal: `useRef` for DOM access.

---

## Advanced

8) Theme Context (Medium → Advanced)
- Create `ThemeContext` with `Provider` and a toggle; consume in nested components.
- Goal: Context API and avoiding prop drilling.

9) Custom hook `useFetch` (Advanced)
- Write `useFetch(url)` that returns `{ data, loading, error }` and handles cancellation.
- Goal: custom hooks and reusable logic.

10) `useReducer` Todo (Advanced)
- Manage a todo list with `useReducer` (add, toggle, remove).
- Goal: reducer pattern for complex state.

11) Performance optimization (Advanced)
- Optimize a component that renders a large list using `React.memo`, `useMemo`, or virtualization.
- Goal: reduce unnecessary renders.

12) Routing basics (Easy → Medium)
- Create two routes (`/` and `/about`) using `react-router` and navigate between them.
- Goal: client-side routing.

---

## Hints & Solutions (selected)

### 1) Greeting — Solution
```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

### 2) Counter — Solution
```jsx
import React, { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <span style={{ margin: '0 8px' }}>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

### 5) Fetch data example
```jsx
import React, { useState, useEffect } from 'react';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(r => r.json())
      .then(data => { if (mounted) setPosts(data.slice(0,10)); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

### 9) `useFetch` (hint)
- Use `useEffect` for the fetch and `AbortController` to cancel.
- Return `{ data, loading, error }` and memoize when needed.

### 10) `useReducer` (skeleton)
```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.payload];
    case 'toggle':
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    default:
      return state;
  }
}
```

---

If you want full solutions for every exercise, I can add a `basics/solutions.md` with complete code samples.
Full solutions are now available in `solutions.md`: see [basics/solutions.md](basics/solutions.md)
