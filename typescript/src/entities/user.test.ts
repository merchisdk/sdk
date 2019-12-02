import { Merchi } from "../merchi"; 
test("can make User", () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  expect(user).toBeTruthy();
});
