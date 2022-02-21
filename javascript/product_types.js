import { Dictionary } from './dictionary';

export const productTypes = new Dictionary();
productTypes.add(0, 'supplier MOD (made on demand)');
productTypes.add(1, 'supplier');
productTypes.add(2, 'seller');
productTypes.add(3, 'seller MOD (made on demand)');

export const productTypesInts = new Dictionary();
productTypes.each(function (key, value) {
    productTypesInts.add(value, parseInt(key, 10));
});
