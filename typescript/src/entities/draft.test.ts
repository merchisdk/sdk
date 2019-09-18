import { Merchi } from '../merchi';

test('can make Draft', () => {
  const merchi = new Merchi();
  const draft = new merchi.Draft();
  expect(draft).toBeTruthy();
});
