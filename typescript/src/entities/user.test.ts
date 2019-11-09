import { Merchi } from "../merchi";

test("can make User", () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  expect(user).toBeTruthy();
});

test("userLocalTimeFormat works", () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  user.timezone = "Australia/Melbourne";
  const test_date = new Date("Thu Nov 07 2019 00:25:03 GMT+1200");
  // Due to 'Australia/Victoria' is one hour earlier than GMT+1200
  // user showed to be one day earlier
  expect(user.userLocalTimeFormat(test_date)).toBe("Wed 6th Nov 19");
});

test("userLocalTimeFormat accept format", () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  user.timezone = "Australia/Melbourne";
  const test_date = new Date("Thu Nov 07 2019 00:25:03 GMT+1200");
  // Due to 'Australia/Victoria' is one hour earlier than GMT+1200
  // user showed to be one day earlier
  expect(user.userLocalTimeFormat(test_date, "DD/MM/YYYY")).toBe("06/11/2019");
});

test("userLocalTimeFormat will use melbourne as default timezone", () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  const test_date = new Date("Thu Nov 07 2019 00:25:03 GMT+1200");
  // Due to 'Australia/Victoria' is one hour earlier than GMT+1200
  // user showed to be one day earlier
  expect(user.userLocalTimeFormat(test_date, "YYYY-MM-DDTHH:mm:ss")).toBe(
    "2019-11-06T23:25:03"
  );
});
