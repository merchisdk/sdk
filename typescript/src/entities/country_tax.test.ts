import { Merchi } from '../merchi';

test('can make CountryTax', () => {
  const merchi = new Merchi();
  const countryTax = new merchi.CountryTax();
  expect(countryTax).toBeTruthy();
});

test('getNoTax', () => {
  const merchi = new Merchi();
  const noTax = merchi.CountryTax.getNoTax();
  expect(noTax.id).toBe(3);
});
