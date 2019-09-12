import { Merchi } from '../merchi';

test('can make Discount', () => {
  const merchi = new Merchi();
  const discount = new merchi.Discount();
  expect(discount).toBeTruthy();
});
