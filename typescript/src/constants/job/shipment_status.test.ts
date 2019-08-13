import { ShipmentStatus } from './shipment_status';

test('not assigned status exists', () => {
  expect(ShipmentStatus.NOT_ASSIGNED).toBe(0);
});
