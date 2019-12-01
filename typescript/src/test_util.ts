export function setup() {
  beforeAll(function() {
    (global as any).BACKEND_URI = 'http://example.com/';
  });
}

export function mockFetch(ok: boolean, data: any, status: number) {
  const mock = jest.fn();
  mock.mockImplementation(() =>
    Promise.resolve({
      status: status,
      ok: ok,
      json: () => Promise.resolve(data)
    })
  );
  (global as any).fetch = mock;
  return mock;
}
