import { Merchi } from '../merchi';

test('can make EmailAddress', () => {
  const merchi = new Merchi();
  const emailAddress = new merchi.EmailAddress();
  expect(emailAddress).toBeTruthy();
});
