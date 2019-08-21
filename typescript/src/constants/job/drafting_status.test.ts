import { DraftingStatus } from './drafting_status';

test('init status exists', () => {
  expect(DraftingStatus.INIT).toBe(0);
});
