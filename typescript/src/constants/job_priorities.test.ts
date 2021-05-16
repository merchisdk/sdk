import { JobPriority } from './job_priorities';

test('urgent priority exists', () => {
  expect(JobPriority.URGENT).toBe(1);
});
