import { getCookie } from './cookie';

test('can get cookie', () => {
  const token = 'IMiF7rpT$5ciUJ38QY';
  const cookie = `session_token=${token}`;
  Object.defineProperty(document, 'cookie', {
    get: jest.fn().mockImplementation(() => { return cookie; }),
    set: jest.fn().mockImplementation(() => {}),
  });
  expect(getCookie('session_token')).toBe('IMiF7rpT$5ciUJ38QY');
});
