import { Merchi } from '../merchi';

test('expect user can be merged with a partialy updated user', () => {
  const merchi = new Merchi();
  const user1 = new merchi.User();
  const user2 = new merchi.User();
  user1.name = "test 1";
  user2.name = "test 2";

  user1.merge(user2);
  expect(user1.name).toBe("test 2");
});
