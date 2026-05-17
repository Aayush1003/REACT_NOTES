# Quick Start Project Structure

Template for starting a new React project using Vite.

---

## Folder Structure

```
my-react-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── Button.test.jsx
│   │   ├── Card/
│   │   │   ├── Card.jsx
│   │   │   └── Card.css
│   │   └── Header/
│   │       ├── Header.jsx
│   │       └── Header.css
│   ├── hooks/
│   │   ├── useFetch.js
│   │   ├── useLocalStorage.js
│   │   └── useDebounce.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── utils/
│   │   └── helpers.js
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Setup Commands

### Create New Project

```bash
# Using Vite (recommended)
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev

# Or using Create React App (older, slower)
npx create-react-app my-app
cd my-app
npm start
```

### Install Common Dependencies

```bash
# Routing
npm install react-router-dom

# State Management (Redux)
npm install @reduxjs/toolkit react-redux

# HTTP Requests
npm install axios

# Styling
npm install styled-components
npm install -D tailwindcss postcss autoprefixer

# Form Handling
npm install react-hook-form

# Testing
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Utilities
npm install clsx
npm install date-fns
```

---

## Essential Files

### main.jsx

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### App.jsx

```jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>Welcome to React</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}

export default App
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src --ext js,jsx"
  }
}
```

---

## Sample Components

### Button Component

```jsx
// components/Button/Button.jsx
import './Button.css'

export default function Button({ variant = 'primary', children, onClick, disabled }) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

```css
/* components/Button/Button.css */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Card Component

```jsx
// components/Card/Card.jsx
import './Card.css'

export default function Card({ title, children, variant = 'default' }) {
  return (
    <div className={`card card-${variant}`}>
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}
```

```css
/* components/Card/Card.css */
.card {
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #333;
}

.card-content {
  font-size: 14px;
  color: #666;
}

.card-default {
  border-left: 4px solid #007bff;
}

.card-success {
  border-left: 4px solid #28a745;
}

.card-danger {
  border-left: 4px solid #dc3545;
}
```

---

## Custom Hooks Examples

### useFetch

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}
```

### useLocalStorage

```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}
```

---

## Environment Variables

### .env

```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=My React App
```

### Usage in Code

```jsx
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME
```

---

## Useful VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** — dsznajder.es7-react-js-snippets
- **ES Lint** — dbaeumer.vscode-eslint
- **Prettier** — esbenp.prettier-vscode
- **React Developer Tools** — Firefox/Chrome extension

---

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

Opens http://localhost:5173

### 2. Create Components

```bash
# Each component in its own folder
src/components/MyComponent/
  - MyComponent.jsx
  - MyComponent.css
```

### 3. Test Components

```bash
npm run test
```

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

---

## Git Setup

### .gitignore

```
node_modules/
dist/
.env.local
.env.*.local
*.log
.DS_Store
.vscode/
```

---

**You're now ready to start building React apps!**
