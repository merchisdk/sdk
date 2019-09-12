import { Merchi } from '../merchi';

test('can make EmailCounter', () => {
  const merchi = new Merchi();
  const emailCounter = new merchi.EmailCounter();
  expect(emailCounter).toBeTruthy();
});
