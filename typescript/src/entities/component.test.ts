import { Merchi } from '../merchi';

test('can make Component', () => {
  const merchi = new Merchi();
  const component = new merchi.Component();
  expect(component).toBeTruthy();
});
