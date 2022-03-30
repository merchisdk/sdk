import { Dictionary } from './dictionary';

export const productTypes = new Dictionary();
productTypes.add(0, 'supplier MOD (made on demand)');
productTypes.add(1, 'supplier');
productTypes.add(2, 'seller');
productTypes.add(3, 'seller MOD (made on demand)');
productTypes.add(4, 'chained MOD (made on demand)');
productTypes.add(5, 'seller chained MOD (made on demand)');
productTypes.add(6, 'production MOD (made on demand)');
productTypes.add(7, 'chained supplier');
productTypes.add(8, 'seller inventory');
productTypes.add(9, 'supplir inventory');
productTypes.add(10, 'seller group buy');
productTypes.add(11, 'supplier resell MOD (made on demand)');
productTypes.add(12, 'supplier resell');
productTypes.add(13, 'seller inventory chained');

export const productTypesInts = new Dictionary();
productTypes.each(function (key, value) {
    productTypesInts.add(value, parseInt(key, 10));
});
