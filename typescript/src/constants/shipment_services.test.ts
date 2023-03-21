import { ShipmentService } from './shipment_services';

test('dhl exists', () => {
  expect(ShipmentService.SENDLE).toBe(1);
});
