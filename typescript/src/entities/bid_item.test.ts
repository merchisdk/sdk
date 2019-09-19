import { Merchi } from '../merchi';

test('can make BidItem', () => {
  const merchi = new Merchi();
  const bidItem = new merchi.BidItem();
  expect(bidItem).toBeTruthy();
});
