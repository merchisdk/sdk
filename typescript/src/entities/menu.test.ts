import { Merchi } from '../merchi';

test('can make Menu', () => {
  const merchi = new Merchi();
  const menu = new merchi.Menu();
  expect(menu).toBeTruthy();
});
