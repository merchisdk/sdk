export enum Role {
  PUBLIC = 0,
  ADMIN = 1,
  SALES = 2,
  DESIGNER = 3,
  SUPPLIER = 4,
  CLIENT = 5,
  MANAGER = 6,
  ACCOUNTANT = 7,
}

export const DOMAIN_MANAGERS = [
  Role.ADMIN,
  Role.MANAGER,
];

export const MANAGEMENT_TEAM = [
  ...DOMAIN_MANAGERS,
  Role.SALES,
  Role.DESIGNER,
  Role.ACCOUNTANT,
];

export const BUSINESS_ACCOUNTS = [
    ...MANAGEMENT_TEAM,
    Role.SUPPLIER,
];
