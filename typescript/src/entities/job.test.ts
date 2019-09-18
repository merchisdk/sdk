import { Merchi } from '../merchi';

test('can make Job', () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  expect(job).toBeTruthy();
});
