export enum Role {
  PUBLIC = 0,
  ADMIN = 1,
  SALES = 2,
  DESIGNER = 3,
  SUPPLIER = 4,
  CLIENT = 5,
  MANAGER = 6,
  ACCOUNTANT = 7
}

export const MANAGEMENT_TEAM = [
  Role.ADMIN,
  Role.SALES,
  Role.DESIGNER,
  Role.SUPPLIER,
  Role.MANAGER,
  Role.ACCOUNTANT
];
