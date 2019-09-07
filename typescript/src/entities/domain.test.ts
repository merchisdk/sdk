import { Merchi } from '../merchi';

test('can make domain', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();
  expect(domain).toBeTruthy();
});

test('can get and set id', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();
  domain.id = 2;
  expect(domain.id).toBe(2);
});

test('can get and set domain', () => {
  const merchi = new Merchi();
  const domain = new merchi.Domain();
  domain.domain = 'example.com';
  expect(domain.domain).toBe('example.com');
});
