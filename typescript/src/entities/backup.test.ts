import { Merchi } from '../merchi';

test('can make Backup', () => {
  const merchi = new Merchi();
  const backup = new merchi.Backup();
  expect(backup).toBeTruthy();
});
