import { Merchi } from '../merchi';

test('can make Inventory', () => {
  const merchi = new Merchi();
  const inventory = new merchi.Inventory();
  expect(inventory).toBeTruthy();
});
