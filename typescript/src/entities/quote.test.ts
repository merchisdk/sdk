import { Merchi } from '../merchi';

test('can make Quote', () => {
  const merchi = new Merchi();
  const quote = new merchi.Quote();
  expect(quote).toBeTruthy();
});

test('quoteTotal', () => {
  const merchi = new Merchi();
  const quote = new merchi.Quote();
  expect(quote.quoteTotal).toThrow();
  quote.quoteItems = [new merchi.QuoteItem(), new merchi.QuoteItem()];
  quote.quoteItems[0].unitPrice = 400;
  quote.quoteItems[0].quantity = 2;
  quote.quoteItems[1].unitPrice = 25;
  quote.quoteItems[1].quantity = 2;
  expect(quote.quoteTotal()).toBe('850.000');
});

test('findQuoteItemIndex', () => {
  const merchi = new Merchi();
  const quote = new merchi.Quote();
  expect(() => quote.findQuoteItemIndex(43)).toThrow();
  quote.quoteItems = [];
  expect(quote.findQuoteItemIndex(43)).toEqual(-1);
  quote.quoteItems = [new merchi.QuoteItem()];
  quote.quoteItems[0].id = 43;
  expect(quote.findQuoteItemIndex(43)).toEqual(0);
});

test('removeQuoteItem', () => {
  const merchi = new Merchi();
  const quote = new merchi.Quote();
  const quoteItem = new merchi.QuoteItem();
  quoteItem.id = 43;
  expect(() => quote.removeQuoteItem(quoteItem)).toThrow();
  quoteItem.id = undefined;
  expect(() => quote.removeQuoteItem(quoteItem)).toThrow();
  quoteItem.id = 43;
  quote.quoteItems = [];
  expect(quote.removeQuoteItem(quoteItem)).toBe(undefined);
  expect(quote.quoteItems).toEqual([]);
  quote.quoteItems = [quoteItem];
  expect(quote.removeQuoteItem(quoteItem)).toBe(undefined);
  expect(quote.quoteItems).toEqual([]);
  quoteItem.id = undefined;
  expect(() => quote.removeQuoteItem(quoteItem)).toThrow();
});

test('deadlineTimeDifference', () => {
  const merchi = new Merchi();
  const quote = new merchi.Quote();
  expect(quote.deadlineTimeDifference).toThrow();
  quote.agreedDeadline = null;
  expect(quote.deadlineTimeDifference).toThrow();
  quote.assignments = [];
  expect(quote.deadlineTimeDifference()).toBe(null);
  quote.assignments = [new merchi.Assignment()];
  expect(quote.deadlineTimeDifference()).toBe(null);
  quote.agreedDeadline = new Date(1);
  expect(quote.deadlineTimeDifference).toThrow();
  quote.assignments[0].productionDeadline = new Date(2);
  expect(quote.deadlineTimeDifference()).toEqual(1);
});
