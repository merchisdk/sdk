import { Merchi } from '../merchi';

test('can make Cart', () => {
  const merchi = new Merchi();
  const cart = new merchi.Cart();
  expect(cart).toBeTruthy();
});

test('requiresShipment', () => {
  const merchi = new Merchi();
  const cart = new merchi.Cart();
  expect(cart.requiresShipment).toThrow();
  cart.cartItems = [];
  expect(cart.requiresShipment()).toBe(false);
  cart.cartItems = [new merchi.CartItem()];
  cart.cartItems[0].product = new merchi.Product();
  cart.cartItems[0].product.needsShipping = true;
  expect(cart.requiresShipment()).toBe(true);
  cart.cartItems[0].product.needsShipping = false;
  expect(cart.requiresShipment()).toBe(false);
});
