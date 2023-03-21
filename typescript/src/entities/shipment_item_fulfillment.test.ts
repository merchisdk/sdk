import { Merchi } from '../merchi';

test('can make ShipmentItemFulfillment', () => {
  const merchi = new Merchi();
  const shipmentItemFulfillment =
    new merchi.ShipmentItemFulfillment();
  expect(shipmentItemFulfillment).toBeTruthy();
});
