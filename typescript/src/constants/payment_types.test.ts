import { PaymentType } from './payment_types';

test('urgent notification urgency exists', () => {
  expect(PaymentType.ONLINE_PAYMENT).toBe(1);
});
