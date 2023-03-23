import { isNode, isDeno } from 'browser-or-node';

export function getCookie(name: string) {
  if (isNode || isDeno) {
    return undefined;
  }
  const searchPrefix = name + '=',
    cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; ++i) {
    let cookie = cookies[i];
    cookie = cookie.replace(/^\s*/, '');
    if (cookie.indexOf(searchPrefix) === 0) {
      return cookie.substring(searchPrefix.length, cookie.length);
    }
  }
  return undefined;
}
