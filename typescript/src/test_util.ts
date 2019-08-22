export function mockFetch(ok: boolean, data: any, status: number) {
  (global as any).fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      status: status,
      ok: ok,
      json: () => Promise.resolve(data)
    })
  );
}
