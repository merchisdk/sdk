import {
  platformName,
  platformCopyright,
  platfromSellerDomain,
  platfromSellerDomainPlus
} from './platform';

test('platform variables all there', () => {
  expect(platformName).toBe('merchi');
  expect(platformCopyright).toBe(2019);
  expect(platfromSellerDomain).toBe('merchi.me');
  expect(platfromSellerDomainPlus).toBe('merchi.store');
});
