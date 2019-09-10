import { Merchi } from '../merchi';

test('can make SystemRole', () => {
  const merchi = new Merchi();
  const systemRole = new merchi.SystemRole();
  expect(systemRole).toBeTruthy();
});
