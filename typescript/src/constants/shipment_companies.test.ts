import { ShipmentCompany } from './shipment_companies';

test('dhl exists', () => {
  expect(ShipmentCompany.DHL).toBe(0);
});
