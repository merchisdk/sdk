import { Merchi } from '../merchi';

test('can make ComponentVersion', () => {
  const merchi = new Merchi();
  const countryTax = new merchi.ComponentVersion();
  expect(countryTax).toBeTruthy();
});
