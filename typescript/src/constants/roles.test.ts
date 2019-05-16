import { Role } from './roles';

test('admin role exists', () => {
  expect(Role.ADMIN).toBe(1);
});
