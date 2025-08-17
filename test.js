import { test, describe } from "node:test";
import assert from "node:assert/strict";
import checkEnv from "./index.js";

describe("env-schema-check", () => {
  test("validates correct schema", () => {
    const schema = {
      PORT: { type: "number", default: 3000 },
      API_KEY: { type: "string", required: true },
    };
    const env = { API_KEY: "test" };
    const result = checkEnv(schema, env);
    assert.deepEqual(result, { PORT: 3000, API_KEY: "test" });
  });

  test("throws on missing required variable", () => {
    const schema = { API_KEY: { type: "string", required: true } };
    assert.throws(
      () => checkEnv(schema, {}),
      /Missing required environment variable: API_KEY/
    );
  });

  test("validates number with min/max", () => {
    const schema = { MAX_USERS: { type: "number", min: 1, max: 100 } };
    const env = { MAX_USERS: "50" };
    assert.deepEqual(checkEnv(schema, env), { MAX_USERS: 50 });

    assert.throws(
      () => checkEnv(schema, { MAX_USERS: "0" }),
      /MAX_USERS must be at least 1/
    );
    assert.throws(
      () => checkEnv(schema, { MAX_USERS: "101" }),
      /MAX_USERS must be at most 100/
    );
  });

  test("validates url", () => {
    const schema = { DATABASE_URL: { type: "url" } };
    assert.deepEqual(
      checkEnv(schema, { DATABASE_URL: "https://example.com" }),
      { DATABASE_URL: "https://example.com" }
    );
    assert.throws(
      () => checkEnv(schema, { DATABASE_URL: "not-a-url" }),
      /DATABASE_URL must be a valid URL/
    );
  });

  test("validates email", () => {
    const schema = { EMAIL: { type: "email" } };
    assert.deepEqual(checkEnv(schema, { EMAIL: "user@example.com" }), {
      EMAIL: "user@example.com",
    });
    assert.throws(
      () => checkEnv(schema, { EMAIL: "invalid-email" }),
      /EMAIL must be a valid email/
    );
  });

  test("validates boolean", () => {
    const schema = { DEBUG: { type: "boolean" } };
    assert.deepEqual(checkEnv(schema, { DEBUG: "true" }), { DEBUG: true });
    assert.throws(
      () => checkEnv(schema, { DEBUG: "not-a-boolean" }),
      /DEBUG must be 'true' or 'false'/
    );
  });
});
