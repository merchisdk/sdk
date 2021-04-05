import { DiscountType } from './discount_types';

test('discount type volumetric exists', () => {
  expect(DiscountType.VOLUMETRIC).toBe(0);
});
