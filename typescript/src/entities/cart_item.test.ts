import { Merchi } from '../merchi';
import { setup, mockFetch } from '../test_util';

setup();

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

test('Get quote update job cost', () => {
  const merchi = new Merchi();
  const cartItem = new merchi.CartItem().fromJson(
    {'quantity': 10, 'totalCost': 0});
  mockFetch(true, {'quantity': 10, 'totalCost': 100}, 200);
  cartItem.calculate().then(item => {
    expect(item.quantity).toEqual(10);
    expect(item.totalCost).toEqual(100);
  });
});
