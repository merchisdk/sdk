import { Merchi } from '../merchi';

test('can make DraftTemplate', () => {
  const merchi = new Merchi();
  const draftTemplate = new merchi.DraftTemplate();
  expect(draftTemplate).toBeTruthy();
});
