import { Merchi } from '../merchi';

test('can make Bank', () => {
  const merchi = new Merchi();
  const bank = new merchi.Bank();
  expect(bank).toBeTruthy();
});
