import { Merchi } from '../merchi';

test('can make Item', () => {
  const merchi = new Merchi();
  const item = new merchi.Item();
  expect(item).toBeTruthy();
});
