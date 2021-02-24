import { JobPurpose } from './job_purposes';

test('seller mod product creation purpose exists', () => {
  expect(JobPurpose.SELLER_MOD_PRODUCT_CREATION).toBe(1);
});
