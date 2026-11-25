/**
 * Minimal ambient types for the Node built-in modules our zero-dependency
 * tests use (node:test + node:assert). This repo has no @types/node and
 * cannot install one (shared node_modules), so these declarations exist
 * only so `npm run check` can type-check the test file. The real API is
 * Node's own — delete this file if @types/node is ever added.
 */
declare module 'node:test' {
  export function test(name: string, fn: () => void | Promise<void>): void;
}

declare module 'node:assert' {
  export function ok(value: unknown, message?: string): void;
  export function strictEqual(actual: unknown, expected: unknown, message?: string): void;
}
