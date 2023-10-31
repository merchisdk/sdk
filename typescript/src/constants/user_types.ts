export enum UserType {
  PUBLIC = 0,
  CLIENT_GUEST = 1, // A user who has not oppted in for a user account
  CLIENT_DOMAIN = 2, // A user who is a client of one domain
  CLIENT_MULTIPLE_DOMAINS = 3,  // A user who is a client of multiple domains
  CLIENT_MERCHI = 4, // A user has a client profile with Merchi
  SELLER_FREE_MERCHI = 5, // A user who has opened a seller store through Merchi
  SELLER_FREE_DOMAIN = 6, // A user who has opened a seller store through a domain/supplier
  SELLER_PAID = 7, // A user who is paying for a seller store
  SELLER_PAID_MULTIPLE_DOMAINS = 8, // A user who is paying for multiple seller stores
  SUPPLIER_THIRD_PARTY = 9, // A user who has a "domain supplier" domain
  SUPPLIER_RESTRICTED = 10, // A user who has a restricted supply domain
  SUPPLIER_MERCHI = 11, // A user who has a supply domain which has been verified by Merchi
  UNRESTRICTED = 12, // A user who has a domain which is unrestricted
  SHOPIFY_REFERENCE = 13, // A user who makes order from shopify and linked to our system
  RESERVED_FROM_SOCIAL = 14, // A user crawled from Social network
}
