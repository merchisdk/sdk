import { Merchi } from '../merchi';

test('can make CountryTax', () => {
  const merchi = new Merchi();
  const countryTax = new merchi.CountryTax();
  expect(countryTax).toBeTruthy();
});
