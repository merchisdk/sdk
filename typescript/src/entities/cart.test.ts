import { Merchi } from '../merchi';

test('can make Cart', () => {
  const merchi = new Merchi();
  const cart = new merchi.Cart();
  expect(cart).toBeTruthy();
});
