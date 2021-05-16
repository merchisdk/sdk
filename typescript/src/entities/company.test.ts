import { Merchi } from '../merchi';

test('can make Company', () => {
  const merchi = new Merchi();
  const company = new merchi.Company();
  expect(company).toBeTruthy();
});
