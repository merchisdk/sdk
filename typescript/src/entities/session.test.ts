import { Merchi } from '../merchi';

test('can make Session', () => {
  const merchi = new Merchi();
  const session = new merchi.Session();
  expect(session).toBeTruthy();
});
