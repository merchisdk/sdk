import { Merchi } from '../merchi';

test('can make Variation', () => {
  const merchi = new Merchi();
  const option = new merchi.VariationOption();
  expect(option).toBeTruthy();
});
