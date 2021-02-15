import { Merchi } from '../merchi';

test('can make Draft', () => {
  const merchi = new Merchi();
  const draft = new merchi.Draft();
  expect(draft).toBeTruthy();
});

test('wereChangesRequested', () => {
  const merchi = new Merchi();
  const draft = new merchi.Draft();
  expect(draft.wereChangesRequested).toThrow();
  draft.comments = [];
  expect(draft.wereChangesRequested()).toBe(false);
  draft.comments = [new merchi.DraftComment()]; 
  expect(draft.wereChangesRequested).toThrow();
  draft.comments[0].changeRequest = false;
  expect(draft.wereChangesRequested()).toBe(false);
  draft.comments[0].changeRequest = true;
  expect(draft.wereChangesRequested()).toBe(true);
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

test('draft accepted serialised to milliseconds', () => {
  const merchi = new Merchi();
  const draft = new merchi.Draft();
  draft.accepted = new Date('Feb 28 2013 19:00:00 GMT-0500');
  const correct = [['accepted', '1362096000']];
  const backData = Array.from((draft.toFormData() as any).entries());
  expect(backData).toEqual(correct);
});
