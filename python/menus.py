import sdk.python.entities
import sdk.python.util.menu_util as menu_util
from sdk.python.entities import Property
from operator import attrgetter


class MenuItem(sdk.python.entities.Entity):

    resource = '/menu_items'
    json_name = 'menu_item'

    id = Property(int)
    name = Property(str)
    link_type = Property(int)
    link_uri = Property(str)
    position = Property(int)

    def url(self, host, domain=None):
        """ Check to see if the menu type is a redirect or an
            internal link, then return a full url constructed from the
            link_uri and the domain
        """
        if domain and self.link_type == menu_util.INTERNAL_PAGE:
            return 'http://{0}.{1}/{2}/'.format(str(domain.sub_domain),
                                                host,
                                                self.link_uri)
        return self.link_uri


class Menu(sdk.python.entities.Entity):

    resource = '/menus/'
    json_name = 'menu'

    id = Property(int)
    name = Property(str)
    menu_handle = Property(str)
    menu_type = Property(int)
    menu_items = Property(MenuItem)

    def menu_items_in_order(self):
        """ Return a list of menu_items sorted by their position """
        return sorted(self.menu_items, key=attrgetter('position'))
