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
