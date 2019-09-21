import { Merchi } from '../merchi';

test('can make Payment', () => {
  const merchi = new Merchi();
  const payment = new merchi.Payment();
  expect(payment).toBeTruthy();
});
