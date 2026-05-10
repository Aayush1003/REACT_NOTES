# Solutions — React Fundamentals Exercises

This file contains complete example solutions for the exercises in `basics/exercises.md`.

---

## 1) Greeting (Greeting.jsx)
```jsx
import React from 'react';

export default function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```
Usage (App.jsx):
```jsx
import React from 'react';
import Greeting from './Greeting';

export default function App() {
  return <Greeting name="Alex" />;
}
```

---

## 2) Counter (Counter.jsx)
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

---

## 3) Todo List (TodoList.jsx)
```jsx
import React, { useState } from 'react';

function TodoItem({ item, onToggle, onRemove }) {
  return (
    <li>
      <label style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
        <input type="checkbox" checked={item.done} onChange={() => onToggle(item.id)} />
        {item.text}
      </label>
      <button onClick={() => onRemove(item.id)} aria-label={`Remove ${item.text}`}>x</button>
    </li>
  );
}

export default function TodoList() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  function addItem(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const newItem = { id: Date.now(), text: text.trim(), done: false };
    setItems(prev => [newItem, ...prev]);
    setText('');
  }
  function toggle(id) {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, done: !it.done } : it)));
  }
  function remove(id) {
    setItems(prev => prev.filter(it => it.id !== id));
  }

  return (
    <div>
      <form onSubmit={addItem}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map(item => (
          <TodoItem key={item.id} item={item} onToggle={toggle} onRemove={remove} />
        ))}
      </ul>
    </div>
  );
}
```

---

## 4) Profile (Profile.jsx) — conditional UI & loading/error
```jsx
import React, { useState, useEffect } from 'react';

export default function Profile({ userId = 1 }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => { if (!cancelled) setUser(data); })
      .catch(err => { if (!cancelled) setError(err.message || 'Error'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <div>Loading profile…</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.company?.name}</p>
    </div>
  );
}
```

---

## 5) Fetch data with `useEffect` (PostsList.jsx)
```jsx
import React, { useState, useEffect } from 'react';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/posts', { signal: ac.signal })
      .then(r => r.json())
      .then(data => setPosts(data.slice(0, 10)))
      .catch(err => { if (err.name !== 'AbortError') setError(err.message || 'Error'); })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  if (loading) return <div>Loading posts…</div>;
  if (error) return <div>Error: {error}</div>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

---

## 6) Controlled Form (SignupForm.jsx)
```jsx
import React, { useState } from 'react';

export default function SignupForm() {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});

  function validate(vals) {
    const e = {};
    if (!vals.name.trim()) e.name = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(vals.email)) e.email = 'Valid email required';
    if (vals.password.length < 6) e.password = 'Password min 6 characters';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate(values);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setErrors({});
    setSubmitted(values);
  }

  function onChange(e) { setValues(prev => ({ ...prev, [e.target.name]: e.target.value })); }

  if (submitted) {
    return <div>Thanks, {submitted.name}! Your email: {submitted.email}</div>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label>Name <input name="name" value={values.name} onChange={onChange} /></label>
        {errors.name && <div style={{color:'red'}}>{errors.name}</div>}
      </div>
      <div>
        <label>Email <input name="email" value={values.email} onChange={onChange} /></label>
        {errors.email && <div style={{color:'red'}}>{errors.email}</div>}
      </div>
      <div>
        <label>Password <input name="password" type="password" value={values.password} onChange={onChange} /></label>
        {errors.password && <div style={{color:'red'}}>{errors.password}</div>}
      </div>
      <button type="submit">Sign up</button>
    </form>
  );
}
```

---

## 7) `useRef` DOM focus (FocusInput.jsx)
```jsx
import React, { useRef, useEffect } from 'react';

export default function FocusInput() {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  return (
    <div>
      <input ref={inputRef} placeholder="Auto-focused" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </div>
  );
}
```

---

## 8) Theme Context (Theme.jsx)
```jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }

export function ThemedBox() {
  const { theme, toggle } = useTheme();
  return (
    <div style={{ padding: 20, background: theme === 'dark' ? '#222' : '#eee', color: theme === 'dark' ? '#fff' : '#000' }}>
      <p>Current theme: {theme}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```
Usage (App.jsx):
```jsx
import React from 'react';
import { ThemeProvider, ThemedBox } from './Theme';

export default function App() {
  return (
    <ThemeProvider>
      <ThemedBox />
    </ThemeProvider>
  );
}
```

---

## 9) Custom hook `useFetch` (useFetch.js)
```jsx
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    const ac = new AbortController();
    setState({ data: null, loading: true, error: null });
    fetch(url, { signal: ac.signal })
      .then(r => { if (!r.ok) throw new Error('Network error'); return r.json(); })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => { if (err.name === 'AbortError') return; setState({ data: null, loading: false, error: err.message || 'Error' }); });
    return () => ac.abort();
  }, [url]);
  return state;
}

// Example usage:
// const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/posts');
```

---

## 10) `useReducer` Todo (ReducerTodo.jsx)
```jsx
import React, { useReducer, useState } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'add': return [...state, action.payload];
    case 'toggle': return state.map(t => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'remove': return state.filter(t => t.id !== action.id);
    default: return state;
  }
}

export default function ReducerTodo() {
  const [text, setText] = useState('');
  const [todos, dispatch] = useReducer(reducer, []);
  function add(e) {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: 'add', payload: { id: Date.now(), text: text.trim(), done: false } });
    setText('');
  }
  return (
    <div>
      <form onSubmit={add}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="New todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <label style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
              <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: 'toggle', id: t.id })} />
              {t.text}
            </label>
            <button onClick={() => dispatch({ type: 'remove', id: t.id })}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 11) Performance: memoize list items (BigList.jsx)
```jsx
import React, { useMemo } from 'react';

const Item = React.memo(function Item({ value }) {
  // Simulate expensive render or complex child
  return <li>{value}</li>;
});

export default function BigList({ items }) {
  const list = useMemo(() => items.map((i, idx) => `${i} #${idx}`), [items]);
  return <ul>{list.map((v, i) => <Item key={i} value={v} />)}</ul>;
}

// For very large lists use react-window/react-virtualized for virtualization.
```

---

## 12) Routing basics (AppRouter.jsx)
```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() { return <div><h1>Home</h1><p>Welcome</p></div>; }
function About() { return <div><h1>About</h1><p>About page</p></div>; }

export default function AppRouter() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Notes
- Split components into separate files in a real project.
- Use meaningful names and keep components small.
- For server requests prefer using data libraries (React Query) for caching and retries.

---

If you want, I can also add a runnable example project scaffold (Vite) that includes these components and a small `package.json` with quick start instructions.