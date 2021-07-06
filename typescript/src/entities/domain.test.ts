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
  domain.create();
  const sentToServer = Array.from(fetch.mock.calls[0][1]['body'].entries());
  expect(sentToServer).toEqual(data);
});

test('can delete domain', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();
  domain.id = 1;
  const fetch = mockFetch(true, {}, 204);
  domain.delete();
  expect(fetch.mock.calls[0][1].method).toBe('DELETE');
});

test('taxType', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();
  expect(domain.defaultTaxType).toThrow();
  domain.company = new merchi.Company();
  expect(domain.defaultTaxType).toThrow();
  const tax = new merchi.CountryTax();
  domain.company.defaultTaxType = tax;
  expect(domain.defaultTaxType()).toBe(tax);
  domain.company.defaultTaxType = null;
  expect(domain.defaultTaxType()).toBe(null);
});

test('can get domain active theme', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();

  // throw error if active theme is undefined which seems to be an embed issue
  expect(() => {domain.getActiveTheme();}).toThrow(Error);

  const theme = new merchi.Theme();
  domain.activeTheme = theme;
  expect(domain.getActiveTheme()).toEqual(theme);
});

test('fail to delete non-existant domain', () => {
  const merchi = new Merchi('YrDwzmh8&QGtAfg9quh(4QfSlE^RPXWl');
  const domain = new merchi.Domain();
  domain.id = -1;
  const fetch = mockFetch(true, {statusCode: 404}, 404);
  const invocation = domain.delete();
  expect(fetch.mock.calls[0][1].method).toBe('DELETE');
  return invocation.catch(e => expect(e.statusCode).toEqual(404));
});
