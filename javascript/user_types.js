import { Dictionary } from './dictionary.js';

export const userTypes = new Dictionary();

userTypes.add("PUBLIC", 0);
userTypes.add("CLIENT_GUEST", 1);
userTypes.add("CLIENT_DOMAIN", 2);
userTypes.add("CLIENT_MULTIPLE_DOMAINS", 3);
userTypes.add("CLIENT_MERCHI", 4);
userTypes.add("SELLER_FREE_MERCHI", 5);
userTypes.add("SELLER_FREE_DOMAIN", 6);
userTypes.add("SELLER_PAID", 7);
userTypes.add("SELLER_PAID_MULTIPLE_DOMAINS", 8);
userTypes.add("SUPPLIER_THIRD_PARTY", 9);
userTypes.add("SUPPLIER_RESTRICTED", 10);
userTypes.add("SUPPLIER_MERCHI", 11);
userTypes.add("UNRESTRICTED", 12);
userTypes.add("SHOPIFY_REFERENCE", 13);
userTypes.add("RESERVED_FROM_SOCIAL", 14);
