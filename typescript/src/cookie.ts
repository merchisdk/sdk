export function getCookie(name: string) {
  // code might be executed during SSR
  // istanbul ignore next
  if (typeof document !== 'undefined') {
    const searchPrefix = name + '=',
      cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; ++i) {
      let cookie = cookies[i];
      cookie = cookie.replace(/^\s*/, '');
      if (cookie.indexOf(searchPrefix) === 0) {
        return cookie.substring(searchPrefix.length, cookie.length);
      }
    }
  }
  return undefined;
}
