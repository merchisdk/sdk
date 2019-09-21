import { Merchi } from '../merchi';

test('can make Theme', () => {
  const merchi = new Merchi();
  const theme = new merchi.Theme();
  expect(theme).toBeTruthy();
});
