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
  public errorMessage: string;
  public original: any;
  public constructor(err: any) {
    const message = JSON.stringify(err);
    /* istanbul ignore next */
    super(message);
    this.statusCode = err.statusCode;
    this.errorCode = getErrorFromCode(err.errorCode);
    this.errorMessage = err.message ?
      err.message : 'No error message';
    this.name = 'ApiError';
    this.original = err;
  }
}

export const version = 'v6';

export function backendFetch(resource: string, options?: RequestOptions) {
  const server = (window as any).merchiBackendUri
    ? (window as any).merchiBackendUri
    : BACKEND_URI;
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

/* istanbul ignore next */
export function apiFetchWithProgress(
  resource: string,
  options?: RequestOptions,
  progressCallback?: (progress: number) => void
) {
  return backendFetch(resource, options as RequestInit | undefined).then(
    function (response) {
      if (!response.body) {
        const err = new ApiError('empty response');
        return Promise.reject(err);
      }
      const reader = response.body.getReader();
      let bodyText = '';
      function readChunk(): any {
        return reader.read().then(({done, value}) => {
          if (done) {
            if (response.status < 200 || response.status > 299) {
              const err = new ApiError('Unknown error');
              return Promise.reject(err);
            } else {
              return bodyText;
            }
          } else {
            bodyText += new TextDecoder().decode(value);
            const progress = Math.min(Math.max(0, bodyText.length - 16), 100);
            if (progressCallback) {
              progressCallback(progress);
            }
            return readChunk();
          }
        });    
      }
      return readChunk();
    }
  );
}
