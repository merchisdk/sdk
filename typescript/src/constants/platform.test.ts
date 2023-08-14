import {
  platformName,
  platformCopyright,
  platformDomain,
  platformSellerDomain,
  platformSellerDomainPlus
} from './platform';

test('platform variables all there', () => {
  expect(platformName).toBe('Merchi');
  expect(platformCopyright).toBe(2021);
  expect(platformDomain).toBe('merchi.co');
  expect(platformSellerDomain).toBe('merchi.co');
  expect(platformSellerDomainPlus).toBe('merchi.co');
});
