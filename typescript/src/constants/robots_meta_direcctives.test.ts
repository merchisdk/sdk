import { ROBOTS_META_DIRECTIVES } from './robots_meta_direcctives';

test('robot meta directive exists', () => {
  expect(ROBOTS_META_DIRECTIVES[0]).toBe("noindex");
});
