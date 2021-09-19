import { Merchi } from '../merchi';

test('can make ThemeCssSetting', () => {
  const merchi = new Merchi();
  const themeCssSetting = new merchi.ThemeCssSetting();
  expect(themeCssSetting).toBeTruthy();
});
