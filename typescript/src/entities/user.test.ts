import { Merchi } from '../merchi';

test('can make User', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  expect(user).toBeTruthy();
});

test('user get profile url short cut works', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  user.profilePicture = new merchi.MerchiFile();
  user.profilePicture.viewUrl = 'https://test.com';
  expect(user.getProfileUrl()).toBe('https://test.com');
});

test('user get profile url short cut for default', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  const defaulturl = 'https://defaulturl.com';
  expect(user.getProfileUrl(defaulturl)).toBe(defaulturl);
});
