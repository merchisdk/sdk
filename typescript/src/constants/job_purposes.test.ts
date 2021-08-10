import { JobPurpose } from './job_purposes';

test('seller mod product creation purpose exists', () => {
  expect(JobPurpose.SELLER_PRODUCT_CREATION).toBe(1);
});
