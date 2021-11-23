import { Dictionary } from './dictionary';

export const invoiceTypes = new Dictionary();

invoiceTypes.add("ORDER", 1);
invoiceTypes.add("SUBSCRIPTION_BILL", 2);
invoiceTypes.add("AUTO_SUPPLY_BILL", 3);
