import { generateUUID } from './uuid';

test('can generate UUID', () => {
  const realRandom = global.Math.random;
  const randomStub = jest.fn(() => 0.4);
  global.Math.random = randomStub;

  const correct = '66666666-6666-4666-a666-666666666666';
  const attempt = generateUUID();

  expect(randomStub).toHaveBeenCalled();
  expect(attempt).toBe(correct);

  global.Math.random = realRandom;
});
