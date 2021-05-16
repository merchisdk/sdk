import { Merchi } from '../merchi';

test('can make QuoteItem', () => {
  const merchi = new Merchi();
  const quoteItem = new merchi.QuoteItem();
  expect(quoteItem).toBeTruthy();
});

test('total calculation', () => {
  const merchi = new Merchi();
  const quoteItem = new merchi.QuoteItem();

  const gst = new merchi.CountryTax();
  gst.taxName = 'GST';
  gst.taxPercent = 10;
  const noTax = merchi.CountryTax.getNoTax();

  quoteItem.unitPrice = 10;
  quoteItem.quantity = 1;

  // tax type not provided yet should be a embed issue
  expect(quoteItem.calculateTotal()).toEqual('10.000');
  expect(quoteItem.calculateTotal({strictEmbed: false})).toEqual('10.000');

  // quote total include tax type properly
  quoteItem.taxType = gst;
  expect(quoteItem.calculateTotal()).toEqual('11.000');
  quoteItem.taxType = noTax;
  expect(quoteItem.calculateTotal()).toEqual('10.000');

  // null and undefined price and quantity will throw error unless not strictly
  // require embed
  quoteItem.unitPrice = null;
  expect(quoteItem.calculateTotal({strictEmbed: false})).toEqual('0.000');

  quoteItem.unitPrice = 1;
  quoteItem.quantity = undefined;
  expect(() => quoteItem.calculateTotal()).toThrow();
  expect(quoteItem.calculateTotal({strictEmbed: false})).toEqual('0.000');

  quoteItem.unitPrice = undefined;
  quoteItem.quantity = 1;
  expect(() => quoteItem.calculateTotal()).toThrow();
  expect(quoteItem.calculateTotal({strictEmbed: false})).toEqual('0.000');

  // make sure float number recorded correctly
  quoteItem.quantity = 3.55;
  quoteItem.unitPrice = 87.12;
  expect(quoteItem.calculateTotal()).toEqual('309.276');
});
