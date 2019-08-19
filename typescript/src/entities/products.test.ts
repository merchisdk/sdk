import { Product } from './products';

test('can make product', () => {
  const product = new Product();
  expect(product).toBeTruthy();
});

test('can get and set id', () => {
  const product = new Product();
  product.id = 2;
  expect(product.id).toBe(2);
});
