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

test('is active on domain', () => {
  const merchi = new Merchi();
  const theme = new merchi.Theme();
  theme.id = 3;
  const otherTheme = new merchi.Theme();
  otherTheme.id = 4;
  const domain = new merchi.Domain();
  domain.id = 1;
  expect(() => theme.isActiveOnDomain(1)).toThrow();
  theme.domain = null;
  expect(theme.isActiveOnDomain(1)).toBe(false);
  theme.domain = domain; 
  expect(() => theme.isActiveOnDomain(1)).toThrow();
  domain.activeTheme = otherTheme;
  expect(theme.isActiveOnDomain(1)).toBe(false);
  domain.activeTheme = theme;
  expect(theme.isActiveOnDomain(1)).toBe(true);
  expect(theme.isActiveOnDomain(2)).toBe(false);
});
