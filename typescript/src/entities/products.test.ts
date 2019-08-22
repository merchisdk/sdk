import { Product } from './products';
import { mockFetch } from '../test_util';

test('can make product', () => {
  const product = new Product();
  expect(product).toBeTruthy();
});

test('can get and set id', () => {
  const product = new Product();
  product.id = 2;
  expect(product.id).toBe(2);
});

test('can get and set name', () => {
  const product = new Product();
  product.name = 'example';
  expect(product.name).toBe('example');
});

test('can fetch product from server', () => {
  const testName = 'S7qHUfV_dr5l';
  mockFetch(true, {'product': {'name': testName}}, 200);
  (window as any).merchiBackendUri = 'override.example.com';
  return Product.get(1).then(product => expect(product.name).toBe(testName));
});

test('handle nonsense from server', () => {
  // non existent property just ignored. no crash, no update
  mockFetch(true, {'product': {'no such property!!!': 'unused'}}, 200);
  (window as any).merchiBackendUri = 'override.example.com';
  Product.get(1);
});
