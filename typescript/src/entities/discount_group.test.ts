import { Merchi } from '../merchi';

test('can make Discount Group', () => {
  const merchi = new Merchi();
  const discountGroup = new merchi.DiscountGroup();
  expect(discountGroup).toBeTruthy();
});
