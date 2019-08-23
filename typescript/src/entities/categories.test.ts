import { Category } from './categories';

test('can make category', () => {
  const category = new Category();
  expect(category).toBeTruthy();
});

test('can get and set id', () => {
  const category = new Category();
  category.id = 2;
  expect(category.id).toBe(2);
});

test('can get and set name', () => {
  const category = new Category();
  category.name = 'example';
  expect(category.name).toBe('example');
});
