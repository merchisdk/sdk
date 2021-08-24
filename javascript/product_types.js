import { Dictionary } from './dictionary';

export const productTypes = new Dictionary();
productTypes.add(0, 'MOD (made on demand)');
productTypes.add(1, 'MOQ (minimum or quantity)');
productTypes.add(2, 'seller');
productTypes.add(3, 'seller (made on demand)');

export const productTypesInts = new Dictionary();
productTypes.each(function (key, value) {
    productTypesInts.add(value, parseInt(key, 10));
});
