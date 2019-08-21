import { generateUUID } from './uuid';

test('can generate UUID', () => {
  const realDateNow = Date.now.bind(global.Date);
  const dateNowStub = jest.fn(() => 1530518207007);
  global.Date.now = dateNowStub;

  const realRandom = global.Math.random;
  const randomStub = jest.fn(() => 0.5);
  global.Math.random = randomStub;

  const realPerformance = (global as any).performance.now;
  const performanceStub = jest.fn(() => 0.1);
  (global as any).performance.now = performanceStub; 

  const correct = '792f671d-ce98-4888-8888-888888888888';
  const attempt = generateUUID();

  expect(dateNowStub).toHaveBeenCalled();
  expect(randomStub).toHaveBeenCalled();
  expect(performanceStub).toHaveBeenCalled();
  expect(attempt).toBe(correct);

  global.Date.now = realDateNow;
  global.Math.random = realRandom;
  (global as any).performance.now = realPerformance;
});
