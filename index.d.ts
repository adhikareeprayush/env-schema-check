interface SchemaConfig {
  type: "string" | "number" | "boolean" | "url" | "email";
  required?: boolean;
  default?: any;
  min?: number;
  max?: number;
}

interface Schema {
  [key: string]: SchemaConfig;
}

export function validateEnv(
  schema: Schema,
  env?: Record<string, string | undefined>
): Record<string, any>;

export default validateEnv;
