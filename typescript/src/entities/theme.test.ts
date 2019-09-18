import { Merchi } from '../merchi';

test('can make Theme', () => {
  const merchi = new Merchi();
  const theme = new merchi.Theme();
  expect(theme).toBeTruthy();
});

test('can be activated', () => {
  const merchi = new Merchi();
  const theme = new merchi.Theme();
  expect(theme.canBeActivated).toThrow();
  theme.mainCssStatus = 3;
  theme.emailCssStatus = 3;
  expect(theme.canBeActivated()).toBe(true);
  theme.mainCssStatus = 1;
  expect(theme.canBeActivated()).toBe(false);
});
