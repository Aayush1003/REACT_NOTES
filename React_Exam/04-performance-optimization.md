# Module 4: Performance & Optimization

Complete guide to optimizing React application performance.

---

## React Rendering Cycle

### How React Renders

1. **Trigger**: State changes, props changes, or context changes trigger a render
2. **Render**: React calls component function and builds Virtual DOM
3. **Commit**: React updates DOM for changes (reconciliation)
4. **Effects**: useEffect cleanup and setup runs after commit

### Rendering vs Mounting

- **Mount**: Component first appears in DOM (runs effects once)
- **Update**: Component re-renders due to state/props changes
- **Unmount**: Component removed from DOM (cleanup runs)

```jsx
function Component() {
  useEffect(() => {
    console.log('Mounted or updated');
    
    return () => {
      console.log('Cleanup before unmount or next effect');
    };
  }, [/* dependencies */]);
  
  return <div>Component</div>;
}
```

---

## Memoization: Preventing Unnecessary Renders

### React.memo (Memoize Component)

Prevent a component from re-rendering if props haven't changed:

```jsx
function Item({ name, onDelete }) {
  console.log('Item rendered:', name);
  return (
    <div>
      {name}
      <button onClick={() => onDelete(name)}>Delete</button>
    </div>
  );
}

// Without memo: Item re-renders every time parent updates
// With memo: Item only re-renders if name or onDelete changes
export default React.memo(Item);
```

### Problem: Function Props Break Memoization

```jsx
function Parent() {
  // ❌ BAD: handleDelete is new every render
  const handleDelete = (name) => {
    console.log('Deleting:', name);
  };
  
  return (
    <Item name="Product" onDelete={handleDelete} />
  );
}

// Item re-renders every time because handleDelete is new!
```

### Solution: useCallback

```jsx
import { useCallback } from 'react';

function Parent() {
  // ✅ GOOD: handleDelete reference is stable
  const handleDelete = useCallback((name) => {
    console.log('Deleting:', name);
  }, []); // No dependencies
  
  return (
    <Item name="Product" onDelete={handleDelete} />
  );
}

// Item only re-renders if name actually changes
```

### useMemo: Memoize Values

Prevent expensive computations from running on every render:

```jsx
function UserList({ users, filter }) {
  // ❌ BAD: Filters on every render
  const filteredUsers = users.filter(user =>
    user.name.includes(filter)
  );
  
  // ✅ GOOD: Only filters when users or filter changes
  const filteredUsers = useMemo(() => {
    return users.filter(user => user.name.includes(filter));
  }, [users, filter]);
  
  return (
    <div>
      {filteredUsers.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
}
```

### When to Use Memoization

```jsx
// ✅ GOOD USE CASES:
// - Expensive computations (sorting, filtering large lists)
// - Preventing child re-renders
// - Stabilizing function references for dependency arrays

// ❌ AVOID:
// - Simple computations (adding numbers, string concatenation)
// - Primitive values (numbers, strings)
// - Memoizing everything (adds overhead)

// Rule of thumb: Only memoize if you can measure performance benefit
```

---

## Code Splitting & Lazy Loading

### React.lazy (Lazy Load Components)

Load components only when needed:

```jsx
import { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Route-Based Splitting

```jsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

## List Virtualization (For Large Lists)

When rendering thousands of items, virtualization only renders visible items:

```jsx
// Using react-window library
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

## Keys & Reconciliation

### Why Keys Matter

Keys help React identify which items have changed. Bad keys cause bugs:

```jsx
// ❌ BAD: Using array index as key (breaks with dynamic lists)
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo.text}</li>
      ))}
    </ul>
  );
}

// When items are reordered, inputs get scrambled!

// ✅ GOOD: Using unique ID
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

---

## Profiling & Measuring Performance

### React DevTools Profiler

1. Open React DevTools in your browser
2. Go to Profiler tab
3. Click record and interact with your app
4. Analyze which components took longest to render

### Measuring with Performance API

```jsx
function MeasurePerformance() {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Component took ${endTime - startTime}ms to render`);
    };
  }, []);
  
  return <div>Component</div>;
}
```

### React.Profiler Component

```jsx
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <YourComponent />
    </Profiler>
  );
}
```

---

## Common Performance Pitfalls

### Creating Functions in Render

```jsx
// ❌ BAD: Function created on every render
function Component() {
  return (
    <button onClick={() => console.log('clicked')}>
      Click me
    </button>
  );
}

// ✅ GOOD: Function defined outside
function Component() {
  const handleClick = () => console.log('clicked');
  return <button onClick={handleClick}>Click me</button>;
}
```

### Creating Objects in Render

```jsx
// ❌ BAD: Object created on every render
function Component() {
  const style = { color: 'red', fontSize: '16px' };
  return <div style={style}>Text</div>;
}

// ✅ GOOD: Define outside or use useMemo
const STYLE = { color: 'red', fontSize: '16px' };

function Component() {
  return <div style={STYLE}>Text</div>;
}
```

### Not Using Dependencies Correctly

```jsx
// ❌ BAD: Missing dependencies
function Component() {
  const handleFetch = async () => {
    const data = await fetch('/api/data?id=' + id);
  };
  
  useEffect(() => {
    handleFetch();
  }, []); // Missing 'id' in dependencies!
}

// ✅ GOOD: Include all dependencies
function Component({ id }) {
  useEffect(() => {
    const handleFetch = async () => {
      const data = await fetch('/api/data?id=' + id);
    };
    handleFetch();
  }, [id]); // Include 'id'
}
```

---

## Bundle Size Optimization

### Analyze Bundle

```bash
npm install --save-dev source-map-explorer
```

```json
{
  "scripts": {
    "analyze": "source-map-explorer 'build/static/js/*.js'"
  }
}
```

### Dynamic Imports

```jsx
// ❌ BAD: Imports everything upfront
import * as chart from 'heavy-chart-library';

// ✅ GOOD: Import only when needed
const chart = await import('heavy-chart-library');
```

---

## Server-Side Rendering (SSR) Basics

For large-scale apps, consider SSR for better initial load:

```jsx
// SSR Example with Next.js
export default function Page() {
  return <div>Server-rendered content</div>;
}

export async function getServerSideProps() {
  const data = await fetch('https://api.example.com/data');
  return { props: { data } };
}
```

---

## Performance Checklist

✅ **Code Splitting**: Use lazy loading for routes  
✅ **Memoization**: Use React.memo, useMemo, useCallback where needed  
✅ **Keys**: Always use unique, stable keys in lists  
✅ **Dependencies**: Keep useEffect and hook dependencies accurate  
✅ **Profiling**: Measure before optimizing  
✅ **Bundle Size**: Monitor and reduce bundle size  
✅ **Virtual Lists**: Use virtualization for large lists  
✅ **Image Optimization**: Use appropriate image sizes and formats  

---

## Summary

- React rendering can be optimized through memoization
- Code splitting and lazy loading reduce initial bundle size
- Keys help React efficiently reconcile lists
- Profiling tools help identify performance bottlenecks
- Common pitfalls like creating new objects/functions per render should be avoided

---

**Next Steps:** Move to Module 5 to learn about Styling in React.
