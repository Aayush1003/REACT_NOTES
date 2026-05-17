# Module 8: React Best Practices & Patterns

Proven patterns and best practices for professional React development.

---

## Component Design Principles

### Single Responsibility Principle

Each component should do **one thing well**:

```jsx
// ❌ BAD: Too many responsibilities
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // ... 300 lines of code
}

// ✅ GOOD: Separated concerns
function UserProfile({ userId }) {
  const user = useUser(userId);
  return <UserCard user={user} />;
}

function UserCard({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  return isEditing ? <EditForm user={user} /> : <ViewProfile user={user} />;
}
```

### Keep Components Small

- **Target**: 100-300 lines per component
- If a component is longer, break it into smaller ones
- Use custom hooks to extract logic

### Name Components Descriptively

```jsx
// ❌ BAD
function Card({ data }) { /* ... */ }

// ✅ GOOD
function UserProfileCard({ user }) { /* ... */ }
function ProductListItem({ product, onDelete }) { /* ... */ }
```

---

## State Management Best Practices

### Lift State When Needed

Share state between siblings by moving it to parent:

```jsx
// ❌ BAD: State in both siblings
function Left({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}

function Right({ value }) {
  return <p>{value}</p>;
}

// ✅ GOOD: State in parent
function Parent() {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <Left value={value} onChange={(e) => setValue(e.target.value)} />
      <Right value={value} />
    </div>
  );
}
```

### Use Context for Deeply Nested Props

```jsx
// ❌ BAD: Prop drilling
function App() {
  const [theme, setTheme] = useState('light');
  return <Level1 theme={theme} />;
}

function Level1({ theme }) {
  return <Level2 theme={theme} />;
}

function Level2({ theme }) {
  return <Level3 theme={theme} />;
}

// ✅ GOOD: Use Context
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Level1 />
    </ThemeContext.Provider>
  );
}

function Level3() {
  const { theme } = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

### useState vs useReducer

- **useState**: Simple state, few updates
- **useReducer**: Complex state, many related updates

```jsx
// ✅ Good choice for useState
const [count, setCount] = useState(0);

// ✅ Good choice for useReducer
const [state, dispatch] = useReducer(reducer, initialState);
```

---

## Hooks Best Practices

### Rules of Hooks

1. **Only call hooks at top level** (not in loops, conditions, nested functions)
2. **Only call hooks from React functions** (components or custom hooks)
3. **Use ESLint plugin** `eslint-plugin-react-hooks`

```jsx
// ❌ WRONG: Hook in condition
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(0);
  }
}

// ✅ RIGHT: Hook at top level
function Component({ condition }) {
  const [state, setState] = useState(0);
}
```

### Extract Custom Hooks

Move reusable hook logic into custom hooks:

```jsx
// ❌ BAD: Logic repeated in multiple components
function ComponentA() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);
  return <div>{data}</div>;
}

// ✅ GOOD: Custom hook
function useFetchData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  return data;
}

function ComponentA() {
  const data = useFetchData('/api/data');
  return <div>{data}</div>;
}
```

### useEffect Dependencies Matter

```jsx
// ❌ WRONG: Missing dependency (stale closure)
function Component({ userId }) {
  useEffect(() => {
    fetch(`/api/users/${userId}`);
  }, []); // userId not included!
}

// ✅ CORRECT: Include all dependencies
function Component({ userId }) {
  useEffect(() => {
    fetch(`/api/users/${userId}`);
  }, [userId]);
}

// ✅ CORRECT: Deliberately empty (runs once)
function Component() {
  useEffect(() => {
    console.log('Mounted');
  }, []);
}
```

---

## Error Handling

### Error Boundaries (Class Components Only)

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Try-Catch for Async Code

```jsx
function Component() {
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchData();
  }, []);
  
  if (error) return <div>Error: {error}</div>;
  return <div>Content</div>;
}
```

---

## Testing Best Practices

### Test User Behavior, Not Implementation

```jsx
// ❌ BAD: Testing implementation details
test('increment count state', () => {
  const { getByText } = render(<Counter />);
  // Testing internal state is fragile
});

// ✅ GOOD: Testing user behavior
test('increments count when button is clicked', () => {
  const { getByText, getByRole } = render(<Counter />);
  const button = getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  expect(getByText(/count: 1/i)).toBeInTheDocument();
});
```

### Test with React Testing Library

```jsx
import { render, screen, fireEvent } from '@testing-library/react';

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

test('button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button', { name: /click me/i });
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

## Accessibility (a11y)

### Semantic HTML

```jsx
// ❌ BAD: Non-semantic
<div onClick={handleClick}>Button</div>

// ✅ GOOD: Semantic
<button onClick={handleClick}>Button</button>
```

### ARIA Labels

```jsx
// ❌ BAD: No label
<button onClick={toggleMenu}>☰</button>

// ✅ GOOD: Labeled
<button onClick={toggleMenu} aria-label="Open menu">
  ☰
</button>
```

### Keyboard Navigation

```jsx
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setIsOpen(false);
  };
  
  return (
    <div onKeyDown={handleKeyDown}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
      {isOpen && <MenuItems />}
    </div>
  );
}
```

---

## Performance Best Practices

### Profile Before Optimizing

```jsx
// Use React DevTools Profiler to identify bottlenecks
// Don't prematurely optimize
```

### Avoid Creating Objects in Render

```jsx
// ❌ BAD: New object every render
function Component() {
  return <Child style={{ color: 'red' }} />;
}

// ✅ GOOD: Stable object
const STYLE = { color: 'red' };
function Component() {
  return <Child style={STYLE} />;
}
```

### Use Keys Correctly in Lists

```jsx
// ❌ BAD: Index as key
{items.map((item, i) => <Item key={i} {...item} />)}

// ✅ GOOD: Unique ID
{items.map(item => <Item key={item.id} {...item} />)}
```

---

## Naming Conventions

### File Structure

```
src/
  components/
    Button/
      Button.jsx
      Button.css
      Button.test.jsx
    Card/
      Card.jsx
      Card.css
  hooks/
    useFetch.js
  pages/
    Home.jsx
    About.jsx
  services/
    api.js
```

### Naming Rules

- **Components**: PascalCase (`Button.jsx`, `UserProfile.jsx`)
- **Files/Folders**: kebab-case or PascalCase (match component name)
- **Variables/Functions**: camelCase (`handleClick`, `userData`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)
- **Custom Hooks**: Start with `use` (`useFetch`, `useAuth`)

---

## Code Organization

### Feature-Based Structure

```
src/
  features/
    auth/
      components/
      hooks/
      services/
    products/
      components/
      hooks/
      services/
    shared/
      components/
      hooks/
```

### Keep Related Code Together

```jsx
// ✅ GOOD: Component, styles, tests in same folder
components/
  Button/
    Button.jsx
    Button.css
    Button.test.jsx
```

---

## Debugging Tips

### Use React DevTools

1. Install React Developer Tools browser extension
2. Inspect component props and state
3. Trace component updates
4. Use Profiler tab

### Console Debugging

```jsx
function Component({ data }) {
  useEffect(() => {
    console.log('Data updated:', data);
  }, [data]);
  
  console.log('Rendering with:', data);
  return <div>{data}</div>;
}
```

### Breakpoints in DevTools

```jsx
function Component() {
  const [count, setCount] = useState(0);
  
  return (
    <button
      onClick={() => {
        debugger; // DevTools pauses here
        setCount(count + 1);
      }}
    >
      Click {count}
    </button>
  );
}
```

---

## Summary of Best Practices

✅ Keep components small and focused (SRP)  
✅ Extract reusable logic into custom hooks  
✅ Lift state when multiple components need it  
✅ Use Context for deeply nested props  
✅ Follow Rules of Hooks strictly  
✅ Use semantic HTML for accessibility  
✅ Test user behavior, not implementation  
✅ Profile before optimizing  
✅ Use proper naming conventions  
✅ Organize code by feature  
✅ Handle errors gracefully  
✅ Keep dependency arrays accurate  

---

**End of Module 8**: You've covered all essential React concepts!
