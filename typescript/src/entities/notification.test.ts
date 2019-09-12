import { Merchi } from '../merchi';

test('can make Notification', () => {
  const merchi = new Merchi();
  const notification = new merchi.Notification();
  expect(notification).toBeTruthy();
});
