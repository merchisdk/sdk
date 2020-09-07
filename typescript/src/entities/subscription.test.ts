import { Merchi } from '../merchi';

test('can make Subscription', () => {
  const merchi = new Merchi();
  const subscription = new merchi.Subscription();
  expect(subscription).toBeTruthy();
});
