import { Merchi } from '../merchi';

test('can make CartItem', () => {
  const merchi = new Merchi();
  const cartItem = new merchi.CartItem();
  expect(cartItem).toBeTruthy();
});

test('requiresShipment', () => {
  const merchi = new Merchi();
  const cartItem = new merchi.CartItem();
  expect(cartItem.requiresShipment).toThrow(); 
  cartItem.product = new merchi.Product();
  expect(cartItem.requiresShipment).toThrow(); 
  cartItem.product.needsShipping = false;
  expect(cartItem.requiresShipment()).toBe(false);
  cartItem.product.needsShipping = true;
  expect(cartItem.requiresShipment()).toBe(true);
});
