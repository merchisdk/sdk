import { Merchi } from '../merchi';

test('can make DomainTag', () => {
  const merchi = new Merchi();
  const domainTag = new merchi.DomainTag();
  expect(domainTag).toBeTruthy();
});
