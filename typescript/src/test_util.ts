export function setup() {
  beforeAll(function() {
    (global as any).BACKEND_URI = 'http://example.com/';
  });
}

export function mockFetch(ok: boolean, data: any, status: number) {
  (global as any).fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      status: status,
      ok: ok,
      json: () => Promise.resolve(data)
    })
  );
}
