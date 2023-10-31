import { Merchi } from '../merchi';

test('can make InternalTag', () => {
  const merchi = new Merchi();
  const internalTag = new merchi.InternalTag();
  expect(internalTag).toBeTruthy();
});
