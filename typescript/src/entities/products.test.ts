import { Product } from './products';

test('can make product', () => {
  const product = new Product();
  expect(product).toBeTruthy();
});
