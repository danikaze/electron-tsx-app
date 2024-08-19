import { nanoid } from 'nanoid';
import { describe, expect, it } from 'vitest';
import { add, prod } from '../test';

describe('environment configuration tests', () => {
  it('ts test', () => {
    expect(prod(3, 4)).toBe(12);
    expect(add(3, 4)).toBe(7);
  });

  it('esm test', () => {
    expect(typeof nanoid(), 'ESM imports should work').toBe('string');
  });
});
