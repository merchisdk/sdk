import { Merchi } from "../merchi";

test("expect entity can merge another entity", () => {
  const merchi = new Merchi();
  const user1 = new merchi.User();
  user1.name = "test 1";
  user1.isSuperUser = true;

  const user2 = new merchi.User();
  user2.name = "test 2";

  user1.merge(user2);
  expect(user1.name).toBe("test 2");
  expect(user1.isSuperUser).toBe(true);
});

test("expect entity can be merged with specified attributes", () => {
  const merchi = new Merchi();
  const user1 = new merchi.User();
  user1.name = "test 1";
  user1.isSuperUser = true;

  const user2 = new merchi.User();
  user2.name = "test 2";
  user2.isSuperUser = false;

  user1.merge(user2, ["name"]);
  expect(user1.name).toBe("test 2");
  expect(user1.isSuperUser).toBe(true);
});
