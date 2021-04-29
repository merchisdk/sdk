import {
  platformName,
  platformCopyright,
  platformDomain,
  platfromSellerDomain,
  platfromSellerDomainPlus
} from './platform';

test('platform variables all there', () => {
  expect(platformName).toBe('merchi');
  expect(platformCopyright).toBe(2021);
  expect(platformDomain).toBe('merchi.co');
  expect(platfromSellerDomain).toBe('merchi.me');
  expect(platfromSellerDomainPlus).toBe('merchi.store');
});
