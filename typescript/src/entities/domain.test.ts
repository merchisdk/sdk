import { Merchi } from '../merchi';
import { setup, mockFetch } from '../test_util';

setup();

test('can make domain', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();
  expect(domain).toBeTruthy();
});

test('can get and set id', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();
  domain.id = 2;
  expect(domain.id).toBe(2);
});

test('can get and set domain', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();
  domain.domain = 'example.com';
  expect(domain.domain).toBe('example.com');
});

test('can create domain on server', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();
  domain.domain = 'example.com';
  const data = Array.from((domain.toFormData() as any).entries());
  const fetch = mockFetch(true, {}, 201);
  domain.create()
  const sentToServer = Array.from(fetch.mock.calls[0][1]['body'].entries());
  expect(sentToServer).toEqual(data);
});
