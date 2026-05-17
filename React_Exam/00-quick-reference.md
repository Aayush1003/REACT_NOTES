# Quick Reference Guide

Fast lookup for React syntax and patterns.

---

## Imports

```jsx
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback, useReducer } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
```

---

## Components

```jsx
// Function Component
function Welcome() {
  return <h1>Hello</h1>;
}

// Arrow Function Component
const Welcome = () => <h1>Hello</h1>;

// With Props
function Greeting({ name, age }) {
  return <h1>Hello {name}, age {age}</h1>;
}

// With Default Props
function Button({ label = 'Click me' }) {
  return <button>{label}</button>;
}

// Children
function Card({ children, title }) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

---

## State & Hooks

```jsx
// useState
const [count, setCount] = useState(0);
const [state, setState] = useState(() => initialValue);

// useEffect
useEffect(() => {
  // Runs after every render
}, );

useEffect(() => {
  // Runs once on mount
}, []);

useEffect(() => {
  // Runs when deps change
}, [dependency1, dependency2]);

// useRef
const inputRef = useRef(null);
const countRef = useRef(0);

// useContext
const theme = useContext(ThemeContext);

// useMemo
const expensiveValue = useMemo(() => heavyComputation(), [deps]);

// useCallback
const memoizedFunc = useCallback(() => doSomething(), [deps]);

// useReducer
const [state, dispatch] = useReducer(reducer, initialState);
```

---

## JSX Syntax

```jsx
// Expressions
<div>{variable}</div>
<div>{condition ? 'true' : 'false'}</div>
<div>{condition && <Component />}</div>

// Attributes
<button className="btn" id="submit" disabled={false}>
<input type="text" value={value} onChange={handleChange} />
<img src={imagePath} alt="description" />

// Events
<button onClick={handleClick}>Click</button>
<input onChange={(e) => setValue(e.target.value)} />
<form onSubmit={(e) => { e.preventDefault(); /* ... */ }}>

// Children
<Component>
  <h1>Child content</h1>
</Component>

// Fragment
<>
  <h1>Title</h1>
  <p>Content</p>
</>

// Lists
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

---

## Form Patterns

```jsx
// Text Input
<input value={name} onChange={(e) => setName(e.target.value)} />

// Checkbox
<input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />

// Radio
<input type="radio" name="group" value="opt1" checked={selected === 'opt1'} onChange={(e) => setSelected(e.target.value)} />

// Select
<select value={country} onChange={(e) => setCountry(e.target.value)}>
  <option value="us">USA</option>
  <option value="uk">UK</option>
</select>

// Textarea
<textarea value={text} onChange={(e) => setText(e.target.value)} />

// Submit
<form onSubmit={(e) => { e.preventDefault(); /* handle */ }}>
  {/* fields */}
  <button type="submit">Submit</button>
</form>
```

---

## Conditionals

```jsx
// If/Else
{condition ? <ComponentA /> : <ComponentB />}

// Logical AND
{condition && <Component />}

// Multiple conditions
{status === 'loading' && <LoadingSpinner />}
{status === 'error' && <ErrorMessage />}
{status === 'success' && <SuccessMessage />}

// Switch-like pattern
{(() => {
  switch (status) {
    case 'loading': return <LoadingSpinner />;
    case 'error': return <ErrorMessage />;
    default: return <SuccessMessage />;
  }
})()}
```

---

## Lists & Keys

```jsx
// Simple list
{items.map((item, index) => <div key={item.id}>{item.name}</div>)}

// Add item
setItems([...items, newItem]);

// Remove item
setItems(items.filter(item => item.id !== idToRemove));

// Update item
setItems(items.map(item => item.id === idToUpdate ? { ...item, updated: true } : item));
```

---

## Context

```jsx
// Create
const MyContext = createContext();

// Provider
<MyContext.Provider value={contextValue}>
  <App />
</MyContext.Provider>

// Consumer (useContext)
const value = useContext(MyContext);
```

---

## Custom Hook

```jsx
function useMyHook(initialValue) {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);
  
  return [state, setState];
}

// Usage
const [value, setValue] = useMyHook(0);
```

---

## Common Patterns

### Controlled Component

```jsx
const [value, setValue] = useState('');
return <input value={value} onChange={(e) => setValue(e.target.value)} />;
```

### Loading State

```jsx
const [loading, setLoading] = useState(false);
useEffect(() => {
  setLoading(true);
  fetch('/api/data').then(() => setLoading(false));
}, []);

return loading ? <Spinner /> : <Content />;
```

### Error Handling

```jsx
const [error, setError] = useState(null);
useEffect(() => {
  fetch('/api/data')
    .catch(err => setError(err.message));
}, []);

return error ? <ErrorMessage msg={error} /> : <Content />;
```

### Debounce

```jsx
const [searchTerm, setSearchTerm] = useState('');
const [debouncedTerm, setDebouncedTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

---

## Performance

```jsx
// Memoize component
export default React.memo(Component);

// Memoize value
const value = useMemo(() => expensiveComputation(), [deps]);

// Memoize function
const callback = useCallback(() => doSomething(), [deps]);

// Lazy load component
const Component = lazy(() => import('./Component'));
<Suspense fallback={<Loading />}>
  <Component />
</Suspense>
```

---

## Styling

```jsx
// Inline styles (object)
<div style={{ color: 'red', fontSize: '16px' }}>Text</div>

// CSS Classes
<div className="container">Text</div>

// Conditional classes
<div className={`btn ${isActive ? 'active' : ''}`}>Button</div>

// CSS Modules
import styles from './Component.module.css';
<div className={styles.container}>Text</div>

// Styled Components
import styled from 'styled-components';
const StyledDiv = styled.div`
  color: red;
  font-size: 16px;
`;
```

---

## Common Array Methods

```jsx
// Map
array.map(item => item.name)

// Filter
array.filter(item => item.active)

// Find
array.find(item => item.id === 5)

// Some
array.some(item => item.active)

// Every
array.every(item => item.complete)

// Reduce
array.reduce((acc, item) => acc + item.value, 0)

// Includes
array.includes(value)

// Spread
[...array, newItem]
[...array.slice(0, 1), newItem, ...array.slice(1)]
```

---

## Object Updates

```jsx
// Update property
{ ...obj, name: 'new name' }

// Update nested property
{ ...obj, user: { ...obj.user, age: 30 } }

// Delete property
const { unwantedProp, ...rest } = obj;

// Merge objects
{ ...obj1, ...obj2 }
```

---

## Debugging

```jsx
// Console log
console.log('value:', value);

// Breakpoint
debugger;

// React DevTools
// In browser: F12 → React tab

// Profiler
<Profiler id="name" onRender={callback}>
  <Component />
</Profiler>
```

---

## Common Props & Events

```jsx
// Event object
(e) => {
  e.target.value      // Input value
  e.target.checked    // Checkbox checked
  e.preventDefault()   // Stop default behavior
  e.stopPropagation() // Stop bubble up
}

// Common events
onClick, onChange, onSubmit, onFocus, onBlur, onMouseEnter, onMouseLeave, onKeyDown
```

---

**Print this for quick reference!**
