import { Merchi } from '../merchi';

test('can make AutomaticPaymentRelationship', () => {
  const merchi = new Merchi();
  const automaticPaymentRelationship =
    new merchi.AutomaticPaymentRelationship();
  expect(automaticPaymentRelationship).toBeTruthy();
});
