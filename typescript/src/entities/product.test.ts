import { Merchi } from '../merchi';
import { setup, mockFetch } from '../test_util';

setup();

test('can make product', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  expect(product).toBeTruthy();
});

test('can get and set id', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  product.id = 2;
  expect(product.id).toBe(2);
});

test('can get and set name', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  product.name = 'example';
  expect(product.name).toBe('example');
});

test('can fetch product from server', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  mockFetch(true, {'product': {'name': testName}}, 200);
  return merchi.Product.get(1).then(product => expect(product.name).toBe(testName));
});

test('can fetch product with category', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const categoryName = 'l3VfG#S+';
  const categoryData = {'name': categoryName};
  mockFetch(true, {'product': {'name': testName,
                               'categories': [categoryData]}}, 200);
  const r = merchi.Product.get(1, {'embed': {'categories': {}}});
  return r.then(product => {
    expect(product.name).toBe(testName);
    expect(((product.categories as any)[0] as any).name).toBe(categoryName);
  });
});

test('handle nonsense from server', () => {
  const merchi = new Merchi();
  // non existent property just ignored. no crash, no update
  mockFetch(true, {'product': {'no such property!!!': 'unused'}}, 200);
  merchi.Product.get(1);
});

test('can list products from server', () => {
  const merchi = new Merchi();
  mockFetch(true, {'products': [{'product': {'name': 'p1'}},
                                {'product': {'name': 'p2'}}],
                   'available': 2,
                   'count': 2}, 200);
  return merchi.Product.list().then(({items: d, metadata: md}) => {
    expect(d.length).toBe(2);
    expect(d[0].name).toBe('p1');
    expect(d[1].name).toBe('p2');
    expect(md.available).toBe(2);
    expect(d[0].categories).toBe(undefined);
  });
});

test('can list products from server with category', () => {
  const merchi = new Merchi();
  const categoriesData = [{'name': 'c1'}];
  mockFetch(true, {'products': [{'product': {'name': 'p1',
                                             'categories': categoriesData}},
                                {'product': {'name': 'p2',
                                             'categories': categoriesData}}],
                   'available': 2,
                   'count': 2}, 200);
  const r = merchi.Product.list({'embed': {'categories': {}}});
  return r.then(({items: d, metadata: md}) => {
    expect(d.length).toBe(2); 
    expect(d[0].name).toBe('p1');
    expect(d[1].name).toBe('p2');
    expect(md.available).toBe(2);
    expect((d[0].categories as any)[0].name).toBe('c1');
  });
});
