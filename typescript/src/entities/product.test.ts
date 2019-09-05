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

test('can get and set domain', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  const domain = new merchi.Domain();
  product.domain = domain;
  expect(product.domain).toBe(domain);
});

test('can fetch product from server', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  mockFetch(true, {'product': {'name': testName}}, 200);
  return merchi.Product.get(1).then(product => expect(product.name).toBe(testName));
});

test('can fetch with explicit session token', () => {
  const testToken = "YrDwzmh8&QGtAfg9quh(4QfSlE^RPXWl";
  const merchi = new Merchi(testToken);
  const testName = 'S7qHUfV_dr5l';
  mockFetch(true, {'product': {'name': testName}}, 200);
  return merchi.Product.get(1).then(product => expect(product.name).toBe(testName));
});

test('can specify options in request', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const fetch = mockFetch(true, {'product': {'name': testName}}, 200);
  const options = {includeArchived: true,
                   withRights: true}; 
  const invocation = merchi.Product.get(1, options).then(product => expect(product.name).toBe(testName));
  const correct = [['include_archived', 'true']];
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
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

test('can fetch product with category and explcit session', () => {
  const testToken = "YrDwzmh8&QGtAfg9quh(4QfSlE^RPXWl";
  const merchi = new Merchi(testToken);
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

test('can list products from server with explicit session token', () => {
  const testToken = "YrDwzmh8&QGtAfg9quh(4QfSlE^RPXWl";
  const merchi = new Merchi(testToken);
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

test('can save product', () => {
  const merchi = new Merchi();
  const c1 = new merchi.Category();
  const p = new merchi.Product();
  const c2 = new merchi.Category();
  const d = new merchi.Domain();
  p.categories = [c2];
  p.domain = d;
  c1.products = [p];
  c1.save();
  d.domain = "3onrb6o4";
  p.name = "pHyz7ZucK#";
  c2.name = "8&OaUsDgJ$ev3FYZ3";
  p.save();
  const fetch = mockFetch(true, {}, 200);
  c1.save();
  const correct =  [['products-0-name', 'pHyz7ZucK#'],
    ['products-0-categories-0-name', '8&OaUsDgJ$ev3FYZ3'],
    ['products-0-categories-count', '1'],
    ['products-0-domain-0-domain', '3onrb6o4'],
    ['products-0-domain-count', '1'],
    ['products-count', '1']];

  expect(Array.from(fetch.mock.calls[0][1]['body'].entries())).toEqual(correct);
});

test('can serialise product to form data understood by backend', () => {
  const merchi = new Merchi();
  const c1 = new merchi.Category();
  const p = new merchi.Product();
  const c2 = new merchi.Category();
  const d = new merchi.Domain();
  p.categories = [c2];
  p.domain = d;
  c1.products = [p];
  c1.save();
  d.domain = "3onrb6o4";
  p.name = "pHyz7ZucK#";
  c2.name = "8&OaUsDgJ$ev3FYZ3";
  const correct = [[ 'name', 'pHyz7ZucK#'],
    ['categories-0-name', '8&OaUsDgJ$ev3FYZ3'],
    ['categories-count', '1'],
    ['domain-0-domain', '3onrb6o4'],
    ['domain-count', '1']];
  expect(Array.from((p.toFormData() as any).entries())).toEqual(correct);
});
