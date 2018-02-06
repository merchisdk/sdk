import frontend.app
import sdk.python.entities
import common.menu_util as menu_util
from operator import attrgetter


class Menu(sdk.python.entities.Entity):

    resource = '/menus/'
    json_name = 'menu'

    def __init__(self):
        super(Menu, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.json_property(str, 'menu_handle')
        self.json_property(int, 'menu_type')
        self.recursive_json_property(MenuItem,
                                     "menu_items")

    def menu_items_in_order(self):
        """ Return a list of menu_items sorted by their position """
        return sorted(self.menu_items, key=attrgetter('position'))


class MenuItem(sdk.python.entities.Entity):

    resource = '/menu_items'
    json_name = 'menu_item'

    def __init__(self):
        super(MenuItem, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.json_property(int, 'link_type')
        self.json_property(str, 'link_uri')
        self.json_property(int, 'position')

    def url(self, domain=None):
        """ Check to see if the menu type is a redirect or an
            internal link, then return a full url constructed from the
            link_uri and the domain
        """
        server_name = frontend.app.app.config['SERVER_NAME']
        if domain and self.link_type == menu_util.INTERNAL_PAGE:
            return 'http://{0}.{1}/{2}/'.format(str(domain.sub_domain),
                                                server_name,
                                                self.link_uri)
        return self.link_uri
