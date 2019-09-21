import { Merchi } from '../merchi';

test('can make JobComment', () => {
  const merchi = new Merchi();
  const jobComment = new merchi.JobComment();
  expect(jobComment).toBeTruthy();
});
