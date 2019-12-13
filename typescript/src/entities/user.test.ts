import { Merchi } from "../merchi";
import { Role } from "../constants/roles";


test("can make User", () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  expect(user).toBeTruthy();
});

test("role helper function", () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  const domain1 = new merchi.Domain();
  const domain2 = new merchi.Domain();
  const enrolledDomain = new merchi.EnrolledDomain();
  domain1.id = 1;
  domain2.id = 2;
  enrolledDomain.role = Role.ADMIN;
  // throw error if enrolledDomains is undefined which seems a embed issue
  expect(() => {user.roleInDomain(domain1);}).toThrow(Error);

  // throw error if enrolledDomain.domain is undefined which seems a embed issue
  user.enrolledDomains = [enrolledDomain];
  expect(() => {user.roleInDomain(domain1);}).toThrow(Error);

  enrolledDomain.domain = domain1;
  expect(user.roleInDomain(domain1)).toBe(Role.ADMIN);
  expect(user.roleInDomain(domain2)).toBe(Role.PUBLIC);

  expect(user.isManagementTeam(domain1)).toBe(true);
  expect(user.isManagementTeam(domain2)).toBe(false);

  // have two match enrolled domain is invalid data
  user.enrolledDomains = [enrolledDomain, enrolledDomain];
  expect(() => {user.roleInDomain(domain1);}).toThrow(Error);
});
