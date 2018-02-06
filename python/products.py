import sdk.python.entities
from sdk.python.categories import Category
from sdk.python.discount import Discount
from sdk.python.domains import Domain
from sdk.python.files import File
from sdk.python.specifications import SpecificationField,\
    SpecificationsGroup


class Product(sdk.python.entities.Entity):

    resource = '/products/'
    json_name = 'product'

    def __init__(self):
        super(Product, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.json_property(str, 'notes')
        self.json_property(str, 'description')
        self.json_property(float, 'unit_price')
        self.json_property(float, 'unit_amount')
        self.json_property(float, 'minimum')
        self.json_property(float, 'unit_weight')
        self.json_property(float, 'unit_height')
        self.json_property(float, 'unit_width')
        self.json_property(float, 'unit_depth')
        self.json_property(float, 'unit_volume')
        self.json_property(bool, "needs_drafting")
        self.json_property(bool, "needs_production")
        self.json_property(bool, "needs_shipping")
        self.json_property(bool, 'show_public')
        self.json_property(bool, "accept_stripe")
        self.json_property(bool, "accept_paypal")
        self.json_property(bool, "accept_bank_transfer")
        self.json_property(bool, 'accept_phone_payment')
        self.json_property(bool, 'allow_payment_upfront')
        self.json_property(bool, 'allow_quotation')
        self.json_property(int, 'delivery_days_normal')
        self.json_property(float, 'best_price')
        self.recursive_json_property(Category, 'categories')
        self.recursive_json_property(Discount, 'discounts')
        self.recursive_json_property(Domain, 'domain')
        self.recursive_json_property(File, 'files')
        self.recursive_json_property(SpecificationField,
                                     "independent_variation_fields")
        self.recursive_json_property(SpecificationField,
                                     "group_variation_fields")
        self.recursive_json_property(sdk.python.users.User,
                                     'suppliers')

    def create(self, embed=None, email=None, password=None, query=None,
               api_secret=None, as_domain=None):
        self.unit_price = float(self.unit_price)
        super(Product, self).\
            create(embed=embed, email=email, password=password, query=query,
                   api_secret=api_secret, as_domain=as_domain)

    def primary_image(self):
        """ Return the first product image object if one exists and
            return None if no images exists
        """
        if self.files and len(self.files) > 0:
            return self.files[0]

    def preview_images(self, max_images):
        """ Only will return max_images of files """
        return self.files[:max_images]

    def default_currency(self):
        return self.domain.company.default_currency

    def primary_product_image(self):
        """ Return the first product image if it exists else return None """
        if self.files and len(self.files) > 0:
            return self.files[0].view_url

    def build_empty_specifications_group(self):
        specifications_group_built = SpecificationsGroup()
        specifications_group_built.quantity = 0
        specifications_group_built.specifications = []
        specifications_group_built.group_cost = 0
        for specification_field in self.group_variation_fields:
            empty_specification = \
                specification_field.build_empty_specification()
            specifications_group_built.specifications.\
                append(empty_specification)
            specifications_group_built.group_cost += \
                empty_specification.cost
        return specifications_group_built

    def build_empty_independent_specifications(self):
        return [field.build_empty_specification() for field
                in self.independent_variation_fields]


class Products(sdk.python.entities.Resource):

    entity_class = Product
    json_name = 'products'


products = Products()
