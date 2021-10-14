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

test('buildEmptyVariation cost', () => {
  const merchi = new Merchi();
  const vf = new merchi.VariationField();
  expect(vf.buildEmptyVariation).toThrow();
  vf.defaultValue = 'a';
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

test('buildEmptyVariation seller editable options', () => {
  const merchi = new Merchi();
  const vf = new merchi.VariationField();
  expect(vf.buildEmptyVariation).toThrow();
  vf.defaultValue = 'a';
  vf.fieldType = 11;
  vf.sellerProductEditable = true;
  vf.variationCost = 2;
  expect(vf.buildEmptyVariation).toThrow();
  const o1 = new merchi.VariationFieldsOption();
  const o2 = new merchi.VariationFieldsOption();
  o1.include = true;
  o1.id = 1;
  o1.variationCost = 1;
  o2.default = true;
  o2.id = 2;
  o2.variationCost = 1;
  vf.options = [o1, o2];
  expect(vf.buildEmptyVariation().value).toEqual('1');
});

test('buildEmptyVariation selectable options', () => {
  const merchi = new Merchi();
  const vf = new merchi.VariationField();
  const o1 = new merchi.VariationFieldsOption();
  const o2 = new merchi.VariationFieldsOption();

  o1.value = 'test 1';
  o2.value = 'test 2';
  vf.options = [o1, o2];
  vf.variationCost = 2;
  vf.defaultValue = 'a';
  vf.fieldType = 11;

  const v = vf.buildEmptyVariation();
  expect(v.selectableOptions![0].value).toEqual('test 1');
  expect(v.selectableOptions![1].value).toEqual('test 2');
});
