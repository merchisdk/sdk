import { Merchi } from '../merchi';

test('can make SubscriptionPlan', () => {
  const merchi = new Merchi();
  const subscriptionPlan = new merchi.SubscriptionPlan();
  expect(subscriptionPlan).toBeTruthy();
});
