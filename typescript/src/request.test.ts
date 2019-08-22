import { apiFetch } from './request';
import { ErrorType } from './constants/errors';
import { mockFetch } from './test_util';

beforeEach(function() {
  (global as any).BACKEND_URI = 'example.com';
});

test('can pass through data from server', () => {
  mockFetch(true, {'animal': 'turtle'}, 200);
  return apiFetch('/test').then(data => {
    expect(data.animal).toBe('turtle');
  });
});

test('404 creates ApiError', () => {
  mockFetch(false, {'statusCode': 404, 'errorCode': ErrorType.RESOURCE_NOT_FOUND}, 404);
  (window as any).merchiBackendUri = 'override.example.com';
  apiFetch('/test').catch(e => {
    expect(e.statusCode).toBe(404);
    expect(e.name).toBe('ApiError');
    expect(e.errorCode).toBe(ErrorType.RESOURCE_NOT_FOUND);
  });
});

test('will get default errorCode', () => {
  mockFetch(false, {'statusCode': 404, 'errorCode': -1}, 404);
  (window as any).merchiBackendUri = 'override.example.com';
  apiFetch('/test').catch(e => {
    expect(e.statusCode).toBe(404);
    expect(e.name).toBe('ApiError');
    expect(e.errorCode).toBe(ErrorType.UNKNOWN_ERROR);
  });
});
