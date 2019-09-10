import { Merchi } from '../merchi';

test('can make ComponentTag', () => {
  const merchi = new Merchi();
  const componentTag = new merchi.ComponentTag();
  expect(componentTag).toBeTruthy();
});
