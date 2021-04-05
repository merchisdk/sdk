import { Merchi } from '../merchi';

test('can make Discount', () => {
  const merchi = new Merchi();
  const discount = new merchi.Discount();
  expect(discount).toBeTruthy();
});

test('discountedUnitCost', () => {
  const merchi = new Merchi();
  const discount = new merchi.Discount();
  const product = new merchi.Product();
  expect(() => discount.discountedUnitCost(product)).toThrow();
  product.unitPrice = 200.8; 
  expect(() => discount.discountedUnitCost(product)).toThrow();
  discount.amount = 94.6;
  expect(discount.discountedUnitCost(product)).toEqual('10.843');
});
