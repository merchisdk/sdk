import { InternalTag } from '../internal_tag.js';

describe('InternalTag', () => {
  test('colour attribute is a string', () => {
    const tag = new InternalTag();
    tag.colour = '#FFFFFF';
    expect(typeof tag.colour).toBe('string');
    expect(tag.colour).toBe('#FFFFFF');
  });

  test('create method works as expected', () => {
    const tag = new InternalTag();
    tag.create(() => {}, () => {}, false, 1);
    expect(tag.resource).toBe('/internal_tags');
  });

  test('get method works as expected', () => {
    const tag = new InternalTag();
    tag.get(() => {}, () => {});
    expect(tag.resource).toBe('/internal_tags');
  });

  test('patch method works as expected', () => {
    const tag = new InternalTag();
    tag.patch(() => {}, () => {}, false);
    expect(tag.resource).toBe('/internal_tags');
  });

  test('destroy method works as expected', () => {
    const tag = new InternalTag();
    tag.destroy(() => {}, () => {});
    expect(tag.resource).toBe('/internal_tags');
  });
});
