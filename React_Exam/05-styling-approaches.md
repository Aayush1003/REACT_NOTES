# Module 5: Styling in React

Complete guide to styling React components.

---

## Inline Styles

### Basic Inline Styles

```jsx
function Component() {
  const styles = {
    container: {
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px'
    },
    title: {
      color: '#333',
      fontSize: '24px',
      fontWeight: 'bold'
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Hello World</h1>
    </div>
  );
}
```

### Dynamic Inline Styles

```jsx
function Component({ isActive }) {
  const buttonStyle = {
    backgroundColor: isActive ? '#4CAF50' : '#f44336',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };
  
  return <button style={buttonStyle}>Click me</button>;
}
```

### Pros & Cons

✅ **Pros**: Dynamic styles, scoped to component  
❌ **Cons**: No hover/media queries, hard to read large stylesheets  

---

## CSS Classes

### Basic CSS Classes

```css
/* Button.css */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
```

```jsx
// Button.jsx
import './Button.css';

function Button({ variant = 'primary', children }) {
  return (
    <button className={`btn btn-${variant}`}>
      {children}
    </button>
  );
}
```

### Conditional Classes

```jsx
function Button({ isActive, isLoading }) {
  const classes = [
    'btn',
    isActive && 'btn-active',
    isLoading && 'btn-loading'
  ].filter(Boolean).join(' ');
  
  return <button className={classes}>Button</button>;
}
```

### Using classnames Library

```bash
npm install classnames
```

```jsx
import clsx from 'classnames';

function Button({ isPrimary, isLarge, disabled }) {
  return (
    <button
      className={clsx('btn', {
        'btn-primary': isPrimary,
        'btn-large': isLarge,
        'btn-disabled': disabled
      })}
    >
      Click
    </button>
  );
}
```

---

## CSS Modules

Locally scoped CSS to avoid naming conflicts:

### Button.module.css

```css
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary {
  background-color: #007bff;
  color: white;
}

.secondary {
  background-color: #6c757d;
  color: white;
}
```

### Button.jsx

```jsx
import styles from './Button.module.css';

function Button({ variant = 'primary', children }) {
  return (
    <button className={`${styles.btn} ${styles[variant]}`}>
      {children}
    </button>
  );
}

// Or using template literals
function Button({ variant = 'primary', children }) {
  return (
    <button className={styles[`btn-${variant}`]}>
      {children}
    </button>
  );
}
```

### Pros & Cons

✅ **Pros**: No naming conflicts, locally scoped  
❌ **Cons**: More verbose, limited dynamic styling  

---

## CSS-in-JS: Styled Components

Install:

```bash
npm install styled-components
```

### Basic Usage

```jsx
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

function Button({ primary, children }) {
  return <StyledButton primary={primary}>{children}</StyledButton>;
}
```

### Advanced Styled Components

```jsx
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

function App() {
  return (
    <Container>
      <Title>My App</Title>
      <Card>Content here</Card>
    </Container>
  );
}
```

### Extending Styles

```jsx
const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
`;

const PrimaryButton = styled(Button)`
  background-color: #28a745;
`;

const DangerButton = styled(Button)`
  background-color: #dc3545;
`;
```

### Pros & Cons

✅ **Pros**: Full CSS power, dynamic styles, auto-vendor prefixing  
❌ **Cons**: Runtime overhead, larger bundle  

---

## CSS-in-JS: Emotion

Lightweight alternative to Styled Components:

```bash
npm install @emotion/react @emotion/styled
```

```jsx
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const buttonStyle = css`
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  ${buttonStyle}
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

function Button() {
  return <StyledButton>Click me</StyledButton>;
}
```

---

## Tailwind CSS

Utility-first CSS framework:

### Installation

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Basic Usage

```jsx
function Button({ variant = 'primary' }) {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    danger: 'bg-red-500 hover:bg-red-600'
  };
  
  return (
    <button className={`
      px-4 py-2 
      text-white 
      rounded-lg 
      font-semibold
      transition duration-200
      ${variants[variant]}
    `}>
      Click me
    </button>
  );
}
```

### Using clsx with Tailwind

```bash
npm install clsx
```

```jsx
import clsx from 'clsx';

function Card({ variant = 'default' }) {
  return (
    <div className={clsx('p-6 rounded-lg', {
      'bg-white border border-gray-200': variant === 'default',
      'bg-blue-50 border border-blue-200': variant === 'info',
      'bg-red-50 border border-red-200': variant === 'error'
    })}>
      Card content
    </div>
  );
}
```

### Pros & Cons

✅ **Pros**: Fast development, small bundle, consistent design  
❌ **Cons**: Steep learning curve, verbose HTML  

---

## Responsive Styling

### Media Queries with CSS

```css
.container {
  width: 100%;
  padding: 20px;
}

@media (min-width: 768px) {
  .container {
    width: 750px;
    padding: 40px;
  }
}

@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}
```

### Media Queries with Styled Components

```jsx
const Container = styled.div`
  width: 100%;
  padding: 20px;
  
  @media (min-width: 768px) {
    width: 750px;
    padding: 40px;
  }
  
  @media (min-width: 1024px) {
    width: 960px;
  }
`;
```

### Media Queries with Tailwind

```jsx
<div className="w-full p-5 md:w-screen md:p-10 lg:w-full lg:p-20">
  Responsive content
</div>
```

---

## Theme Support

### Context-Based Theme

```jsx
const ThemeContext = createContext();

const lightTheme = {
  primary: '#007bff',
  secondary: '#6c757d',
  background: '#ffffff',
  text: '#000000'
};

const darkTheme = {
  primary: '#0d6efd',
  secondary: '#6c757d',
  background: '#1a1a1a',
  text: '#ffffff'
};

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

function Button() {
  const { theme } = useTheme();
  return (
    <button style={{ backgroundColor: theme.primary }}>
      Click
    </button>
  );
}
```

---

## Global Styles

### Using a Global CSS File

```css
/* globals.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  line-height: 1.6;
  color: #333;
}

a {
  color: #007bff;
  text-decoration: none;
}
```

```jsx
import './globals.css';

function App() {
  return <div>App</div>;
}
```

### Using Styled Components Global Style

```jsx
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
    color: #333;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <MainApp />
    </>
  );
}
```

---

## Summary

| Method | Use When | Pros | Cons |
|--------|----------|------|------|
| Inline Styles | Simple, dynamic styles | Fast, scoped | Limited features |
| CSS Classes | Large stylesheets | Familiar, powerful | Global scope issues |
| CSS Modules | Preventing conflicts | Scoped, organized | More verbose |
| Styled Components | Complex themes, full CSS | All CSS features | Runtime overhead |
| Tailwind CSS | Rapid development | Fast, consistent | Verbose HTML |

---

**Next Steps:** Move to advanced styling techniques and animations.
