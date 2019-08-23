// eslint-disable-next-line no-unused-vars
import { ErrorType, getErrorFromCode } from './constants/errors';

/* this constant are expected to be defined in webpack (or provided as
   globals by some other means. */
declare const BACKEND_URI: String;

export class ApiError extends Error {
  statusCode?: number;
  errorCode?: ErrorType;
  constructor(err: any) {
    const message = JSON.stringify(err);
    /* istanbul ignore next */
    super(message);
    this.statusCode = err.statusCode;
    this.errorCode = getErrorFromCode(err.errorCode);
    this.name = 'ApiError';
    this.message = message;
  }
}

export function apiFetch(resource: string, options?: RequestInit) {
  return backendFetch(resource, options).then(function (response) {
    if (response.status < 200 || response.status > 299) {
      return response.json().then(function (json) {
        const err = new ApiError(json);
        return Promise.reject(err);
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
