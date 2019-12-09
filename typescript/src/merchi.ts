import { Entity } from './entity';
import { Session } from './entities/session';
import { JobComment } from './entities/job_comment';
import { Domain } from './entities/domain';
import { Job } from './entities/job';
import { Menu } from './entities/menu';
import { Backup } from './entities/backup';
import { VariationField } from './entities/variation_field';
import { ProductionComment } from './entities/production_comment';
import { Product } from './entities/product';
import { Inventory } from './entities/inventory';
import { BidItem } from './entities/bid_item';
import { Category } from './entities/category';
import { Invoice } from './entities/invoice';
import { UserCompany } from './entities/user_company';
import { InventoryUnitVariation } from './entities/inventory_unit_variation';
import { VariationFieldsOption } from './entities/variation_fields_option';
import { Bank } from './entities/bank';
import { Shipment } from './entities/shipment';
import { DomainInvitation } from './entities/domain_invitation';
import { EmailCounter } from './entities/email_counter';
import { MenuItem } from './entities/menu_item';
import { SupplyDomain } from './entities/supply_domain';
import { Cart } from './entities/cart';
import { Theme } from './entities/theme';
import { Component } from './entities/component';
import { MerchiFile } from './entities/file';
import { EmailAddress } from './entities/email_address';
import { ShortUrl } from './entities/short_url';
import { VariationsGroup } from './entities/variations_group';
import { Bid } from './entities/bid';
import { Draft } from './entities/draft';
import { Discount } from './entities/discount';
import { User } from './entities/user';
import { Company } from './entities/company';
import { ComponentTag } from './entities/component_tag';
import { EnrolledDomain } from './entities/enrolled_domain';
import { CountryTax } from './entities/country_tax';
import { Item } from './entities/item';
import { DomainTag } from './entities/domain_tag';
import { DraftComment } from './entities/draft_comment';
import { Notification } from './entities/notification';
import { Payment } from './entities/payment';
import { CompanyInvitation } from './entities/company_invitation';
import { SystemRole } from './entities/system_role';
import { PhoneNumber } from './entities/phone_number';
import { Variation } from './entities/variation';
import { CartItem } from './entities/cart_item';
import { Address } from './entities/address';
import { Assignment } from './entities/assignment';
import { generateUUID } from './uuid';
// eslint-disable-next-line no-unused-vars
import { RequestOptions, apiFetch } from './request';
import { getCookie } from './cookie';

// the type of classes
export interface Type<T, A extends any[]> extends Function {
  new (...args: A): T;
}

function cloneClass<T, A extends []>(
  original: Type<T, A>,
  arg: any
): Type<T, A> {
  // copy the constructor, but use the empty object as `this`
  const copy = original.bind({}, arg);
  // pick up any static members (this is shallow, the members are not copied)
  Object.assign(copy, original);
  return copy;
}

export class Merchi {
  public id: string = generateUUID();

  public sessionToken?: string;

  public Notification: typeof Notification;
  public EnrolledDomain: typeof EnrolledDomain;
  public Backup: typeof Backup;
  public SystemRole: typeof SystemRole;
  public UserCompany: typeof UserCompany;
  public Variation: typeof Variation;
  public CountryTax: typeof CountryTax;
  public MenuItem: typeof MenuItem;
  public VariationField: typeof VariationField;
  public Assignment: typeof Assignment;
  public Inventory: typeof Inventory;
  public JobComment: typeof JobComment;
  public SupplyDomain: typeof SupplyDomain;
  public ProductionComment: typeof ProductionComment;
  public DraftComment: typeof DraftComment;
  public Shipment: typeof Shipment;
  public Draft: typeof Draft;
  public VariationFieldsOption: typeof VariationFieldsOption;
  public Category: typeof Category;
  public MerchiFile: typeof MerchiFile;
  public Invoice: typeof Invoice;
  public CompanyInvitation: typeof CompanyInvitation;
  public Bank: typeof Bank;
  public Job: typeof Job;
  public DomainInvitation: typeof DomainInvitation;
  public Product: typeof Product;
  public DomainTag: typeof DomainTag;
  public EmailAddress: typeof EmailAddress;
  public PhoneNumber: typeof PhoneNumber;
  public Company: typeof Company;
  public Address: typeof Address;
  public ComponentTag: typeof ComponentTag;
  public Discount: typeof Discount;
  public User: typeof User;
  public Session: typeof Session;
  public Theme: typeof Theme;
  public Item: typeof Item;
  public EmailCounter: typeof EmailCounter;
  public Domain: typeof Domain;
  public Payment: typeof Payment;
  public ShortUrl: typeof ShortUrl;
  public CartItem: typeof CartItem;
  public InventoryUnitVariation: typeof InventoryUnitVariation;
  public VariationsGroup: typeof VariationsGroup;
  public Menu: typeof Menu;
  public Cart: typeof Cart;
  public Bid: typeof Bid;
  public Component: typeof Component;
  public BidItem: typeof BidItem;

  constructor(sessionToken?: string) {
    if (sessionToken) {
      this.sessionToken = sessionToken;
    } else {
      this.sessionToken = getCookie('session_token');
    }
    function setupClass(merchi: Merchi, cls: typeof Entity) {
      // copy, to prevent interference from other merchi sessions
      const result = cloneClass(cls, merchi) as typeof Entity;
      result.merchi = merchi;
      return result;
    }
    // re-export configured versions of all classes
    this.Variation = setupClass(this, Variation) as typeof Variation;
    this.DraftComment = setupClass(this, DraftComment) as typeof DraftComment;
    this.Component = setupClass(this, Component) as typeof Component;
    this.Theme = setupClass(this, Theme) as typeof Theme;
    this.Company = setupClass(this, Company) as typeof Company;
    this.MenuItem = setupClass(this, MenuItem) as typeof MenuItem;
    this.Inventory = setupClass(this, Inventory) as typeof Inventory;
    this.Notification = setupClass(this, Notification) as typeof Notification;
    this.Shipment = setupClass(this, Shipment) as typeof Shipment;
    this.Domain = setupClass(this, Domain) as typeof Domain;
    this.Invoice = setupClass(this, Invoice) as typeof Invoice;
    this.Job = setupClass(this, Job) as typeof Job;
    this.ComponentTag = setupClass(this, ComponentTag) as typeof ComponentTag;
    this.Category = setupClass(this, Category) as typeof Category;
    this.VariationField = setupClass(
      this,
      VariationField
    ) as typeof VariationField;
    this.InventoryUnitVariation = setupClass(
      this,
      InventoryUnitVariation
    ) as typeof InventoryUnitVariation;
    this.PhoneNumber = setupClass(this, PhoneNumber) as typeof PhoneNumber;
    this.BidItem = setupClass(this, BidItem) as typeof BidItem;
    this.Menu = setupClass(this, Menu) as typeof Menu;
    this.Assignment = setupClass(this, Assignment) as typeof Assignment;
    this.Draft = setupClass(this, Draft) as typeof Draft;
    this.VariationsGroup = setupClass(
      this,
      VariationsGroup
    ) as typeof VariationsGroup;
    this.EnrolledDomain = setupClass(
      this,
      EnrolledDomain
    ) as typeof EnrolledDomain;
    this.CompanyInvitation = setupClass(
      this,
      CompanyInvitation
    ) as typeof CompanyInvitation;
    this.Bid = setupClass(this, Bid) as typeof Bid;
    this.EmailAddress = setupClass(this, EmailAddress) as typeof EmailAddress;
    this.ProductionComment = setupClass(
      this,
      ProductionComment
    ) as typeof ProductionComment;
    this.Backup = setupClass(this, Backup) as typeof Backup;
    this.CountryTax = setupClass(this, CountryTax) as typeof CountryTax;
    this.ShortUrl = setupClass(this, ShortUrl) as typeof ShortUrl;
    this.Product = setupClass(this, Product) as typeof Product;
    this.SystemRole = setupClass(this, SystemRole) as typeof SystemRole;
    this.CartItem = setupClass(this, CartItem) as typeof CartItem;
    this.UserCompany = setupClass(this, UserCompany) as typeof UserCompany;
    this.DomainTag = setupClass(this, DomainTag) as typeof DomainTag;
    this.VariationFieldsOption = setupClass(
      this,
      VariationFieldsOption
    ) as typeof VariationFieldsOption;
    this.Address = setupClass(this, Address) as typeof Address;
    this.Item = setupClass(this, Item) as typeof Item;
    this.SupplyDomain = setupClass(this, SupplyDomain) as typeof SupplyDomain;
    this.DomainInvitation = setupClass(
      this,
      DomainInvitation
    ) as typeof DomainInvitation;
    this.EmailCounter = setupClass(this, EmailCounter) as typeof EmailCounter;
    this.Session = setupClass(this, Session) as typeof Session;
    this.Bank = setupClass(this, Bank) as typeof Bank;
    this.Discount = setupClass(this, Discount) as typeof Discount;
    this.Payment = setupClass(this, Payment) as typeof Payment;
    this.Cart = setupClass(this, Cart) as typeof Cart;
    this.MerchiFile = setupClass(this, MerchiFile) as typeof MerchiFile;
    this.User = setupClass(this, User) as typeof User;
    this.JobComment = setupClass(this, JobComment) as typeof JobComment;
  }

  public authenticatedFetch = (resource: string, options: RequestOptions) => {
    if (this.sessionToken) {
      /* istanbul ignore next */
      if (!options.query) {
        /* istanbul ignore next */
        options.query = [];
      }
      options.query.push(['session_token', this.sessionToken]);
    }
    return apiFetch(resource, options);
  };

  public getCurrentUser = () => {
    if (!this.sessionToken) {
      return Promise.resolve(null);
    }
    return this.Session.get(this.sessionToken, {
        embed: { user: { enrolledDomains: {domain: {}} } }
    }).then((session: any) => session.user);
  };
}
