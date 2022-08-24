import { Merchi } from '../merchi';
import { Role } from '../constants/roles';
import { SystemRoles } from '../constants/system_roles';
import { DomainType } from '../constants/domain_types';
import { setup, mockFetch } from '../test_util';
import { every } from 'lodash';

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
  expect(fetchUrl).toMatch('public_user_create');
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

test('companies', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  // user.userCompanies not embeded yet will throw a error as it suppose to
  // be a embed issue
  expect(() => user.companies()).toThrow();

  const userCompany1 = new merchi.UserCompany();
  const userCompany2 = new merchi.UserCompany();
  user.userCompanies = [userCompany1, userCompany2];
  expect(() => user.companies()).toThrow();

  const company1 = new merchi.Company();
  const company2 = new merchi.Company();
  userCompany1.company = company1;
  userCompany2.company = company2;
  expect(user.companies()).toEqual([company1, company2]);
});

test('hasRoles', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  // EnrolledDomains has not been specified yet likely to be a embed issue
  expect(() => user.hasRoles([Role.ADMIN])).toThrow();
  const enrollment = new merchi.EnrolledDomain();
  user.enrolledDomains = [enrollment];
  // EnrolledDomains.domain has not been specified yet likely to be
  // a embed issue
  expect(() => user.hasRoles([Role.PUBLIC])).toThrow();

  enrollment.domain = new merchi.Domain();
  expect(user.hasRoles([Role.PUBLIC])).toBeTruthy();

  enrollment.role = Role.ADMIN;
  user.enrolledDomains = [enrollment];
  expect(user.hasRoles([Role.ADMIN, Role.MANAGER])).toBeTruthy();
  expect(user.hasRoles([Role.ADMIN, Role.MANAGER], every)).toBeFalsy();

  // for internal supplier domain, role can be maximumly interpreted
  // as supplier
  enrollment.domain.domainType = DomainType.DOMAIN_SUPPLIER;
  expect(user.hasRoles([Role.ADMIN])).toBeFalsy();
  expect(user.hasRoles([Role.SUPPLIER])).toBeTruthy();
});

test('testHasSystemRoles', () => {
  const merchi = new Merchi();
  const user = new merchi.User();
  // SystemRole has not been specified yet likely to be a embed issue
  expect(
    () => user.hasSystemRole(SystemRoles.SYSTEM_COMPONENT_BUILDER)).toThrow();
  user.systemRoles = [];
  expect(user.hasSystemRole(SystemRoles.SYSTEM_COMPONENT_BUILDER)).toBeFalsy();
  const systemRole = new merchi.SystemRole();
  systemRole.role = SystemRoles.SYSTEM_COMPONENT_BUILDER;
  user.systemRoles = [systemRole];
  expect(user.hasSystemRole(SystemRoles.SYSTEM_COMPONENT_BUILDER)).toBeTruthy();
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
