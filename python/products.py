import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.categories import Category
from sdk.python.discount import Discount
from sdk.python.domains import Domain
from sdk.python.domain_tags import DomainTag
from sdk.python.files import File
from sdk.python.addresses import Address
from sdk.python.variations import VariationField,\
    VariationsGroup


class Product(sdk.python.entities.Entity):

    resource = '/products/'
    json_name = 'product'

    id = Property(int)
    name = Property(str)
    product_type = Property(str)
    notes = Property(str)
    description = Property(str)
    unit_price = Property(float)
    minimum = Property(float)
    unit_weight = Property(float)
    unit_height = Property(float)
    unit_width = Property(float)
    unit_depth = Property(float)
    unit_volume = Property(float)
    needs_drafting = Property(bool)
    needs_production = Property(bool)
    needs_shipping = Property(bool)
    show_public = Property(bool)
    accept_stripe = Property(bool)
    accept_paypal = Property(bool)
    accept_bank_transfer = Property(bool)
    accept_phone_payment = Property(bool)
    allow_payment_upfront = Property(bool)
    allow_quotation = Property(bool)
    delivery_days_normal = Property(int)
    best_price = Property(float)
    categories = Property(Category)
    discounts = Property(Discount, backref="product")
    domain = Property(Domain, backref="products")
    images = Property(File)
    independent_variation_fields = Property(VariationField)
    group_variation_fields = Property(VariationField)
    origin_address = Property(Address)
    tags = Property(DomainTag, backref="products")
    feature_image = Property(File, backref="featured_products")

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
        if self.images and len(self.images) > 0:
            return self.images[0]

    def preview_images(self, max_images):
        """ Only will return max_images of files """
        return self.images[:max_images]

    def default_currency(self):
        return self.domain.company.default_currency

    def primary_product_image(self):
        """ Return the first product image if it exists else return None """
        if self.images and len(self.images) > 0:
            return self.images[0].view_url

    def build_empty_variations_group(self):
        variations_group_built = VariationsGroup()
        variations_group_built.quantity = 0
        variations_group_built.variations = []
        variations_group_built.group_cost = 0
        for variation_field in self.group_variation_fields:
            empty_variation = \
                variation_field.build_empty_variation()
            variations_group_built.variations.\
                append(empty_variation)
            variations_group_built.group_cost += \
                empty_variation.cost
        return variations_group_built

    def build_empty_independent_variations(self):
        return [field.build_empty_variation() for field
                in self.independent_variation_fields]


class Products(sdk.python.entities.Resource):

    entity_class = Product
    json_name = 'products'


products = Products()
