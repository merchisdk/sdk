import { apiFetch } from './index';

beforeEach(function() {
  (global as any).BACKEND_URI = 'example.com';
});

function mockFetch(ok: boolean, data: any, status: number) {
  (global as any).fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      status: status,
      ok: ok,
      json: () => Promise.resolve(data)
    })
  );
}

test('can pass through data from server', () => {
   mockFetch(true, {'animal': 'turtle'}, 200);
   return apiFetch('/test').then(data => {
      expect(data.animal).toBe('turtle')
   });
});

test('404 creates ApiError', () => {
   mockFetch(false, {'statusCode': 404}, 404);
   (window as any).merchiBackendUri = 'override.example.com';
   apiFetch('/test').catch(e => {
      expect(e.statusCode).toBe(404);
      expect(e.name).toBe('ApiError');
   });
});
