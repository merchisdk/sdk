import { isUndefinedOrNull } from './validation';


test('return true if value is null', () => {
  expect(isUndefinedOrNull(null)).toBe(true);
});

test('return true if value is undefined', () => {
  expect(isUndefinedOrNull(undefined)).toBe(true);
});

test('return false if value other than undefined or null', () => {
  expect(isUndefinedOrNull(false)).toBe(false);
  expect(isUndefinedOrNull('')).toBe(false);
  expect(isUndefinedOrNull(0)).toBe(false);
});
