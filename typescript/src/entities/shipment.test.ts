import { Merchi } from '../merchi';

test('can make Shipment', () => {
  const merchi = new Merchi();
  const shipment = new merchi.Shipment();
  expect(shipment).toBeTruthy();
});
