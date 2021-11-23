import { Merchi } from '../merchi';

test('can make Component', () => {
  const merchi = new Merchi();
  const component = new merchi.Component();
  expect(component).toBeTruthy();
});

test('can convert to react component', () => {
  const merchi = new Merchi();
  const component = new merchi.Component();
  component.compiled = 'return 1;';
  component.toReact({});
});
