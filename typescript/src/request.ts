// eslint-disable-next-line no-unused-vars
import { ErrorType, getErrorFromCode } from './constants/errors';

/* this constant are expected to be defined in webpack (or provided as
   globals by some other means. */
declare const BACKEND_URI: string;

export interface RequestOptions extends RequestInit {
  query?: string[][];
}

export class ApiError extends Error {
  public statusCode?: number;
  public errorCode?: ErrorType;
  public original: any;
  public constructor(err: any) {
    const message = JSON.stringify(err);
    /* istanbul ignore next */
    super(message);
    this.statusCode = err.statusCode;
    this.errorCode = getErrorFromCode(err.errorCode);
    this.name = 'ApiError';
    this.original = err;
  }
}

export function backendFetch(resource: string, options?: RequestOptions) {
  const server = (window as any).merchiBackendUri
    ? (window as any).merchiBackendUri
    : BACKEND_URI;
  const version = 'v6';
  const url = new URL(server + version + resource);
  if (options && options.query) {
    for (const entry of options.query) {
      url.searchParams.append(entry[0], entry[1]);
    }
  }
  return fetch(url.toString(), options);
}

export function apiFetch(
  resource: string,
  options?: RequestOptions,
  expectEmptyResponse?: boolean
) {
  return backendFetch(resource, options as RequestInit | undefined).then(
    function (response) {
      if (response.status < 200 || response.status > 299) {
        return response.json().then(function (json) {
          const err = new ApiError(json);
          return Promise.reject(err);
        });
      } else {
        return expectEmptyResponse ? '' : response.json();
      }
    }
  );
}
