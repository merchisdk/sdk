export function getCookie(name: string) {
  var searchPrefix = name + '=',
    cookies = document.cookie.split(';'),
    i,
    cookie;
  for (i = 0; i < cookies.length; ++i) {
    cookie = cookies[i];
    cookie = cookie.replace(/^\s*/, '');
    if (cookie.indexOf(searchPrefix) === 0) {
      return cookie.substring(searchPrefix.length, cookie.length);
    }
  }
  return undefined;
}
