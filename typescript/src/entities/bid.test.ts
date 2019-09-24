import { Merchi } from '../merchi';

test('can make Bid', () => {
  const merchi = new Merchi();
  const bid = new merchi.Bid();
  expect(bid).toBeTruthy();
});

test('quoteTotal', () => {
  const merchi = new Merchi();
  const bid = new merchi.Bid();
  expect(bid.quoteTotal).toThrow();
  bid.bidItems = [new merchi.BidItem(), new merchi.BidItem()];
  bid.bidItems[0].unitPrice = 400;
  bid.bidItems[0].quantity = 2;
  bid.bidItems[1].unitPrice = 25;
  bid.bidItems[1].quantity = 2;
  expect(bid.quoteTotal()).toBe("850.000");
});

test('findBidItemIndex', () => {
  const merchi = new Merchi();
  const bid = new merchi.Bid();
  expect(() => bid.findBidItemIndex(43)).toThrow();
  bid.bidItems = [];
  expect(bid.findBidItemIndex(43)).toEqual(-1);
  bid.bidItems = [new merchi.BidItem()];
  bid.bidItems[0].id = 43;
  expect(bid.findBidItemIndex(43)).toEqual(0);
});

test('removeBidItem', () => {
  const merchi = new Merchi();
  const bid = new merchi.Bid();
  const bidItem = new merchi.BidItem();
  bidItem.id = 43;
  expect(() => bid.removeBidItem(bidItem)).toThrow();
  bidItem.id = undefined;
  expect(() => bid.removeBidItem(bidItem)).toThrow();
  bidItem.id = 43;
  bid.bidItems = [];
  expect(bid.removeBidItem(bidItem)).toBe(undefined);
  expect(bid.bidItems).toEqual([]);
  bid.bidItems = [bidItem];
  expect(bid.removeBidItem(bidItem)).toBe(undefined);
  expect(bid.bidItems).toEqual([]);
  bidItem.id = undefined;
  expect(() => bid.removeBidItem(bidItem)).toThrow();
});

test('deadlineTimeDifference', () => {
  const merchi = new Merchi();
  const bid = new merchi.Bid();
  expect(bid.deadlineTimeDifference).toThrow();
  bid.agreedDeadline = null;
  expect(bid.deadlineTimeDifference).toThrow();
  bid.assignments = [];
  expect(bid.deadlineTimeDifference()).toBe(null);
  bid.assignments = [new merchi.Assignment()];
  expect(bid.deadlineTimeDifference()).toBe(null);
  bid.agreedDeadline = new Date(1);
  expect(bid.deadlineTimeDifference).toThrow();
  bid.assignments[0].productionDeadline = new Date(2);
  expect(bid.deadlineTimeDifference()).toEqual(1);
});
