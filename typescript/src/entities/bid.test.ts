import { Merchi } from '../merchi';

test('can make Bid', () => {
  const merchi = new Merchi();
  const bid = new merchi.Bid();
  expect(bid).toBeTruthy();
});
