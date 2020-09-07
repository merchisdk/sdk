import { Merchi } from '../merchi';

test('can make Subscription plan', () => {
  const merchi = new Merchi();
  const subscription = new merchi.SubscriptionPlan();
  expect(subscription).toBeTruthy();
});
