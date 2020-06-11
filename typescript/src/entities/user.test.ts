import { Merchi } from '../merchi';
import { Role } from '../constants/roles';
import { setup, mockFetch } from '../test_util';

setup();

test('can make User', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  expect(user).toBeTruthy();
});

test('can issue public create request to server', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  user.name = 'Test User';
  const data = Array.from((user.toFormData() as any).entries());
  const fetch = mockFetch(true, {}, 201);
  user.publicCreate();
  const fetchUrl = fetch.mock.calls[0][0];
  const sentToServer = Array.from(fetch.mock.calls[0][1]['body'].entries());
  expect(sentToServer).toEqual(data);
  expect(fetchUrl).toMatch('public-user-create');
});

test('role helper function', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  const userSupplier = new merchi.User();
  const domain1 = new merchi.Domain();
  const domain2 = new merchi.Domain();
  const enrolledDomain = new merchi.EnrolledDomain();
  const enrolledDomainSupplier = new merchi.EnrolledDomain();
  domain1.id = 1;
  domain2.id = 2;
  enrolledDomain.role = Role.ADMIN;
  enrolledDomainSupplier.role = Role.SUPPLIER;
  // throw error if enrolledDomains is undefined which seems to be an embed issue
  expect(() => {user.roleInDomain(domain1);}).toThrow(Error);

  // throw error if enrolledDomain.domain is undefined which seems to be an embed issue
  user.enrolledDomains = [enrolledDomain];
  expect(() => {user.roleInDomain(domain1);}).toThrow(Error);

  userSupplier.enrolledDomains = [enrolledDomainSupplier];

  enrolledDomain.domain = domain1;
  enrolledDomainSupplier.domain = domain1;
  expect(user.roleInDomain(domain1)).toBe(Role.ADMIN);
  expect(userSupplier.roleInDomain(domain1)).toBe(Role.SUPPLIER);
  expect(user.roleInDomain(domain2)).toBe(Role.PUBLIC);

  expect(user.isManagementTeam(domain1)).toBe(true);
  expect(user.isManagementTeam(domain2)).toBe(false);
  expect(user.isDomainManager(domain1)).toBe(true);
  expect(user.isDomainManager(domain2)).toBe(false);
  expect(user.isNotClient(domain1)).toBe(true);
  expect(userSupplier.isManagementTeam(domain1)).toBe(false);
  expect(userSupplier.isNotClient(domain1)).toBe(true);

  // have two match enrolled domain is invalid data, but we should return
  // the highest permission
  const enrolledDomainClient = new merchi.EnrolledDomain();
  enrolledDomainClient.role = Role.CLIENT;
  enrolledDomainClient.domain = domain1;

  user.enrolledDomains = [enrolledDomain, enrolledDomainClient];
  expect(user.roleInDomain(domain1)).toBe(Role.ADMIN);
});


test('domainsByRoles', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  expect(() => user.domainsByRoles([])).toThrow();
  user.enrolledDomains = [];
  expect(user.domainsByRoles([])).toEqual([]);
  const ed = new merchi.EnrolledDomain();
  user.enrolledDomains = [ed];
  expect(() => user.domainsByRoles([])).toThrow();
  const d = new merchi.Domain();
  ed.domain = d;
  expect(() => user.domainsByRoles([])).toThrow();
  user.isSuperUser = false;
  expect(user.domainsByRoles([])).toEqual([]);
  user.isSuperUser = true;
  expect(user.domainsByRoles([])).toEqual([d]);
  user.isSuperUser = false;
  ed.role = Role.MANAGER;
  expect(user.domainsByRoles([Role.MANAGER])).toEqual([d]);
  ed.role = Role.DESIGNER;
  expect(user.domainsByRoles([Role.MANAGER])).toEqual([]);
});
