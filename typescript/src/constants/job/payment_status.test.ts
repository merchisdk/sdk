import { PaymentStatus } from './payment_status';

test('init status exists', () => {
  expect(PaymentStatus.INIT).toBe(0);
});
