import { Merchi } from '../merchi';

test('can make Assignment', () => {
  const merchi = new Merchi();
  const assignment = new merchi.Assignment();
  expect(assignment).toBeTruthy();
});
