import { Merchi } from '../merchi';
import { setup, mockFetch } from '../test_util';

setup();

test('can make Job', () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  expect(job).toBeTruthy();
});

test('Job deadline serialised to milliseconds in form data', () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  job.deadline = new Date('Feb 28 2013 19:00:00 GMT-0500');
  const correct = [['deadline', '1362096000']];
  const backData = Array.from((job.toFormData() as any).entries());
  expect(backData).toEqual(correct);
});

test('Job deadline serialised to milliseconds in JSON', () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  job.deadline = new Date('Feb 28 2013 19:00:00 GMT-0500');
  const jobJson = job.toJson();
  expect(jobJson.deadline).toEqual(1362096000);
});

test('Job deadline serialised from milliseconds in JSON', () => {
  const merchi = new Merchi();
  const job = new merchi.Job().fromJson({deadline: 1362096000});
  expect(job.deadline).toEqual(new Date('Feb 28 2013 19:00:00 GMT-0500'));
});

test('add two files to job', () => {
  const merchi = new Merchi();
  const job = new merchi.Job();
  const f1 = new merchi.MerchiFile();
  f1.fromFormFile(new File([''], '1'));
  const f2 = new merchi.MerchiFile();
  f2.fromFormFile(new File([''], '2'));
  job.clientFiles = [f1, f2];
  const fetch = mockFetch(true, {'job': {}}, 200);
  return job.save().then(() => {
    const data: any = Array.from(fetch.mock.calls[0][1]['body'].entries());
    expect(data[1][1]).toEqual('0');
    expect(data[2][1]).toEqual('1');
    expect(data[6][1]).toEqual('1');
    expect(data[10][1]).toEqual('2');
  });
});

test('Get quote update job cost', () => {
  const merchi = new Merchi();
  const job = new merchi.Job().fromJson({'quantity': 10, 'cost': 0});
  mockFetch(true, {'quantity': 10, 'cost': 100}, 200);
  job.getQuote().then(job => {
    expect(job.quantity).toEqual(10);
    expect(job.cost).toEqual(100);
  });
});
