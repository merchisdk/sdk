/* these constants are expected to be defined in webpack (or provided as
   globals by some other means. */
declare const FRONTEND_URI: String;
declare const BACKEND_URI: String;
declare const HTTP_PROTOCOL: String;

export class ApiError extends Error {
  statusCode?: number;
  errorCode?: number;
  constructor(err: any) {
    const message = JSON.stringify(err);
    super(message);
    this.statusCode = err.statusCode;
    this.errorCode = err.errorCode;
    this.name = 'ApiError';
    this.message = message;
  }
}

export function apiFetch(resource: string, options?: RequestInit) {
  return backendFetch(resource).then(function (response) {
    if (response.status < 200 || response.status > 299) {
      return response.json().then(function (json) {
        const err = new ApiError(json);
        return Promise.reject(err)
      });
    } else {
      return response.json(); 
    }
  });
}

function backendFetch(resource: string, options?: RequestInit) {
  const server = (window as any).merchiBackendUri ?
    (window as any).merchiBackendUri : BACKEND_URI;
  const version = 'v6';
  const url = server + version + resource;
  return fetch(url, options);
}
