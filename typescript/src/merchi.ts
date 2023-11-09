import {
  Entity,
  // eslint-disable-next-line no-unused-vars
  EmbedDescriptor,
} from './entity';
import { AutomaticPaymentRelationship } from './entities/automatic_payment_relationship';
import { Session } from './entities/session';
import { JobComment } from './entities/job_comment';
import { Domain } from './entities/domain';
import { ExchangeRate } from './entities/exchange_rate';
import { Job } from './entities/job';
import { Menu } from './entities/menu';
import { Backup } from './entities/backup';
import { VariationField } from './entities/variation_field';
import { VariationOption } from './entities/variation_option';
import { ProductionComment } from './entities/production_comment';
import { Product } from './entities/product';
import { InternalTag } from './entities/internal_tag';
import { Inventory } from './entities/inventory';
import { QuoteItem } from './entities/quote_item';
import { Category } from './entities/category';
import { Invoice } from './entities/invoice';
import { UserCompany } from './entities/user_company';
import { InventoryUnitVariation } from './entities/inventory_unit_variation';
import { VariationFieldsOption } from './entities/variation_fields_option';
import { Bank } from './entities/bank';
import { Shipment } from './entities/shipment';
import { ShipmentItem } from './entities/shipment_item';
import { ShipmentItemFulfillment } from './entities/shipment_item_fulfillment';
import { ShipmentMethod } from './entities/shipment_method';
import { ShipmentMethodVariation } from './entities/shipment_method_variation';
import { DomainInvitation } from './entities/domain_invitation';
import { EmailCounter } from './entities/email_counter';
import { MenuItem } from './entities/menu_item';
import { SupplyDomain } from './entities/supply_domain';
import { Cart } from './entities/cart';
import { CartShipmentGroup } from './entities/cart_shipment_group';
import { CartShipmentQuote } from './entities/cart_shipment_quote';
import { Theme } from './entities/theme';
import { ThemeCssSetting } from './entities/theme_css_setting';
import { Component } from './entities/component';
import { ComponentVersion } from './entities/component_version';
import { MerchiFile } from './entities/file';
import { EmailAddress } from './entities/email_address';
import { SeoDomainPage } from './entities/seo_domain_page';
import { ShortUrl } from './entities/short_url';
import { VariationsGroup } from './entities/variations_group';
import { Quote } from './entities/quote';
import { Draft } from './entities/draft';
import { DraftTemplate } from './entities/draft_template';
import { Discount } from './entities/discount';
import { DiscountGroup } from './entities/discount_group';
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
import { Page } from './entities/page';
import { CompanyInvitation } from './entities/company_invitation';
import { SystemRole } from './entities/system_role';
import { PaymentDevice } from './entities/payment_device';
import { PhoneNumber } from './entities/phone_number';
import { Variation } from './entities/variation';
import { CartItem } from './entities/cart_item';
import { Address } from './entities/address';
import { Assignment } from './entities/assignment';
import { MatchingInventory } from './entities/matching_inventory';
import { SubscriptionPlan } from './entities/subscription_plan';
import { generateUUID } from './uuid';
// eslint-disable-next-line no-unused-vars
import { RequestOptions, apiFetch, apiFetchWithProgress } from './request';
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

interface UserRequestOptions {
  embed?: EmbedDescriptor;
}

export class Merchi {
  public id: string = generateUUID();

  public sessionToken?: string;
  public invoiceToken?: string;
  public clientToken?: string;
  public cartToken?: string;

  public AutomaticPaymentRelationship: typeof AutomaticPaymentRelationship;
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
  public InternalTag: typeof InternalTag;
  public Inventory: typeof Inventory;
  public JobComment: typeof JobComment;
  public VariationOption: typeof VariationOption;
  public SupplyDomain: typeof SupplyDomain;
  public ProductionComment: typeof ProductionComment;
  public DraftComment: typeof DraftComment;
  public Shipment: typeof Shipment;
  public ShipmentItem: typeof ShipmentItem;
  public ShipmentItemFulfillment: typeof ShipmentItemFulfillment;
  public ShipmentMethod: typeof ShipmentMethod;
  public ShipmentMethodVariation: typeof ShipmentMethodVariation;
  public Draft: typeof Draft;
  public DraftTemplate: typeof DraftTemplate;
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
  public DiscountGroup: typeof DiscountGroup;
  public User: typeof User;
  public Session: typeof Session;
  public Theme: typeof Theme;
  public ThemeCssSetting: typeof ThemeCssSetting;
  public Item: typeof Item;
  public EmailCounter: typeof EmailCounter;
  public SeoDomainPage: typeof SeoDomainPage;
  public Domain: typeof Domain;
  public ExchangeRate: typeof ExchangeRate;
  public Payment: typeof Payment;
  public PaymentDevice: typeof PaymentDevice;
  public Page: typeof Page;
  public ShortUrl: typeof ShortUrl;
  public CartItem: typeof CartItem;
  public InventoryUnitVariation: typeof InventoryUnitVariation;
  public VariationsGroup: typeof VariationsGroup;
  public Menu: typeof Menu;
  public Cart: typeof Cart;
  public CartShipmentGroup: typeof CartShipmentGroup;
  public CartShipmentQuote: typeof CartShipmentQuote;
  public Quote: typeof Quote;
  public Component: typeof Component;
  public ComponentVersion : typeof ComponentVersion;
  public QuoteItem: typeof QuoteItem;
  public MatchingInventory: typeof MatchingInventory;
  public SubscriptionPlan: typeof SubscriptionPlan;

  public setupClass(cls: typeof Entity) {
    const result = cloneClass(cls, this) as typeof Entity;
    result.merchi = this;
    return result;
  }

  public constructor(
    sessionToken?: string,
    clientToken?: string,
    invoiceToken?: string,
    cartToken?: string
  ) {
    if (sessionToken) {
      this.sessionToken = sessionToken;
    } else {
      this.sessionToken = getCookie('session_token');
    }

    if (clientToken) {
      this.clientToken = clientToken;
    } else {
      this.clientToken = getCookie('client_token');
    }

    if (invoiceToken) {
      this.invoiceToken = invoiceToken;
    } else {
      this.invoiceToken = getCookie('invoice_token');
    }

    if (cartToken) {
      this.cartToken = cartToken;
    } else {
      this.cartToken = getCookie('cart_token');
    }

    // re-export configured versions of all classes
    this.AutomaticPaymentRelationship = this.setupClass(
      AutomaticPaymentRelationship
    ) as typeof AutomaticPaymentRelationship;
    this.Variation = this.setupClass(Variation) as typeof Variation;
    this.DraftComment = this.setupClass(DraftComment) as typeof DraftComment;
    this.Component = this.setupClass(Component) as typeof Component;
    this.ComponentVersion = this.setupClass(ComponentVersion) as typeof ComponentVersion;
    this.Theme = this.setupClass(Theme) as typeof Theme;
    this.ThemeCssSetting = this.setupClass(ThemeCssSetting) as typeof ThemeCssSetting;
    this.Company = this.setupClass(Company) as typeof Company;
    this.MenuItem = this.setupClass(MenuItem) as typeof MenuItem;
    this.InternalTag = this.setupClass(InternalTag) as typeof InternalTag;
    this.Inventory = this.setupClass(Inventory) as typeof Inventory;
    this.Notification = this.setupClass(Notification) as typeof Notification;
    this.Shipment = this.setupClass(Shipment) as typeof Shipment;
    this.ShipmentItem = this.setupClass(ShipmentItem) as typeof ShipmentItem;
    this.ShipmentItemFulfillment = this.setupClass(
      ShipmentItemFulfillment
    ) as typeof ShipmentItemFulfillment;
    this.ShipmentMethod = this.setupClass(
      ShipmentMethod
    ) as typeof ShipmentMethod;
    this.ShipmentMethodVariation = this.setupClass(
      ShipmentMethodVariation
    ) as typeof ShipmentMethodVariation;
    this.Domain = this.setupClass(Domain) as typeof Domain;
    this.ExchangeRate = this.setupClass(ExchangeRate) as typeof ExchangeRate;
    this.Invoice = this.setupClass(Invoice) as typeof Invoice;
    this.Job = this.setupClass(Job) as typeof Job;
    this.ComponentTag = this.setupClass(ComponentTag) as typeof ComponentTag;
    this.Category = this.setupClass(Category) as typeof Category;
    this.VariationField = this.setupClass(
      VariationField
    ) as typeof VariationField;
    this.InventoryUnitVariation = this.setupClass(
      InventoryUnitVariation
    ) as typeof InventoryUnitVariation;
    this.PhoneNumber = this.setupClass(PhoneNumber) as typeof PhoneNumber;
    this.QuoteItem = this.setupClass(QuoteItem) as typeof QuoteItem;
    this.Menu = this.setupClass(Menu) as typeof Menu;
    this.Assignment = this.setupClass(Assignment) as typeof Assignment;
    this.Draft = this.setupClass(Draft) as typeof Draft;
    this.DraftTemplate = this.setupClass(DraftTemplate) as typeof DraftTemplate;
    this.VariationsGroup = this.setupClass(
      VariationsGroup
    ) as typeof VariationsGroup;
    this.EnrolledDomain = this.setupClass(
      EnrolledDomain
    ) as typeof EnrolledDomain;
    this.CompanyInvitation = this.setupClass(
      CompanyInvitation
    ) as typeof CompanyInvitation;
    this.Quote = this.setupClass(Quote) as typeof Quote;
    this.EmailAddress = this.setupClass(EmailAddress) as typeof EmailAddress;
    this.SeoDomainPage = this.setupClass(SeoDomainPage) as typeof SeoDomainPage;
    this.ProductionComment = this.setupClass(
      ProductionComment
    ) as typeof ProductionComment;
    this.Backup = this.setupClass(Backup) as typeof Backup;
    this.CountryTax = this.setupClass(CountryTax) as typeof CountryTax;
    this.ShortUrl = this.setupClass(ShortUrl) as typeof ShortUrl;
    this.Product = this.setupClass(Product) as typeof Product;
    this.SystemRole = this.setupClass(SystemRole) as typeof SystemRole;
    this.CartItem = this.setupClass(CartItem) as typeof CartItem;
    this.UserCompany = this.setupClass(UserCompany) as typeof UserCompany;
    this.DomainTag = this.setupClass(DomainTag) as typeof DomainTag;
    this.VariationFieldsOption = this.setupClass(
      VariationFieldsOption
    ) as typeof VariationFieldsOption;
    this.Address = this.setupClass(Address) as typeof Address;
    this.Item = this.setupClass(Item) as typeof Item;
    this.SupplyDomain = this.setupClass(SupplyDomain) as typeof SupplyDomain;
    this.DomainInvitation = this.setupClass(
      DomainInvitation
    ) as typeof DomainInvitation;
    this.EmailCounter = this.setupClass(EmailCounter) as typeof EmailCounter;
    this.Session = this.setupClass(Session) as typeof Session;
    this.Bank = this.setupClass(Bank) as typeof Bank;
    this.Discount = this.setupClass(Discount) as typeof Discount;
    this.DiscountGroup = this.setupClass(DiscountGroup) as typeof DiscountGroup;
    this.Payment = this.setupClass(Payment) as typeof Payment;
    this.PaymentDevice = this.setupClass(PaymentDevice) as typeof PaymentDevice;
    this.Page = this.setupClass(Page) as typeof Page;
    this.Cart = this.setupClass(Cart) as typeof Cart;
    this.CartShipmentGroup = this.setupClass(
      CartShipmentGroup
    ) as typeof CartShipmentGroup;
    this.CartShipmentQuote = this.setupClass(
      CartShipmentQuote
    ) as typeof CartShipmentQuote;
    this.MerchiFile = this.setupClass(MerchiFile) as typeof MerchiFile;
    this.User = this.setupClass(User) as typeof User;
    this.JobComment = this.setupClass(JobComment) as typeof JobComment;
    this.VariationOption = this.setupClass(
      VariationOption
    ) as typeof VariationOption;
    this.MatchingInventory = this.setupClass(
      MatchingInventory
    ) as typeof MatchingInventory;
    this.SubscriptionPlan = this.setupClass(
      SubscriptionPlan
    ) as typeof SubscriptionPlan;
  }

  public authenticatedFetch = (
    resource: string,
    options: RequestOptions,
    expectEmptyResponse?: boolean
  ) => {
    if (!options.query) {
      /* istanbul ignore next */
      options.query = [];
    }
    if (this.sessionToken) {
      /* istanbul ignore next */
      options.query.push(['session_token', this.sessionToken]);
    }
    if (this.clientToken) {
      /* istanbul ignore next */
      options.query.push(['client_token', this.clientToken]);
    }
    if (this.invoiceToken) {
      /* istanbul ignore next */
      options.query.push(['invoice_token', this.invoiceToken]);
    }
    if (this.cartToken) {
      /* istanbul ignore next */
      options.query.push(['cart_token', this.cartToken]);
    }
    return apiFetch(resource, options, expectEmptyResponse);
  };

  /* istanbul ignore next */
  public authenticatedFetchWithProgress = (
    resource: string,
    options: RequestOptions,
    progressCallback?: (progress: number) => void
  ) => {
    if (!options.query) {
      options.query = [];
    }
    if (this.sessionToken) {
      options.query.push(['session_token', this.sessionToken]);
    }
    if (this.clientToken) {
      options.query.push(['client_token', this.clientToken]);
    }
    if (this.invoiceToken) {
      options.query.push(['invoice_token', this.invoiceToken]);
    }
    if (this.cartToken) {
      options.query.push(['cart_token', this.cartToken]);
    }
    return apiFetchWithProgress(resource, options, progressCallback);
  };

  public getCurrentUser = (options?: UserRequestOptions) => {
    const { embed = {} } = options || {};
    const defaultEmbed = { user: { enrolledDomains: { domain: {} } } };
    if (!this.sessionToken) {
      return Promise.resolve(null);
    }
    return this.Session.get(this.sessionToken, {
      embed: { ...defaultEmbed, ...embed },
    }).then((session: any) => session.user);
  };
}
