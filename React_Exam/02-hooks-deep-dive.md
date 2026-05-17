# Module 2: Hooks Deep Dive

Complete guide to React Hooks — the foundation of modern React development.

---

## What are Hooks?

Hooks are **functions that let you "hook into" React features** in function components. They were introduced in React 16.8 and allow you to use state, effects, and other features without class components.

### Rules of Hooks (Critical!)

1. **Only call hooks at the top level** — not inside loops, conditions, or nested functions.
2. **Only call hooks from React components** — not from regular JavaScript functions.
3. **Use ESLint plugin** `react-hooks/exhaustive-deps` to catch mistakes.

```jsx
// ❌ BAD: Hook inside condition
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // ❌ WRONG
  }
}

// ✅ GOOD: Hook at top level
function Component({ condition }) {
  const [state, setState] = useState(0); // ✅ CORRECT
}

// ❌ BAD: Hook inside loop
function Component() {
  for (let i = 0; i < 10; i++) {
    const [state, setState] = useState(0); // ❌ WRONG
  }
}

// ✅ GOOD: Multiple hooks at top level (separate variables)
function Component() {
  const [state1, setState1] = useState(0);
  const [state2, setState2] = useState(0);
  // ...
}
```

---

## useState Hook

Adds state to function components.

### Basic Usage

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Understanding useState

```jsx
const [state, setState] = useState(initialValue);
```

- **state**: Current state value
- **setState**: Function to update state
- **initialValue**: Value on first render (can be a function)
- **Returns**: Array with [currentState, updateFunction]

### State Updates

```jsx
// Direct update
setCount(5);

// Functional update (when depending on previous state)
setCount(prev => prev + 1);

// Multiple updates in one handler
const handleMultipleUpdates = () => {
  setCount(prev => prev + 1);
  setName('New Name');
};
```

### Lazy Initialization

For expensive computations, use a function to initialize state:

```jsx
function Component() {
  // Function only runs on initial render, not on every update
  const [items, setItems] = useState(() => {
    console.log('Initializing expensive computation...');
    return computeInitialList(); // Only called once
  });
  
  return <div>{items.length}</div>;
}
```

### Updating Objects and Arrays

Always create new references to trigger updates:

```jsx
// Update object
const [user, setUser] = useState({ name: 'Alice', age: 25 });

setUser({
  ...user,
  age: 26,
});

// Update nested object
setUser({
  ...user,
  address: {
    ...user.address,
    city: 'New York',
  },
});

// Update array - add item
const [items, setItems] = useState(['a', 'b', 'c']);
setItems([...items, 'd']); // Add to end
setItems(['z', ...items]); // Add to start

// Update array - remove item
setItems(items.filter(item => item !== 'b'));

// Update array - update item
setItems(items.map(item => 
  item === 'a' ? 'A' : item
));

// Update array - insert at index
const index = 1;
setItems([...items.slice(0, index), 'new', ...items.slice(index)]);
```

### Multiple State Variables

```jsx
function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // API call
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

## useEffect Hook

Performs side effects in function components (data fetching, subscriptions, DOM manipulation).

### Basic Usage

```jsx
import { useEffect, useState } from 'react';

function Component() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // This code runs after every render
    console.log('Effect ran');
  });
  
  return <div>{data}</div>;
}
```

### Dependency Array

Controls **when** the effect runs:

```jsx
// ✅ Runs after every render
useEffect(() => {
  console.log('Ran');
});

// ✅ Runs only once (on mount)
useEffect(() => {
  console.log('Mounted');
}, []);

// ✅ Runs when count changes
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);

// ✅ Runs when count OR name changes
useEffect(() => {
  console.log('Count or name changed');
}, [count, name]);
```

### Cleanup Function

Return a function to clean up side effects:

```jsx
function Component() {
  useEffect(() => {
    // Setup
    const timer = setTimeout(() => {
      console.log('Timer fired');
    }, 1000);
    
    // Cleanup (prevent memory leaks)
    return () => {
      clearTimeout(timer);
      console.log('Cleaned up');
    };
  }, []); // Only cleanup once on unmount
  
  return <div>Component</div>;
}
```

### Data Fetching Pattern

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [userId]); // Re-fetch when userId changes
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return <div>{user.name}</div>;
}
```

### Common Patterns

**Subscription setup and cleanup:**

```jsx
useEffect(() => {
  const unsubscribe = subscribe(data => {
    setData(data);
  });
  
  return () => unsubscribe(); // Cleanup subscription
}, []);
```

**DOM measurement:**

```jsx
const [height, setHeight] = useState(0);

useEffect(() => {
  const element = document.getElementById('myElement');
  setHeight(element?.offsetHeight || 0);
}, []); // Measure once
```

### Effect Dependency Best Practices

```jsx
// ❌ BAD: Missing dependency
function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId); // userId used but not in deps
  }, []); // Will use stale userId!
}

// ✅ GOOD: Include all dependencies
function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId);
  }, [userId]); // userId included
}

// ✅ GOOD: Move function outside or use useCallback
function Component() {
  const fetchData = useCallback(() => {
    fetch('/api/data');
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
}
```

---

## useRef Hook

Access DOM elements directly or keep mutable values between renders.

### Focus Input

```jsx
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus input</button>
    </>
  );
}
```

### Store Mutable Value

Unlike state, updating ref doesn't trigger a re-render:

```jsx
function Stopwatch() {
  const intervalRef = useRef(null);
  
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      // Timer logic
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };
  
  return (
    <>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </>
  );
}
```

### Keep Previous Value

```jsx
function Component({ value }) {
  const prevValueRef = useRef();
  
  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);
  
  return (
    <div>
      Now: {value}, Before: {prevValueRef.current}
    </div>
  );
}
```

---

## useContext Hook

Access context values without nesting.

### Basic Usage

```jsx
import { createContext, useContext } from 'react';

// Create context
const ThemeContext = createContext('light');

// Provider
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
    </ThemeContext.Provider>
  );
}

// Consumer with useContext
function Header() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Header</div>;
}
```

### Context with State

```jsx
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    checkAuth().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  const value = { user, loading };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Usage
function Profile() {
  const { user, loading } = useAuth();
  
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

---

## useMemo Hook

Memoize expensive computations.

### Basic Usage

```jsx
import { useMemo } from 'react';

function Component({ items }) {
  // Only recompute when items changes
  const sortedItems = useMemo(() => {
    console.log('Sorting...');
    return [...items].sort();
  }, [items]);
  
  return <div>{sortedItems.join(', ')}</div>;
}
```

### When to Use

```jsx
// GOOD: Expensive computation
const largeList = useMemo(() => {
  return items.filter(item => item.price > 100).sort(...);
}, [items]);

// GOOD: Prevents child re-render
const config = useMemo(() => ({ theme: 'dark' }), []);
<Child config={config} />; // Child only re-renders if config changes

// AVOID: Simple computations (overhead > benefit)
const doubled = useMemo(() => count * 2, [count]); // Use direct computation
```

---

## useCallback Hook

Memoize function definitions.

### Basic Usage

```jsx
import { useCallback } from 'react';

function Component() {
  const [count, setCount] = useState(0);
  
  // Function reference stays same unless dependencies change
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  
  return <Button onClick={handleClick} />;
}
```

### Prevent Child Re-renders

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ BAD: handleClick is new on every render
  const handleClick = () => setCount(count + 1);
  
  return <Child onClick={handleClick} />;
}

function Parent() {
  const [count, setCount] = useState(0);
  
  // ✅ GOOD: handleClick reference is stable
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  
  return <Child onClick={handleClick} />;
}

// Child only re-renders when onClick changes
const Child = React.memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
});
```

---

## useReducer Hook

Manage complex state logic with a reducer function.

### Basic Usage

```jsx
import { useReducer } from 'react';

function Counter() {
  const initialState = { count: 0 };
  
  function reducer(state, action) {
    switch (action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      case 'DECREMENT':
        return { count: state.count - 1 };
      case 'RESET':
        return { count: 0 };
      default:
        return state;
    }
  }
  
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

### Complex State Example

```jsx
const initialState = {
  items: [],
  loading: false,
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, items: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}

function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    fetch('/api/items')
      .then(res => res.json())
      .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(err => dispatch({ type: 'FETCH_ERROR', payload: err.message }));
  }, []);
  
  return (
    <div>
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      {state.items.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
}
```

---

## Custom Hooks

Create reusable hook logic.

### Basic Custom Hook

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => {
        setError(err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function User({ id }) {
  const { data: user, loading, error } = useFetch(`/api/users/${id}`);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return <div>{user.name}</div>;
}
```

### useLocalStorage Hook

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage
function Preferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### useDebounce Hook

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetch(`/api/users?q=${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search users..."
    />
  );
}
```

---

## Summary

| Hook | Purpose |
|------|---------|
| `useState` | Add state to function components |
| `useEffect` | Perform side effects (fetch, subscribe) |
| `useRef` | Access DOM elements or keep mutable values |
| `useContext` | Access context values |
| `useMemo` | Memoize expensive computations |
| `useCallback` | Memoize function definitions |
| `useReducer` | Manage complex state logic |
| Custom Hooks | Extract and reuse component logic |

---

**Next Steps:** Move to Module 3 to learn about Forms and User Input.
