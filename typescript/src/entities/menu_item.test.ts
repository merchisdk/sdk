import { Merchi } from '../merchi';

test('can make MenuItem', () => {
  const merchi = new Merchi();
  const menuItem = new merchi.MenuItem();
  expect(menuItem).toBeTruthy();
});
