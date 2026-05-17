# Module 1: React Fundamentals

Complete guide to React basics, components, JSX, props, and state.

---

## What is React?

React is a **JavaScript library for building user interfaces** using components. Key characteristics:

- **Component-Based**: UI is built from reusable, composable pieces.
- **Declarative**: You describe what the UI should look like; React handles updates.
- **Virtual DOM**: React optimizes updates by diffing virtual representations.
- **Unidirectional Data Flow**: Data flows from parent to child via props.
- **Efficient Updates**: Only necessary DOM elements are updated (diffing algorithm).

### React Philosophy

- "Just JavaScript" — React extends JavaScript, not replace it.
- Separation of Concerns by Component — not by technology.
- Single Responsibility Principle — each component does one thing well.

---

## JSX: JavaScript Syntax Extension

JSX allows you to write HTML-like syntax in JavaScript. It's **transpiled to `React.createElement()` calls**.

### JSX Syntax Rules

```jsx
// Basic JSX
const element = <h1>Hello, World!</h1>;

// Expressions inside {}
const name = 'Alice';
const greeting = <h1>Hello, {name}!</h1>;

// Attributes
const button = <button className="btn" onClick={handleClick}>Click</button>;

// Children
const card = (
  <div className="card">
    <h2>Title</h2>
    <p>Content here</p>
  </div>
);

// Fragments (no wrapper div)
const items = (
  <>
    <li>Item 1</li>
    <li>Item 2</li>
  </>
);

// Conditional rendering
const element = condition ? <div>True</div> : <div>False</div>;
const element2 = condition && <div>Rendered if true</div>;

// Lists with .map()
const items = [1, 2, 3];
const list = (
  <ul>
    {items.map(item => <li key={item}>{item}</li>)}
  </ul>
);
```

### Important JSX Rules

1. **Single Root**: A component must return a single root element (use fragments if needed).
2. **className instead of class**: `className="btn"` not `class="btn"`.
3. **Close all tags**: Self-closing tags must have `/` (e.g., `<img />`).
4. **camelCase attributes**: `onClick`, `onChange`, `onSubmit` (not `onclick`).
5. **No JavaScript keywords as prop names**: Use `htmlFor` instead of `for`.

---

## Components: The Building Blocks

### Function Components (Preferred)

Modern React development uses **function components** with hooks.

```jsx
// Simple component
function Welcome() {
  return <h1>Hello, React!</h1>;
}

// With props
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Arrow function
const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

// Export
export default Welcome;
```

### Class Components (Legacy)

Still used for Error Boundaries. Not recommended for new code.

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### Component Naming Conventions

- **Always PascalCase**: `MyComponent`, not `myComponent`.
- **File names**: `MyComponent.jsx` or `MyComponent.js`.
- **Folder structure**: One component per folder or file.

```
components/
  Button/
    Button.jsx
    Button.css
  Card/
    Card.jsx
```

---

## Props: Passing Data to Components

Props are immutable arguments passed from parent to child.

### Destructuring Props

```jsx
// Using destructuring (recommended)
function UserCard({ name, age, email }) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

// Usage
<UserCard name="Alice" age={25} email="alice@example.com" />
```

### Default Props

```jsx
function Welcome({ name = 'Guest', greeting = 'Hello' }) {
  return <h1>{greeting}, {name}!</h1>;
}

// Or using defaultProps
Welcome.defaultProps = {
  name: 'Guest',
  greeting: 'Hello'
};
```

### Prop Spreading

```jsx
function Card(props) {
  return <div className="card" {...props} />;
}

// Can pass all props at once
<Card title="Title" description="Desc" color="blue" />
```

### Props Validation (PropTypes)

```jsx
import PropTypes from 'prop-types';

function UserCard({ name, age, email, isActive }) {
  return <div>{name} - {age}</div>;
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string,
  isActive: PropTypes.bool
};

export default UserCard;
```

---

## State: Making Components Interactive

State allows components to manage and update their own data.

### useState Hook

The most common way to add state to function components:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Multiple State Variables

```jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
    </div>
  );
}
```

### Functional State Updates

Use functional updates when new state depends on the previous state:

```jsx
// BAD: Can lead to stale state
setCount(count + 1);
setCount(count + 1); // Only increments once!

// GOOD: Using functional update
setCount(prev => prev + 1);
setCount(prev => prev + 1); // Correctly increments twice
```

### Lazy Initialization

For expensive computations, use a function:

```jsx
// Expensive computation only runs once
const [items, setItems] = useState(() => {
  return computeExpensiveList();
});
```

### Updating Objects in State

Always create a new object, don't mutate:

```jsx
const [user, setUser] = useState({ name: 'Alice', age: 25 });

// BAD: Mutation
user.age = 26; // ❌ Don't do this

// GOOD: Spread operator
setUser({ ...user, age: 26 }); // ✅ Correct

// GOOD: Nested update
setUser({
  ...user,
  address: {
    ...user.address,
    city: 'New York'
  }
});
```

### Updating Arrays in State

```jsx
const [items, setItems] = useState(['a', 'b', 'c']);

// Add item
setItems([...items, 'd']);

// Remove item
setItems(items.filter(item => item !== 'a'));

// Update item
setItems(items.map(item => item === 'b' ? 'B' : item));

// Insert at position
setItems([...items.slice(0, 1), 'new', ...items.slice(1)]);
```

---

## Rendering Conditional Content

### if/else Logic

```jsx
function UserStatus({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please log in</h1>;
}
```

### Ternary Operator

```jsx
<h1>{isLoggedIn ? 'Welcome back!' : 'Please log in'}</h1>
```

### Logical AND (&&)

```jsx
// Render only if condition is true
{hasNotifications && <Notification />}
```

### Multiple Conditions

```jsx
function Status({ status }) {
  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'success' && <p>Success!</p>}
      {status === 'error' && <p>An error occurred</p>}
    </div>
  );
}
```

---

## Lists and Keys

### Rendering Lists

```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Key Importance

- **Keys help React identify items** that have changed, been added, or removed.
- Always use **unique, stable identifiers** (usually from data).
- **Never use array index as key** in dynamic lists.

```jsx
// BAD: Index as key (causes bugs in dynamic lists)
items.map((item, index) => <li key={index}>{item}</li>)

// GOOD: Unique ID
items.map(item => <li key={item.id}>{item.name}</li>)

// GOOD: Unique generated ID (if data has no ID)
items.map(item => <li key={`${item.name}-${item.id}`}>{item.name}</li>)
```

---

## Event Handling

### Event Listeners

```jsx
function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click me</button>;
}

// With arrow function (inline)
<button onClick={() => handleClick('param')}>Click</button>

// Prevent default
<a href="#" onClick={(e) => {
  e.preventDefault();
  // ...
}}>
  Link
</a>
```

### Common Events

```jsx
<input onChange={(e) => setName(e.target.value)} />
<input onFocus={() => console.log('focused')} />
<input onBlur={() => console.log('blurred')} />
<form onSubmit={(e) => { e.preventDefault(); /* ... */ }} />
<div onMouseEnter={() => {}} onMouseLeave={() => {}} />
<input onKeyDown={(e) => e.key === 'Enter' && submit()} />
```

### Synthetic Events

React uses synthetic events (cross-browser wrapper). Access native event if needed:

```jsx
const handleClick = (e) => {
  console.log(e.nativeEvent); // Access native DOM event
};
```

---

## Children: Composition Pattern

### Using props.children

```jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Usage
<Card title="My Card">
  <p>This is card content</p>
  <button>Action</button>
</Card>
```

### Forwarding Children

```jsx
function Button({ children, variant = 'primary' }) {
  return (
    <button className={`btn btn-${variant}`}>
      {children}
    </button>
  );
}

<Button variant="secondary">
  Click me
</Button>
```

---

## Common Mistakes to Avoid

1. **Mutating State Directly**
   ```jsx
   // ❌ BAD
   state.name = 'new name';
   
   // ✅ GOOD
   setState({ ...state, name: 'new name' });
   ```

2. **Not Using Keys in Lists**
   ```jsx
   // ❌ BAD
   {items.map((item, i) => <li key={i}>{item}</li>)}
   
   // ✅ GOOD
   {items.map(item => <li key={item.id}>{item}</li>)}
   ```

3. **Missing Return in Render**
   ```jsx
   // ❌ BAD
   function Component() {
     <div>Hello</div>; // Returns undefined
   }
   
   // ✅ GOOD
   function Component() {
     return <div>Hello</div>;
   }
   ```

4. **Calling State Setter in Render**
   ```jsx
   // ❌ BAD (infinite loop)
   function Component() {
     const [count, setCount] = useState(0);
     setCount(count + 1); // Runs on every render!
     return <div>{count}</div>;
   }
   
   // ✅ GOOD (use event or effect)
   function Component() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(count + 1)}>{count}</button>;
   }
   ```

---

## Summary

- **Components** are reusable building blocks of React apps
- **Props** pass data from parent to child (read-only)
- **State** allows components to manage their own data (mutable via setState)
- **JSX** is syntactic sugar for creating UI elements
- **Events** make components interactive
- **Keys** help React identify list items for efficient updates
- **Children** enable composition and flexible component design

---

**Next Steps:** Move to Module 2 to learn about Hooks and Side Effects.
