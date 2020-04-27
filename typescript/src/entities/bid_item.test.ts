import { Merchi } from '../merchi';

test('can make BidItem', () => {
  const merchi = new Merchi();
  const bidItem = new merchi.BidItem();
  expect(bidItem).toBeTruthy();
});

test('total', () => {
  const merchi = new Merchi();
  const bidItem = new merchi.BidItem();
  expect(bidItem.total).toThrow();
  bidItem.quantity = 3.55;
  expect(bidItem.total).toThrow();
  bidItem.unitPrice = null;
  expect(bidItem.total()).toEqual('0.000');
  bidItem.unitPrice = 87.12;
  expect(bidItem.total()).toEqual('309.276');
});
