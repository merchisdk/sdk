import { robotsMetaDirectives } from './robots_meta_directives';

test('robot meta directive exists', () => {
  expect(robotsMetaDirectives[0]).toBe('noindex');
});
