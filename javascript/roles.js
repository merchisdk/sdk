import { Dictionary } from './dictionary';
import { Set } from './set';

export const roles = new Dictionary();
roles.add('public', 0);
roles.add('admin', 1);
roles.add('sales', 2);
roles.add('designer', 3);
roles.add('supplier', 4);
roles.add('client', 5);
roles.add('manager', 6);
roles.add('accountant', 7);
roles.add('theme editor', 8);

export const systemRoles = new Dictionary();
systemRoles.add("Component builder", 1);

export const allRoles = new Set();
roles.each(function (key, value) {
    allRoles.add(value);
});

export const COMPONENT_BUILDER = 'Component builder';
export const SELLER = 'Seller';
export const SELLER_PLUS = 'Seller plus';
export const SUPPLIER = 'Supplier';
export const RESTRICTED_SUPPLIER = 'Restricted supplier';
