import { Merchi } from '../merchi';
import { setup, mockFetch } from '../test_util';

setup();

test('can make Cart', () => {
  const merchi = new Merchi();
  const cart = new merchi.Cart();
  expect(cart).toBeTruthy();
});

test('cart token supported by merchi', () => {
  const merchi = new Merchi(undefined, undefined, undefined, 'c');
  const correct = [['skip_rights', 'y'], ['cart_token', 'c']];
  const fetch = mockFetch(true, {'invoice': {'id': 1}}, 200);
  const invocation = merchi.Invoice.get(1);
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
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

test('pass cookie tokens to query string', () => {
  const cookie = 'cart_token=c;';
  Object.defineProperty(document, 'cookie', {
    get: jest.fn().mockImplementation(() => { return cookie; }),
    set: jest.fn().mockImplementation(() => {}),
  });
  const correct = [
    ['skip_rights', 'y'],
    ['cart_token', 'c'],
  ];
  const fetch = mockFetch(true, {'cart': {'id': 1}}, 200);
  const merchi = new Merchi();
  const invocation = merchi.Cart.get(1);
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
});
