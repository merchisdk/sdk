import { Merchi } from '../merchi';

test('can make Job', () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  expect(job).toBeTruthy();
});

test('Job deadline serialised to mini seconds', () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  job.deadline = new Date('2012.08.10');
  const correct = [['deadline', '1344520800']];
  const backData = Array.from((job.toFormData() as any).entries());
  expect(backData).toEqual(correct);
});
