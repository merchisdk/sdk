import { Merchi } from '../merchi';

test('can make QuoteItem', () => {
  const merchi = new Merchi();
  const quoteItem = new merchi.QuoteItem();
  expect quoteItem).toBeTruthy();
});

test('total', () => {
  const merchi = new Merchi();
  const quoteItem = new merchi.QuoteItem();
  quoteItem.quantity = 3.55;
  quoteItem.unitPrice = null;
  expect quoteItem.total()).toEqual('0.000');
  quoteItem.unitPrice = 87.12;
  expect quoteItem.total()).toEqual('309.276');
  quoteItem.quantity = undefined;
  expect quoteItem.total()).toEqual('0.000');
});
