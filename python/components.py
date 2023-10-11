import datetime
import sdk.python.entities
from sdk.python.component_tags import ComponentTag
from sdk.python.entities import Property
from sdk.python.files import File
from sdk.python.users import User


class Component(sdk.python.entities.Entity):

    resource = '/components/'
    json_name = 'component'

    id = Property(int)
    body = Property(str)
    archived = Property(datetime.datetime)
    compiled = Property(str)
    component_export = Property("sdk.python.components.Component")
    component_exports = Property("sdk.python.components.Component")
    component_imports = Property("sdk.python.components.Component")
    versions = Property("sdk.python.component_versions.ComponentVersion")
    created = Property(datetime.datetime)
    created_by = Property(User)
    description = Property(str)
    feature_image = Property(File)
    images = Property(File)
    is_class_based = Property(bool)
    out_of_sync_with_original = Property(bool)
    original_component = Property("sdk.python.components.Component")
    name = Property(str)
    needs_update = Property(bool)
    has_imports = Property(int)
    is_cloned = Property(bool)
    warnings = Property(str)
    tags = Property(ComponentTag)
    updated = Property(datetime.datetime)
    updated_by = Property(User)


class Components(sdk.python.entities.Resource):

    entity_class = Component
    json_name = "components"


components = Components()
