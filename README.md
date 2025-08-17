# env-schema-check

A lightweight, zero-dependency Node.js package for validating environment variables against a schema.

## Installation

```bash
npm install env-schema-check
```

## Usage

Define a schema for your environment variables and validate them:

```javascript
import checkEnv from "env-schema-check";

const schema = {
  PORT: { type: "number", default: 3000, required: false },
  API_KEY: { type: "string", required: true },
  DATABASE_URL: { type: "url", required: true },
  MAX_USERS: { type: "number", min: 1, max: 1000 },
  EMAIL: { type: "email" },
};

try {
  const env = checkEnv(schema);
  console.log("Validated environment:", env);
} catch (error) {
  console.error(error.message);
}
```

### Schema Options

- `type`: One of `'string'`, `'number'`, `'boolean'`, `'url'`, `'email'`.
- `required`: Boolean, defaults to `true`. If `true`, the variable must be present unless a `default` is provided.
- `default`: Default value if the variable is missing.
- `min`: Minimum value for numbers.
- `max`: Maximum value for numbers.

### Features

- Zero dependencies.
- Supports TypeScript with included type definitions.
- Validates types, required fields, and constraints (min/max for numbers, URL/email formats).
- Throws clear, descriptive errors for invalid configurations.
- Works with `process.env` by default, but accepts custom env objects for testing.

## Example

```javascript
// .env
PORT=8080
API_KEY=abc123
DATABASE_URL=https://example.com
MAX_USERS=500
EMAIL=user@example.com

// index.js
import checkEnv from 'env-schema-check';

const schema = {
  PORT: { type: 'number', default: 3000, required: false },
  API_KEY: { type: 'string', required: true },
  DATABASE_URL: { type: 'url', required: true },
  MAX_USERS: { type: 'number', min: 1, max: 1000 },
  EMAIL: { type: 'email' }
};

const env = checkEnv(schema);
console.log(env);
// Output: { PORT: 8080, API_KEY: 'abc123', DATABASE_URL: 'https://example.com', MAX_USERS: 500, EMAIL: 'user@example.com' }
```
