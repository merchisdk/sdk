import { DraftingStatus } from './job_status';

test('init drafting status exists', () => {
  expect(DraftingStatus.INIT).toBe(0);
});
