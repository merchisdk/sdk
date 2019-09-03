import { Merchi } from '../merchi';

test('can make category', () => {
  const merchi = new Merchi();
  const category = new merchi.Category();
  expect(category).toBeTruthy();
});

test('can get and set id', () => {
  const merchi = new Merchi();
  const category = new merchi.Category();
  category.id = 2;
  expect(category.id).toBe(2);
});

test('can get and set name', () => {
  const merchi = new Merchi();
  const category = new merchi.Category();
  category.name = 'example';
  expect(category.name).toBe('example');
});

test('can get and set product', () => {
  const merchi = new Merchi();
  const c1 = new merchi.Category();
  const c2 = new merchi.Category();
  const p1 = new merchi.Product();
  const p2 = new merchi.Product();
  const cs = [c1, c2];
  const ps = [p1, p2];
  c1.products = ps;
  expect(c1.products).toBe(ps);
  expect(c2.products).toBe(undefined);
  expect(p1.categories).toBe(undefined);
  p1.categories = cs;
  expect(p1.categories).toBe(cs);
  p1.categories = undefined;
  expect(p1.categories).toBe(undefined);
});
