import { Merchi } from '../merchi';

test('can make VariationFieldsOption', () => {
  const merchi = new Merchi();
  const variationFieldsOption = new merchi.VariationFieldsOption();
  expect(variationFieldsOption).toBeTruthy();
});

test('totalCost', () => {
  const merchi = new Merchi();
  const vfo = new merchi.VariationFieldsOption();
  expect(() => vfo.totalCost(33)).toThrow();
  vfo.variationCost = 12.4;
  expect(() => vfo.totalCost(33)).toThrow();
  vfo.variationUnitCost = 9.98;
  expect(vfo.totalCost(33)).toEqual(341.74);
});
