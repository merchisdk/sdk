import { Merchi } from '../merchi';
import { setup, mockFetch } from '../test_util';

setup();

test('can make file', () => {
  const merchi = new Merchi();
  const file = new merchi.MerchiFile();
  expect(file).toBeTruthy();
});

test('can get and set id', () => {
  const merchi = new Merchi();
  const file = new merchi.MerchiFile();
  file.id = 2;
  expect(file.id).toBe(2);
});

test('can upload file', () => {
  const merchi = new Merchi();
  const file = new merchi.MerchiFile();
  const jsFile = new File([''], 'name');
  file.fromFormFile(jsFile);
  const fetch = mockFetch(true, {}, 200);
  file.create();
  const sentToServer = fetch.mock.calls[0][1];
  expect(sentToServer.method).toBe('POST');
  const data: any = Array.from(sentToServer.body.entries());
  expect(data[0][1]).toBe(jsFile);
  expect(data[1]).toEqual(['fileDataIndex', '0']);
});

test('isImage', () => {
  const merchi = new Merchi();
  const file = new merchi.MerchiFile();
  expect(file.isImage).toThrow();
  file.mimetype = null;
  expect(file.isImage()).toEqual(false);
  file.mimetype = 'application/pdf';
  expect(file.isImage()).toEqual(false);
  file.mimetype = 'image/png';
  expect(file.isImage()).toEqual(true);
});
