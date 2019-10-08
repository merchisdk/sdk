import { Merchi } from '../merchi';

test('can make VariationField', () => {
  const merchi = new Merchi();
  const variationField = new merchi.VariationField();
  expect(variationField).toBeTruthy();
});

test('isSelectable', () => {
  const merchi = new Merchi();
  const vf = new merchi.VariationField();
  expect(vf.isSelectable).toThrow();
  vf.fieldType = 1; 
  expect(vf.isSelectable()).toBe(false);
  vf.fieldType = 11; 
  expect(vf.isSelectable()).toBe(true);
});

test('buildEmptyVariation', () => {
  const merchi = new Merchi();
  const vf = new merchi.VariationField();
  expect(vf.buildEmptyVariation).toThrow();
  vf.defaultValue = "a";
  vf.fieldType = 11; 
  expect(vf.buildEmptyVariation).toThrow();
  vf.variationCost = 2;
  expect(vf.buildEmptyVariation).toThrow();
  const o1 = new merchi.VariationFieldsOption();
  const o2 = new merchi.VariationFieldsOption();
  o1.default = true;
  vf.options = [o1, o2];
  expect(vf.buildEmptyVariation).toThrow();
  o1.variationCost = 3;
  expect(vf.buildEmptyVariation().onceOffCost).toEqual(3);
  vf.fieldType = 1; 
  expect(vf.buildEmptyVariation().onceOffCost).toEqual(2);
});
