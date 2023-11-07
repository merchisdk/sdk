import { Merchi } from '../merchi';
import { setup, mockFetch } from '../test_util';
import { Role } from '../constants/roles';
import { NotificationSection } from '../constants/notification_sections';
import { NotificationType } from '../constants/notification_types';
import { SerialiseMethod } from '../entity';

setup();

test('can make product', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  expect(product).toBeTruthy();
});

test('can get and set id', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  product.id = 2;
  expect(product.id).toBe(2);
});

test('can get and set name', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  product.name = 'example';
  expect(product.name).toBe('example');
});

test('can get and set featureImage', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  const file = new merchi.MerchiFile();
  product.featureImage = file;
  expect(product.featureImage).toBe(file);
});

test('can get and set domain', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  const domain = new merchi.Domain();
  product.domain = domain;
  expect(product.domain).toBe(domain);
  product.domain = undefined;
  expect(product.domain).toBe(undefined);
});

test('can fetch product from server', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  mockFetch(true, {'product': {'name': testName}}, 200);
  return merchi.Product.get(1).then(product => expect(product.name).toBe(testName));
});

test('can fetch with explicit session token', () => {
  const testToken = 'YrDwzmh8&QGtAfg9quh(4QfSlE^RPXWl';
  const merchi = new Merchi(testToken);
  const testName = 'S7qHUfV_dr5l';
  mockFetch(true, {'product': {'name': testName}}, 200);
  return merchi.Product.get(1).then(product => expect(product.name).toBe(testName));
});

test('can specify options in request', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const fetch = mockFetch(true, {'product': {'name': testName}}, 200);
  const options = {
    includeArchived: true,
    withRights: true
  };
  const invocation = merchi.Product.get(1, options).then(
    product => expect(product.name).toBe(testName));
  const correct = [ ['include_archived', 'true'] ];
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
});

test('can specify options in create request', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const fetch = mockFetch(true, {'product': {'name': testName}}, 200);
  const options = {embed: {}, withRights: true};
  const product = new merchi.Product();
  const invocation = product.create(options).then(
    product => expect(product.name).toBe(testName));
  const correct: any[] = [['embed', '{}']];
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
});

test('can specify options in save request', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const fetch = mockFetch(true, {'product': {'name': testName}}, 200);
  const options = {embed: {},
    withRights: true};
  const product = new merchi.Product();
  const invocation = product.save(options).then(product => expect(product.name).toBe(testName));
  const correct: any[] = [['embed', '{}']];
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
});

test('can specify options in delete request', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const fetch = mockFetch(true, {'product': {'name': testName}}, 200);
  const options = {withRights: true};
  const product = new merchi.Product();
  const invocation = product.delete(options);
  const correct: any[] = [];
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
});

test('can specify embed options in recover request', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const fetch = mockFetch(true, {'product': {'name': testName}}, 200);
  const options = {embed: {}};
  const product = new merchi.Product();
  const invocation = product.recover(options);
  const correct: any[] = [['embed', '{}'], ['skip_rights', 'y']];
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
});

test('can specify skip_rights options in recover request', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const fetch = mockFetch(true, {'product': {'name': testName}}, 200);
  const options = {withRights: true};
  const product = new merchi.Product();
  const invocation = product.recover(options);
  const correct: any[] = [];
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);
  return invocation;
});

test('can fetch product with category and domain', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const categoryName = 'l3VfG#S+';
  const categoryData = {'name': categoryName};
  const domainData = {'domain': 'example.com'};
  mockFetch(true, {'product': {'name': testName,
    'categories': [categoryData],
    'domain': domainData}}, 200);
  const r = merchi.Product.get(1, {'embed': {'categories': {},
    'domain': {}}});
  return r.then(product => {
    expect(product.name).toBe(testName);
    expect(((product.categories as any)[0] as any).name).toBe(categoryName);
    const serialised = Array.from((product.toFormData() as any).entries());
    // although product has a name, that name is from the server, and therefore
    // does not need to be serialised back to the server.
    expect(serialised).toEqual([]);
    // if we manually set the name, it's a different matter:
    const manualName = 'caUHebUMlRvu2';
    product.name = manualName;
    const newSerialised = Array.from((product.toFormData() as any).entries());
    const correct = [['name', manualName]];
    expect(newSerialised).toEqual(correct);
  });
});

test('product with empty categories will not have count payload', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  mockFetch(true, {'product': {'name': testName, 'categories': []}}, 200);
  const r = merchi.Product.get(1, {'embed': {'categories': {}}});
  return r.then(product => {
    const serialised = Array.from((product.toFormData() as any).entries());
    expect(serialised.length).toEqual(0);
  });
});

test('product with zero categories erase will show in patch payload', () => {
  const merchi = new Merchi();
  const testName = 'S7qHUfV_dr5l';
  const categoryName = 'l3VfG#S+';
  const categoryData = {'name': categoryName};
  mockFetch(true, {'product': {'name': testName,
    'categories': [categoryData]}}, 200);
  const r = merchi.Product.get(1, {'embed': {'categories': {}}});
  return r.then(product => {
    product.categories = [];
    const serialised = Array.from((product.toFormData() as any).entries());
    const correct = [['categories-count', '0']];
    expect(serialised).toEqual(correct);
  });
});

test('can fetch product with category and explcit session', () => {
  const testToken = 'YrDwzmh8&QGtAfg9quh(4QfSlE^RPXWl';
  const merchi = new Merchi(testToken);
  const testName = 'S7qHUfV_dr5l';
  const categoryName = 'l3VfG#S+';
  const categoryData = {'name': categoryName};
  mockFetch(true, {'product': {'name': testName,
    'categories': [categoryData]}}, 200);
  const r = merchi.Product.get(1, {'embed': {'categories': {}}});
  return r.then(product => {
    expect(product.name).toBe(testName);
    expect(((product.categories as any)[0] as any).name).toBe(categoryName);
  });
});

test('handle nonsense from server', () => {
  const merchi = new Merchi();
  // non existent property just ignored. no crash, no update
  mockFetch(true, {'product': {'no such property!!!': 'unused'}}, 200);
  merchi.Product.get(1);
});

test('can list products from server', () => {
  const merchi = new Merchi();
  mockFetch(true, {'products': [{'product': {'name': 'p1'}},
    {'product': {'name': 'p2'}}],
  'available': 2,
  'count': 2}, 200);
  return merchi.Product.list().then(({items: d, metadata: md}) => {
    expect(d.length).toBe(2);
    expect(d[0].name).toBe('p1');
    expect(d[1].name).toBe('p2');
    expect(md.available).toBe(2);
    expect(d[0].categories).toBe(undefined);
  });
});

test('can list products with serialise method with only id', () => {
  const merchi = new Merchi();
  const options = {serialiseMethod: SerialiseMethod.ONLY_ID};
  const correct = [
    ['serialise_method', 'only_id'],
    ['skip_rights', 'y'],
  ];
  const fetch = mockFetch(true, {'products': [{'product': {'id': 1}},
    {'product': {'id': 2}}],
  'available': 2,
  'count': 2}, 200);
  merchi.Product.list(options);
  expect(fetch.mock.calls[0][1]['query']).toEqual(correct);

});

test('can list products with options set', () => {
  const merchi = new Merchi();
  const options = {
    as: 'a',
    asRole: 2,
    businessDomainsOnly: true,
    categoryId: 2,
    clientId: 349,
    clientCompanyId: 124,
    clientOnly: false,
    companyCustomerId: 99,
    companyId: 91,
    companySupplierId: 100,
    componentId: 37,
    dateFrom: new Date(0),
    dateTo: new Date(1),
    doesNotHaveAdminDomain: false,
    domainRoles: [Role.ADMIN],
    domainTypes: [0, 1],
    embed: {},
    entityTypes: [0, 1],
    exclude: [8],
    excludeComponents: ['DomainInfo', 'DomainSettings'],
    excludeDomains: [0, 1],
    groupBuyForJobId: 88,
    groupBuyOnly: false,
    inbound: false,
    includeOnly: [1],
    inDomain: 2,
    inDomainName: 'example.com',
    inDomainRoles: [2],
    isMaster: false,
    isOrder: true,
    isPrivate: false,
    jobNotifiable: 1,
    limit: 20,
    managedDomainsOnly: true,
    managedOnly: false,
    managerId: 355,
    masterProduct: 1,
    memberOnly: false,
    merchiOnly: false,
    notificationJob: 27,
    notificationRecipient: 87,
    notificationType: NotificationType.DRAFT_SENT,
    offset: 0,
    orClientId: 123,
    orClientCompanyId: 321,
    order: 'asc',
    originalOf: 1,
    platformCategoryId: 3,
    productTypes: [0, 1],
    publicOnly: false,
    q: 'example',
    receiverId: 86,
    relatedAssignment: 1,
    relatedComponent: 1,
    relatedDraft: 1,
    relatedJob: 3,
    relatedProduct: 45,
    relatedUser: 55,
    savedByUser: 24,
    section: NotificationSection.JOB_INFO,
    senderRole: Role.MANAGER,
    shopifyOnly: false,
    sort: 'name',
    state: 'yes',
    supplierResellOnly: false,
    tab: 'job',
    tags: [2, 3, 5],
    tagsInternal: [2, 3, 5],
    tagNames: ['a'],
    teamOnly: false,
    withRights: false,
  };
  const fetch = mockFetch(true, {'products': [{'product': {'name': 'p1'}},
    {'product': {'name': 'p2'}}],
  'available': 2,
  'count': 2}, 200);
  const invocation = merchi.Product.list(options);
  const correct = [
    ['as', 'a'],
    ['as_role', '2'],
    ['business_domains_only', 'true'],
    ['category_id', '2'],
    ['client_company_id', '124'],
    ['client_id', '349'],
    ['client_only', 'false'],
    ['company_customer_id', '99'],
    ['company_id', '91'],
    ['company_supplier_id', '100'],
    ['component_id', '37'],
    ['date_from', '0'],
    ['date_to', '0'],
    ['does_not_have_admin_domain', 'false'],
    ['domain_roles', '1'],
    ['domain_types', '0,1'],
    ['embed', '{}'],
    ['entity_types', '0,1'],
    ['exclude', '8'],
    ['exclude_components', 'DomainInfo,DomainSettings'],
    ['exclude_domains', '0,1'],
    ['group_buy_for_job_id', '88'],
    ['group_buy_only', 'false'],
    ['in_domain', '2'],
    ['in_domain_name', 'example.com'],
    ['in_domain_roles', '[2]'],
    ['inbound', 'false'],
    ['include_only', '1'],
    ['is_master', 'false'],
    ['is_order', 'true'],
    ['is_private', 'false'],
    ['job_notifiable', '1'],
    ['limit', '20'],
    ['managed_domains_only', 'true'],
    ['managed_only', 'false'],
    ['manager_id', '355'],
    ['master_product', '1'],
    ['member_only', 'false'],
    ['merchi_only', 'false'],
    ['notification_job', '27'],
    ['notification_recipient', '87'],
    ['notification_type', '1'],
    ['offset', '0'],
    ['or_client_company_id', '321'],
    ['or_client_id', '123'],
    ['order', 'asc'],
    ['original_of', '1'],
    ['platform_category_id', '3'],
    ['product_types', '0,1'],
    ['public_only', 'false'],
    ['q', 'example'],
    ['receiver_id', '86'],
    ['related_assignment', '1'],
    ['related_component', '1'],
    ['related_draft', '1'],
    ['related_job', '3'],
    ['related_product', '45'],
    ['related_user', '55'],
    ['saved_by_user', '24'],
    ['section', '2'],
    ['sender_role', '6'],
    ['skip_rights', 'y'],
    ['shopify_only', 'false'],
    ['sort', 'name'],
    ['state', 'yes'],
    ['supplier_resell_only', 'false'],
    ['tab', 'job'],
    ['tags', '2,3,5'],
    ['tags_internal', '2,3,5'],
    ['tag_names', 'a'],
    ['team_only', 'false'],
  ];
  expect(
    fetch.mock.calls[0][1]['query'].sort(
      (a: string[], b: string[]) => a[0].localeCompare(b[0])
    )
  ).toEqual(
    correct.sort(
      (a: string[], b: string[]) => a[0].localeCompare(b[0])
    )
  );
  return invocation;
});

test('can list products from server with explicit session token', () => {
  const testToken = 'YrDwzmh8&QGtAfg9quh(4QfSlE^RPXWl';
  const merchi = new Merchi(testToken);
  mockFetch(true, {'products': [{'product': {'name': 'p1'}},
    {'product': {'name': 'p2'}}],
  'available': 2,
  'count': 2}, 200);
  const options = {order: 'desc'};
  return merchi.Product.list(options).then(({items: d, metadata: md}) => {
    expect(d.length).toBe(2);
    expect(d[0].name).toBe('p1');
    expect(d[1].name).toBe('p2');
    expect(md.available).toBe(2);
    expect(d[0].categories).toBe(undefined);
  });
});

test('can list products from server with category', () => {
  const merchi = new Merchi();
  const categoriesData = [{'name': 'c1'}];
  mockFetch(true, {'products': [{'product': {'name': 'p1',
    'categories': categoriesData}},
  {'product': {'name': 'p2',
    'categories': categoriesData}}],
  'available': 2,
  'count': 2}, 200);
  const r = merchi.Product.list({'embed': {'categories': {}}});
  return r.then(({items: d, metadata: md}) => {
    expect(d.length).toBe(2);
    expect(d[0].name).toBe('p1');
    expect(d[1].name).toBe('p2');
    expect(md.available).toBe(2);
    expect((d[0].categories as any)[0].name).toBe('c1');
  });
});

test('can save product', () => {
  const merchi = new Merchi();
  const c1 = new merchi.Category();
  const p = new merchi.Product();
  const c2 = new merchi.Category();
  const d = new merchi.Domain();
  p.categories = [c2];
  p.domain = d;
  c1.products = [p];
  c1.save();
  d.domain = '3onrb6o4';
  p.name = 'pHyz7ZucK#';
  c2.name = '8&OaUsDgJ$ev3FYZ3';
  p.save();
  const fetch = mockFetch(true, {}, 200);
  c1.save();
  const correct =  [['products-0-name', 'pHyz7ZucK#'],
    ['products-0-categories-0-name', '8&OaUsDgJ$ev3FYZ3'],
    ['products-0-categories-count', '1'],
    ['products-0-domain-0-domain', '3onrb6o4'],
    ['products-0-domain-count', '1'],
    ['products-count', '1']];

  expect(Array.from(fetch.mock.calls[0][1]['body'].entries())).toEqual(correct);
});

test('can serialise product to form data understood by backend', () => {
  const merchi = new Merchi();
  const c1 = new merchi.Category();
  const p = new merchi.Product();
  const c2 = new merchi.Category();
  const d = new merchi.Domain();
  p.categories = [c2];
  p.domain = d;
  c1.products = [p];
  c1.save();
  d.domain = '3onrb6o4';
  p.name = 'pHyz7ZucK#';
  c2.name = '8&OaUsDgJ$ev3FYZ3';
  const correct = [[ 'name', 'pHyz7ZucK#'],
    ['categories-0-name', '8&OaUsDgJ$ev3FYZ3'],
    ['categories-count', '1'],
    ['domain-0-domain', '3onrb6o4'],
    ['domain-count', '1']];
  expect(Array.from((p.toFormData() as any).entries())).toEqual(correct);
});

test('undefined data will not be serialised', () => {
  const merchi = new Merchi();
  const p = new merchi.Product();
  p.name = 'aaa';
  p.fromJson({name: undefined});
  expect(p.name).toEqual('aaa');
});

test('can convert product data json format', () => {
  const merchi = new Merchi();
  const p = new merchi.Product();
  const d = new merchi.Domain();
  const c1 = new merchi.Category();
  c1.name = 'category 1';
  const c2 = new merchi.Category();
  c2.name = 'category 2';
  p.name = 'product name';
  d.domain = 'domain name';
  p.domain = d;
  p.categories = [c1, c2];
  const correct = {
    name: p.name,
    domain: {domain: d.domain},
    categories: [{name: c1.name}, {name: c2.name}]
  };
  expect(p.toJson()).toEqual(correct);
});

test('can clean dirty on purpose', () => {
  const merchi = new Merchi();
  const p = new merchi.Product();
  const d = new merchi.Domain();
  const c1 = new merchi.Category();
  c1.name = 'category 1';
  const c2 = new merchi.Category();
  c2.name = 'category 2';
  p.name = 'product name';
  d.domain = 'domain name';
  p.domain = d;
  p.categories = [c1, c2];
  p.featureImage = null;
  p.id = 1;
  const correct = [['id', '1']];
  p.cleanDirty();
  expect(Array.from((p.toFormData() as any).entries())).toEqual(correct);
});

test('none relationship will be in data json', () => {
  const merchi = new Merchi();
  const p = new merchi.Product();
  p.featureImage = null;
  const correct = {
    featureImage: null
  };
  expect(p.toJson()).toEqual(correct);
});

test('json serialisable in both directions', () => {
  const json = {
    name: 'product name',
    categories: [{name: 'c1'}, {name: 'c2'}]
  };
  const merchi = new Merchi();
  const p = new merchi.Product();
  p.fromJson(json);
  expect(p.toJson()).toEqual(json);
});

test('use from json to merge json into entity', () => {
  const json = {
    name: 'product name',
    domain: {domain: 'domain 1'},
    categories: [{name: 'c1'}, {name: 'c2'}]
  };
  const merchi = new Merchi();
  const p = new merchi.Product();
  p.fromJson(json);

  const updatedJson = {
    name: 'product new name',
    domain: {domain: 'domain 2'},
    categories: [{name: 'a1'}, {name: 'c2'}]
  };
  p.fromJson(updatedJson);
  expect(p.name).toEqual('product new name');
  if (p.domain !== undefined) {
    expect(p.domain.domain).toEqual('domain 2');
  } else {
    expect(true).toBe(false);
  }
  if (p.categories !== undefined) {
    expect(p.categories[0].name).toEqual('a1');
    expect(p.categories[1].name).toEqual('c2');
  } else {
    expect(true).toBe(false);
  }
});

test('use from json have options to ignore array type if it is wrong', () => {
  const json = {
    categories: '[Object]'  // wrong array type
  };
  const merchi = new Merchi();
  const p = new merchi.Product();
  p.fromJson(json, {arrayValueStrict: false});
  // categories will be ignored
  expect(p.categories).toBe(undefined);
});

test('primary key always serialised', () => {
  const merchi = new Merchi();
  const testId = 42;
  mockFetch(true, {'product': {'id': testId}}, 200);
  return merchi.Product.get(1).then(product => {
    const backData = Array.from((product.toFormData() as any).entries());
    const correct = [['id', '42']];
    expect(backData).toEqual(correct);
  });
});

test('orderable attribute request', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  const f = new merchi.MerchiFile();
  f.id = 24;
  product.id = 42;
  product.images = [f];
  product.updateOrder('images');
  const correct = [['id', '42'],
    ['images-0-id', '24'],
    ['images-count', '1'],
    ['images-*updateOrder', 'true']];
  const got = Array.from((product.toFormData() as any).entries());
  expect(got).toEqual(correct);
});

test('duplicate', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  const testName = 'qkc6fYD8HkR';
  mockFetch(true, {'product': {'name': testName}}, 200);
  return product.duplicate().then(clone => {
    expect(clone.name).toEqual(testName);
  });
});

test('primaryImage', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  const i1 = new merchi.MerchiFile();
  const i2 = new merchi.MerchiFile();
  expect(product.primaryImage).toThrow();
  product.featureImage = i1;
  expect(product.primaryImage).toThrow();
  product.images = [i2];
  expect(product.primaryImage()).toBe(i1);
  product.featureImage = null;
  expect(product.primaryImage()).toBe(i2);
  product.images = [];
  expect(product.primaryImage()).toBe(null);
});

test('hasGroupVariationFields', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  expect(product.hasGroupVariationFields).toThrow();
  product.groupVariationFields = [];
  expect(product.hasGroupVariationFields()).toBe(false);
  product.groupVariationFields = [new merchi.VariationField()];
  expect(product.hasGroupVariationFields()).toBe(true);
});

test('hasIndependentVariationFields', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  expect(product.hasIndependentVariationFields).toThrow();
  product.independentVariationFields = [];
  expect(product.hasIndependentVariationFields()).toBe(false);
  product.independentVariationFields = [new merchi.VariationField()];
  expect(product.hasIndependentVariationFields()).toBe(true);
});

test('allVariationFields', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  const vf1 = new merchi.VariationField();
  const vf2 = new merchi.VariationField();
  expect(product.allVariationFields).toThrow();
  product.groupVariationFields = [vf1];
  expect(product.allVariationFields).toThrow();
  product.independentVariationFields = [vf2];
  expect(product.allVariationFields()).toEqual([vf1, vf2]);
});

test('removeVariationField', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  const vf = new merchi.VariationField();
  expect(() => product.removeVariationField(vf)).toThrow();
  vf.independent = false;
  expect(() => product.removeVariationField(vf)).toThrow();
  product.independentVariationFields = [];
  expect(() => product.removeVariationField(vf)).toThrow();
  product.groupVariationFields = [vf];
  expect(() => product.removeVariationField(vf)).toThrow();
  vf.id = 1;
  expect(product.removeVariationField(vf).length).toEqual(1);
  expect(product.groupVariationFields.length).toEqual(0);
  vf.independent = true;
  product.independentVariationFields = [vf];
  expect(product.removeVariationField(vf).length).toEqual(1);
  expect(product.independentVariationFields.length).toEqual(0);
});

test('buildEmptyVariations', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  expect(product.buildEmptyVariations).toThrow();
  product.independentVariationFields = [];
  expect(product.buildEmptyVariations()).toEqual([]);
  product.independentVariationFields = [new merchi.VariationField()];
  product.independentVariationFields[0].defaultValue = '';
  product.independentVariationFields[0].fieldType = 11;
  product.independentVariationFields[0].variationCost = 2;
  product.independentVariationFields[0].options = [];
  expect(product.buildEmptyVariations().length).toEqual(1);
});

test('buildEmptyVariationGroup', () => {
  const merchi = new Merchi();
  const product = new merchi.Product();
  expect(product.buildEmptyVariationGroup).toThrow();
  product.groupVariationFields = [new merchi.VariationField()];
  product.groupVariationFields[0].defaultValue = '';
  product.groupVariationFields[0].fieldType = 11;
  product.groupVariationFields[0].variationCost = 2;
  product.groupVariationFields[0].options = [];
  expect(product.buildEmptyVariationGroup().groupCost).toEqual(0);
});

test('delete single subentitiy', () => {
  const merchi = new Merchi();
  const p = new merchi.Product();
  p.id = 42;
  (p.propertiesMap.get('featureImage') as any).currentValue = null;
  (p.propertiesMap.get('featureImage') as any).dirty = false;
  const correct = [['id','42'],
    ['featureImage-0-id', '-1'],
    ['featureImage-count', '1']];
  const serialised1 = Array.from((p.toFormData({excludeOld: false}) as any).entries());
  expect(serialised1).toEqual(correct);
  p.toFormData();
  p.featureImage = null;  // specifies that p.featureImage should be deleted
  const serialised2 = Array.from((p.toFormData() as any).entries());
  expect(serialised2).toEqual(correct);
});
