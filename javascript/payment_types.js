import { Dictionary } from './dictionary.js';

export const paymentTypes = new Dictionary();

paymentTypes.add(1, 'Online');
paymentTypes.add(2, 'PayPal');
paymentTypes.add(3, 'Bank Transfer');
paymentTypes.add(4, 'Cash');
paymentTypes.add(5, 'Cheque');
paymentTypes.add(6, 'Phone');
paymentTypes.add(7, 'Credit Card');
paymentTypes.add(8, 'Utrust');

export const paymentTypeIds = new Dictionary();

paymentTypes.each(function (key, value) {
    paymentTypeIds.add(value, parseInt(key, 10));
});
