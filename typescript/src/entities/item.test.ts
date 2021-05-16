import { Merchi } from '../merchi';

test('can make Item', () => {
  const merchi = new Merchi();
  const item = new merchi.Item();
  expect(item).toBeTruthy();
});

test('totalCost', () => {
  const merchi = new Merchi();
  const item = new merchi.Item();
  expect(item.totalCost).toThrow();
  item.quantity = 2.3;
  expect(item.totalCost).toThrow();
  item.cost = 4.9;
  expect(item.totalCost()).toEqual(11.27);
  item.quantity = null;
  expect(item.totalCost()).toEqual(0);
});
