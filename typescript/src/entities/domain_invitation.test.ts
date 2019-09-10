import { Merchi } from '../merchi';

test('can make DomainInvitation', () => {
  const merchi = new Merchi();
  const domainInvitation = new merchi.DomainInvitation();
  expect(domainInvitation).toBeTruthy();
});
