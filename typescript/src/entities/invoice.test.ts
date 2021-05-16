import { setup, mockFetch } from '../test_util';
import { Merchi } from '../merchi';

setup();

test('can make Invoice', () => {
  const merchi = new Merchi();
  const invoice = new merchi.Invoice();
  expect(invoice).toBeTruthy();
});

test('pass cookie tokens to query string', () => {
  const cookie = 'session_token=s; client_token=c; invoice_token=i';
  Object.defineProperty(document, 'cookie', {
    get: jest.fn().mockImplementation(() => { return cookie; }),
    set: jest.fn().mockImplementation(() => {}),
  });
  const correct = [
    ['skip_rights', 'y'],
    ['session_token', 's'],
    ['client_token', 'c'],
    ['invoice_token', 'i'],
  ];
  const fetch = mockFetch(true, {'invoice': {'id': 1}}, 200);
  const merchi = new Merchi();
  const invocation = merchi.Invoice.get(1);
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
});

test('client and invoice tokens supported by merchi', () => {
  const merchi = new Merchi('s', 'c', 'i');
  const correct = [
    ['skip_rights', 'y'],
    ['session_token', 's'],
    ['client_token', 'c'],
    ['invoice_token', 'i'],
  ];
  const fetch = mockFetch(true, {'invoice': {'id': 1}}, 200);
  const invocation = merchi.Invoice.get(1);
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
});
