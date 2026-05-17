# Module 3: Forms and User Input

Complete guide to handling forms and user input in React.

---

## Controlled Components

In React, form elements are usually **controlled** — their value is managed by React state.

### Text Input

```jsx
import { useState } from 'react';

function NameForm() {
  const [name, setName] = useState('');
  
  const handleChange = (e) => {
    setName(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', name);
    setName(''); // Reset
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Textarea

```jsx
function CommentForm() {
  const [comment, setComment] = useState('');
  
  return (
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      rows="4"
      cols="50"
    />
  );
}
```

### Select

```jsx
function CountrySelect() {
  const [country, setCountry] = useState('');
  
  return (
    <select value={country} onChange={(e) => setCountry(e.target.value)}>
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
      <option value="ca">Canada</option>
    </select>
  );
}

// Multiple select
function MultipleSelect() {
  const [selected, setSelected] = useState([]);
  
  const handleChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelected(value);
  };
  
  return (
    <select multiple value={selected} onChange={handleChange}>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
      <option value="js">JavaScript</option>
    </select>
  );
}
```

### Checkbox

```jsx
function SubscribeForm() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  return (
    <label>
      <input
        type="checkbox"
        checked={isSubscribed}
        onChange={(e) => setIsSubscribed(e.target.checked)}
      />
      Subscribe to newsletter
    </label>
  );
}

// Multiple checkboxes
function TechStack() {
  const [selected, setSelected] = useState({
    react: false,
    vue: false,
    angular: false
  });
  
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSelected(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          name="react"
          checked={selected.react}
          onChange={handleChange}
        />
        React
      </label>
      <label>
        <input
          type="checkbox"
          name="vue"
          checked={selected.vue}
          onChange={handleChange}
        />
        Vue
      </label>
      <label>
        <input
          type="checkbox"
          name="angular"
          checked={selected.angular}
          onChange={handleChange}
        />
        Angular
      </label>
    </div>
  );
}
```

### Radio Button

```jsx
function RatingForm() {
  const [rating, setRating] = useState('');
  
  return (
    <fieldset>
      <legend>How satisfied are you?</legend>
      <label>
        <input
          type="radio"
          name="rating"
          value="satisfied"
          checked={rating === 'satisfied'}
          onChange={(e) => setRating(e.target.value)}
        />
        Satisfied
      </label>
      <label>
        <input
          type="radio"
          name="rating"
          value="neutral"
          checked={rating === 'neutral'}
          onChange={(e) => setRating(e.target.value)}
        />
        Neutral
      </label>
      <label>
        <input
          type="radio"
          name="rating"
          value="unsatisfied"
          checked={rating === 'unsatisfied'}
          onChange={(e) => setRating(e.target.value)}
        />
        Unsatisfied
      </label>
    </fieldset>
  );
}
```

---

## Uncontrolled Components

Sometimes you don't need to control a form value — let the DOM handle it.

### Using useRef

```jsx
function NameForm() {
  const inputRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Input value:', inputRef.current.value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### File Input

```jsx
function FileUpload() {
  const fileRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const file = fileRef.current.files[0];
    console.log('Selected file:', file);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileRef} />
      <button type="submit">Upload</button>
    </form>
  );
}
```

---

## Complex Form Handling

### Form with Multiple Fields

```jsx
function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    agreeToTerms: false
  });
  
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Send to server
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
      >
        <option value="">Select Country</option>
        <option value="us">USA</option>
        <option value="uk">UK</option>
      </select>
      <label>
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
        />
        I agree to terms and conditions
      </label>
      <button type="submit">Register</button>
    </form>
  );
}
```

---

## Form Validation

### Client-Side Validation

```jsx
function ValidatedForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form is valid, submitting...');
      // Submit form
    } else {
      setErrors(newErrors);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Using Validation Library (Example: react-hook-form)

```jsx
import { useForm } from 'react-hook-form';

function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Invalid email format'
          }
        })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 6, message: 'Min 6 characters' }
        })}
        type="password"
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Advanced Form Patterns

### Dynamic Form Fields

```jsx
function DynamicForm() {
  const [fields, setFields] = useState([{ id: 1, value: '' }]);
  
  const addField = () => {
    const newField = { id: Date.now(), value: '' };
    setFields([...fields, newField]);
  };
  
  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };
  
  const updateField = (id, value) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, value } : field
    ));
  };
  
  return (
    <form>
      {fields.map(field => (
        <div key={field.id}>
          <input
            value={field.value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder="Enter value"
          />
          <button
            type="button"
            onClick={() => removeField(field.id)}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addField}>
        Add Field
      </button>
    </form>
  );
}
```

### Form with Async Validation

```jsx
function AsyncValidationForm() {
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  
  const checkEmailAvailability = async (emailValue) => {
    setIsChecking(true);
    try {
      const response = await fetch(`/api/check-email?email=${emailValue}`);
      const data = await response.json();
      
      if (data.available) {
        setError('');
      } else {
        setError('Email already in use');
      }
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Debounce the check
    const timeout = setTimeout(() => {
      if (value) checkEmailAvailability(value);
    }, 500);
    
    return () => clearTimeout(timeout);
  };
  
  return (
    <div>
      <input
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      {isChecking && <p>Checking...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

---

## Form Submission Handling

### Basic Submission

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      // Save token, redirect, etc.
      console.log('Logged in:', data);
    } catch (err) {
      setError(err.message);
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
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## Summary

- **Controlled components** have their value managed by React state
- **Uncontrolled components** rely on DOM and refs
- **Form validation** can be client-side, async, or with libraries
- **Dynamic forms** allow adding/removing fields
- **Error handling** provides user feedback
- **Loading states** indicate async operations

---

**Next Steps:** Move to Module 4 to learn about Performance Optimization.
