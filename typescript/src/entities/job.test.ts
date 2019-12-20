import { Merchi } from '../merchi';

test('can make Job', () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  expect(job).toBeTruthy();
});

test("toFormData serialised nullable object", () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  job.clientEmail = new merchi.EmailAddress();
  job.clientEmail.emailAddress = 'test@example.com'
  const correct = [
    ['clientEmail-0-emailAddress', 'test@example.com'],
    ['clientEmail-count', '1'],
  ];
  expect(Array.from((job.toFormData() as any).entries())).toEqual(correct);
});

test('Job deadline serialised to mini seconds', () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  job.deadline = new Date('Feb 28 2013 19:00:00 GMT-0500');
  const correct = [['deadline', '1362096000']];
  const backData = Array.from((job.toFormData() as any).entries());
  expect(backData).toEqual(correct);
});
