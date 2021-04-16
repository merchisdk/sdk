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

test('buildVariationOption', () => {
  const merchi = new Merchi();
  const option = new merchi.VariationFieldsOption();
  const file = new merchi.MerchiFile();
  file.id = 1;
  option.id = 1;
  option.value = 'aa';
  option.position = 3;
  option.default = true;
  option.colour = '#AAAAAA';
  option.linkedFile = file;
  option.currency = 'AUD';
  option.variationCost = 100;
  option.variationUnitCost = 1;
  const variationOption = option.buildVariationOption();
  expect(variationOption.optionId).toEqual(option.id);
  expect(variationOption.value).toEqual(option.value);
  expect(variationOption.position).toEqual(option.position);
  expect(variationOption.default).toEqual(option.default);
  expect(variationOption.colour).toEqual(option.colour);
  expect(variationOption.linkedFile!.id).toEqual(1);
  expect(variationOption.quantity).toEqual(0);
  expect(variationOption.currency).toEqual(option.currency);
  expect(variationOption.onceOffCost).toEqual(option.variationCost);
  expect(variationOption.unitCost).toEqual(option.variationUnitCost);
  expect(variationOption.unitCostTotal).toEqual(0);
  expect(variationOption.totalCost).toEqual(option.variationCost);
});
