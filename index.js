export const validateEnv = (schema, env = process.env) => {
  const result = {};
  const errors = [];

  for (const [key, config] of Object.entries(schema)) {
    const value = env[key];
    const { type, required = true, default: defaultValue, min, max } = config;

    // Check if required and missing
    if (required && value === undefined && defaultValue === undefined) {
      errors.push(`Missing required environment variable: ${key}`);
      continue;
    }

    // Apply default if value is missing
    if (value === undefined && defaultValue !== undefined) {
      result[key] = defaultValue;
      continue;
    }

    // Skip further validation if value is undefined and not required
    if (value === undefined) {
      continue;
    }

    // Type validation
    if (type === "string") {
      if (typeof value !== "string") {
        errors.push(`${key} must be a string`);
      } else {
        result[key] = value;
      }
    } else if (type === "number") {
      const num = Number(value);
      if (isNaN(num)) {
        errors.push(`${key} must be a valid number`);
      } else {
        if (min !== undefined && num < min) {
          errors.push(`${key} must be at least ${min}`);
        } else if (max !== undefined && num > max) {
          errors.push(`${key} must be at most ${max}`);
        } else {
          result[key] = num;
        }
      }
    } else if (type === "boolean") {
      if (value !== "true" && value !== "false") {
        errors.push(`${key} must be 'true' or 'false'`);
      } else {
        result[key] = value === "true";
      }
    } else if (type === "url") {
      try {
        new URL(value);
        result[key] = value;
      } catch {
        errors.push(`${key} must be a valid URL`);
      }
    } else if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push(`${key} must be a valid email`);
      } else {
        result[key] = value;
      }
    } else {
      errors.push(`Unsupported type for ${key}: ${type}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n- ${errors.join("\n- ")}`);
  }

  return result;
};

export default validateEnv;
