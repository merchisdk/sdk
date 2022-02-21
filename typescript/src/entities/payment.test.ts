import { setup, mockFetch } from '../test_util';
import { Merchi } from '../merchi';

setup();

test('can make Payment', () => {
  const merchi = new Merchi();
  const payment = new merchi.Payment();
  expect(payment).toBeTruthy();
});

test('payment refund', () => {
  const merchi = new Merchi();
  const payment = new merchi.Payment();
  mockFetch(true, { 'amount': 10 }, 200);
  payment.refund().then(payment => {
    expect(payment.amount).toEqual(10);
  });
});
