import { Merchi } from '../merchi';

test('can make Draft', () => {
  const merchi = new Merchi();
  const draft = new merchi.Draft();
  expect(draft).toBeTruthy();
});

test('whereChangesRequested', () => {
  const merchi = new Merchi();
  const draft = new merchi.Draft();
  expect(draft.whereChangesRequested).toThrow();
  draft.comments = [];
  expect(draft.whereChangesRequested()).toBe(false);
  draft.comments = [new merchi.DraftComment()]; 
  expect(draft.whereChangesRequested).toThrow();
  draft.comments[0].changeRequest = false;
  expect(draft.whereChangesRequested()).toBe(false);
  draft.comments[0].changeRequest = true;
  expect(draft.whereChangesRequested()).toBe(true);
});

test('commentsYoungestToEldest', () => {
  const merchi = new Merchi();
  const draft = new merchi.Draft();
  expect(draft.commentsYoungestToEldest).toThrow();
  draft.comments = [];
  expect(draft.commentsYoungestToEldest()).toEqual([]);
  draft.comments = [new merchi.DraftComment(), new merchi.DraftComment()];
  expect(draft.commentsYoungestToEldest).toThrow();
  draft.comments[0].id = 2;
  draft.comments[1].id = 1;
  expect(draft.commentsYoungestToEldest()[0].id).toEqual(1);
});
