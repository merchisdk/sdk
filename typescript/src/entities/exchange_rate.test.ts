import { Merchi } from '../merchi';

test('can make exchange rate', () => {
  const merchi = new Merchi();
  const exchangeRate = new merchi.ExchangeRate();
  expect(exchangeRate).toBeTruthy();
});
