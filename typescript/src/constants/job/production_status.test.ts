import { ProductionStatus } from './production_status';

test('init status exists', () => {
  expect(ProductionStatus.INIT).toBe(0);
});
