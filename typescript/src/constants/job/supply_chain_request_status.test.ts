import { SupplyChainRequestStatus } from './supply_chain_request_status';

test('not supply chain status exists', () => {
  expect(SupplyChainRequestStatus.NO_REQUEST).toBe(0);
});
