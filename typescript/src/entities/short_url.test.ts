import { Merchi } from '../merchi';

test('can make ShortUrl', () => {
  const merchi = new Merchi();
  const shortUrl = new merchi.ShortUrl();
  expect(shortUrl).toBeTruthy();
});
