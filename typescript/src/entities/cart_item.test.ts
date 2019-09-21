import { Merchi } from '../merchi';

test('can make CartItem', () => {
  const merchi = new Merchi();
  const cartItem = new merchi.CartItem();
  expect(cartItem).toBeTruthy();
});
