import { Merchi } from '../merchi';

test('can make VariationFieldsOption', () => {
  const merchi = new Merchi();
  const variationFieldsOption = new merchi.VariationFieldsOption();
  expect(variationFieldsOption).toBeTruthy();
});
