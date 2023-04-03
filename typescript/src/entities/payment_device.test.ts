import { Merchi } from '../merchi';

test('can make PaymentDevice', () => {
  const merchi = new Merchi();
  const paymentDevice = new merchi.PaymentDevice();
  expect(paymentDevice).toBeTruthy();
});
