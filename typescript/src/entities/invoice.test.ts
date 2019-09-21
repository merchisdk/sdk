import { Merchi } from '../merchi';

test('can make Invoice', () => {
  const merchi = new Merchi();
  const invoice = new merchi.Invoice();
  expect(invoice).toBeTruthy();
});
