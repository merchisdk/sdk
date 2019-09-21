import { Merchi } from '../merchi';

test('can make InventoryUnitVariation', () => {
  const merchi = new Merchi();
  const inventoryUnitVariation = new merchi.InventoryUnitVariation();
  expect(inventoryUnitVariation).toBeTruthy();
});
