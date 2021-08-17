import { NotificationUrgency } from './notification_urgencies';

test('urgent notification urgency exists', () => {
  expect(NotificationUrgency.URGENT).toBe(3);
});
