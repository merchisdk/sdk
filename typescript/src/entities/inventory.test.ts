import { Merchi } from '../merchi';

test('can make Inventory', () => {
  const merchi = new Merchi();
  const inventory = new merchi.Inventory();
  expect(inventory).toBeTruthy();
});

test('isVariationFieldOptionSelected function', () => {
  const merchi = new Merchi();
  const inventory = new merchi.Inventory();
  const option1 = new merchi.VariationFieldsOption();
  option1.id = 1;
  const option2 = new merchi.VariationFieldsOption();
  option2.id = 2;
  expect(() => inventory.isVariationFieldOptionSelected(option1)).toThrow();

  const inventoryUnitVariation = new merchi.InventoryUnitVariation();
  inventory.inventoryUnitVariations = [inventoryUnitVariation];

  expect(() => inventory.isVariationFieldOptionSelected(option1)).toThrow();

  inventoryUnitVariation.variationFieldsOption = option2;
  expect(inventory.isVariationFieldOptionSelected(option1)).toBe(false);

  inventoryUnitVariation.variationFieldsOption = option1;
  expect(inventory.isVariationFieldOptionSelected(option1)).toBe(true);
});
