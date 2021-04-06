import { Merchi } from '../merchi';

test('can make Shipment', () => {
  const merchi = new Merchi();
  const shipment = new merchi.Shipment();
  expect(shipment).toBeTruthy();
});

test('can calculation undefined handling', () => {
  const merchi = new Merchi();
  const shipment = new merchi.Shipment();
  expect(() => shipment.calculateSubTotal()).toThrow();
  expect(shipment.calculateSubTotal({strictEmbed: false})).toEqual('0.000');

  expect(() => shipment.calculateTaxAmount()).toThrow();
  expect(shipment.calculateTaxAmount({strictEmbed: false})).toEqual('0.000');
});

test('can calculation tax with tax type undefined', () => {
  const merchi = new Merchi();
  const shipment = new merchi.Shipment();
  shipment.cost = 0;
  expect(shipment.calculateTaxAmount()).toEqual('0.000');
});
