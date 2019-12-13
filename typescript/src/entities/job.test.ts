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


