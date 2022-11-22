import { Merchi } from '../merchi';

test('can make SeoDomainPage', () => {
  const merchi = new Merchi();
  const seoDomainPage = new merchi.SeoDomainPage();
  expect(seoDomainPage).toBeTruthy();
});
