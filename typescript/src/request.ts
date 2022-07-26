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
      let errorText = '';
      let haveError = false;
      const expected = '{"loadingBar": "' + '.'.repeat(100) + '"}';
      function readChunk(): any {
        return reader.read().then(({done, value}) => {
          if (done) {
            if (response.status < 200 || response.status > 299) {
              const err = new ApiError('Unknown error');
              return Promise.reject(err);
            } else if(haveError) {
              try {
                const jsonText = JSON.parse(errorText);
                return Promise.reject(new ApiError(jsonText));
              } catch (e) {
                return Promise.reject(new ApiError(errorText));
              }
            } else {
              return bodyText;
            }
          } else {
            const chunk = new TextDecoder().decode(value);
            if (haveError) {
              errorText += chunk;
            } else {
              for (let i = 0; i < chunk.length; ++i) {
                const char = chunk[i];
                const expectedChar = expected[bodyText.length];
                if (expectedChar == char && !haveError) {
                  bodyText += char;
                } else {
                  haveError = true;
                  errorText += char;
                }
              }
            }
            if (!haveError && progressCallback) {
              const progress = Math.min(Math.max(0, bodyText.length - 16), 100);
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
