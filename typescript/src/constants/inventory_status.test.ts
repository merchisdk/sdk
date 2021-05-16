import { InventoryStatus } from './inventory_statuses';

test('inventory deducted', () => {
  expect(InventoryStatus.DEDUCTED).toBe(0);
});
