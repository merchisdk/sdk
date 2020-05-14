import { setup, mockFetch } from './test_util';
import { toastNotifications } from './toasts';
import { Merchi } from './merchi';
import { NotificationSection } from './constants/notification_sections';
import { NotificationType } from './constants/notification_types';


setup();

test('fetch toast of jobs', () => {
  const merchi = new Merchi();
  const fetch = mockFetch(
    true, {'notifications': [{id: 1, message: 'test'}]}, 200);
  const entities = [{id: 1, type: 'job'}];
  const sections = [NotificationSection.JOB_NOTIFICATIONS];
  const notificationTypes = {[NotificationType.JOB_PAID]: true};

  const options = {entities, sections, notificationTypes};
  const invocation = toastNotifications(merchi, options as any);
  const expectUrl = `${(global as any).BACKEND_URI}v6/notifications-check-update/`;
  expect(fetch.mock.calls[0][0]).toEqual(expectUrl);
  expect(fetch.mock.calls[0][1].method).toEqual('POST');
  expect(JSON.parse(fetch.mock.calls[0][1].body.get('entities'))).toEqual(
    [{id: 1, type: 'job'}]);
  expect(fetch.mock.calls[0][1].body.get('sections')).toEqual(
    `[${NotificationSection.JOB_NOTIFICATIONS}]`);
  expect(
    JSON.parse(fetch.mock.calls[0][1].body.get('notificationTypes'))
  ).toEqual(
    {[NotificationType.JOB_PAID]: true}
  );
  invocation.then(notifications => {
    expect(notifications.length).toBe(1);
    expect(notifications[0].id).toBe(1);
    expect(notifications[0].message).toBe('test');
  });
  return invocation;
});
