import { Merchi } from '../merchi';

test('can make VariationField', () => {
  const merchi = new Merchi();
  const variationField = new merchi.VariationField();
  expect(variationField).toBeTruthy();
});
