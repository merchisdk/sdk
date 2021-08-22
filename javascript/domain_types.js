import { Dictionary } from './dictionary';

export const domainTypes = new Dictionary();
domainTypes.add(0, 'Unrestricted');
domainTypes.add(1, 'Seller');
domainTypes.add(2, 'Seller plus');
domainTypes.add(3, 'Supplier');
domainTypes.add(4, 'Restricted supplier');
domainTypes.add(5, 'Domain supplier');

export const domainTypesInts = new Dictionary();
domainTypes.each(function (key, value) {
    domainTypesInts.add(value, parseInt(key, 10));
});
