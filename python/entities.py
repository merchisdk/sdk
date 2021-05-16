import functools
import math
from datetime import datetime
import json
import queue
import simplejson
import arrow
import flask
import importlib
from typing import Dict, Any, Set  # noqa #pylint: disable=unused-import
from sdk.python.util.rights import Rights, ALL_RIGHTS
from sdk.python.util.name_protocol import camelize, parse_json_key_camel
from sdk.python.util.time_util import to_unix_timestamp, from_unix_timestamp
from sdk.python.util.api_error import ApiError
import sdk.python.util.errors
from sdk.python.request import Request
from jinja2 import utils


backref_globals = {}  # type: Dict[Any, Any]


def parse_time_hook(timestamp, as_user=None):
    """ Return a datetime.datetime object from a unix timestamp integer.

        The ignored as_user parameter is due to an override version of this
        function defined and used by merchi frontend to enforce more complex
        processing.
     """
    try:
        return from_unix_timestamp(timestamp)
    except (TypeError, ValueError):
        return timestamp


def full_class_path(obj):
    return obj.__module__ + "." + obj.__class__.__qualname__


class Property(object):
    def __init__(self, remote_type, backref=None):
        self.remote_type = remote_type
        self.backref = backref


class Meta(type):
    def __new__(cls, name, bases, attrs):
        scalar_properties = {}
        recursive_properties = {}
        attrs["_is_merchi_entity"] = True
        for key, value in attrs.items():
            if isinstance(value, Property):
                if getattr(value.remote_type, '_is_merchi_entity', False) or \
                        isinstance(value.remote_type, str):
                    recursive_properties[key] = value.remote_type
                else:
                    scalar_properties[key] = value.remote_type
        attrs["json_properties"] = scalar_properties
        attrs["recursive_properties"] = recursive_properties
        new_cls = super().__new__(cls, name, bases, attrs)
        inner_init = new_cls.__init__  # type: ignore

        def add_property(prop, object):
            """ Set up a property on the given entity.

                `prop` should be the name of the property.
                The real value will be stored at `object._prop`, and
                `object.prop` will be setup as a property object that
                manages caching and serialising concerns.
            """
            hidden_name = "_" + prop
            setattr(object, hidden_name, None)

            def get_prop(obj):
                return getattr(obj, hidden_name)

            def set_prop(obj, value):
                obj.wants_update[prop] = True
                obj.mark_dirty()
                return obj._set_hidden(hidden_name, value)

            setattr(new_cls, prop, property(get_prop, set_prop))

        def wrap_init(*args, **kwargs):
            inner_init(*args, **kwargs)
            object = args[0]
            object.wants_update = {}
            for prop in object.json_properties:
                add_property(prop, object)
                object.wants_update[prop] = False
            for prop, remote_type in object.recursive_properties.items():
                # dynamically import module if module specified as string
                if isinstance(remote_type, str):
                    remote_module_path = '.'.join(remote_type.split('.')[:-1])
                    remote_cls_name = remote_type.split('.')[-1]
                    remote_module = importlib.import_module(remote_module_path)
                    object.recursive_properties[prop] = \
                        getattr(remote_module, remote_cls_name)
                add_property(prop, object)
                object.wants_update[prop] = False
            # backref of dynamic importing
            for backref, remote_cls in \
                    backref_globals.get(full_class_path(object), []):
                object.recursive_properties[backref] = remote_cls

        new_cls.__init__ = functools.update_wrapper(wrap_init, inner_init)  # type: ignore  # noqa
        for key, value in attrs.items():
            if isinstance(value, Property) and value.backref:
                # if remote_type is str then go to dynamic import procedures
                if isinstance(value.remote_type, str):
                    if value.remote_type not in backref_globals:
                        backref_globals[value.remote_type] = \
                            set([(value.backref, new_cls)])
                    else:
                        backref_globals[value.remote_type].\
                            add((value.backref, new_cls))
                elif getattr(value.remote_type, '_is_merchi_entity', False):
                    value.remote_type.recursive_properties[value.backref] = \
                        new_cls
                else:
                    raise ValueError('Backref should only apply on module')
        return new_cls


def enumerate_files(files):
    """ Convert a list into a dictionary whose keys where the indices of the
        list and whose values are the values that occopied that index. Differs
        from pythons builtin enumerate only by having keys whose type is str.
    """
    n = 0
    result = {}
    for element in files:
        result[str(n)] = element
        n += 1
    return result


def generate_request(**kwargs):
    """ Create and return a request object.

        Returns:
          Request: (not yet sent) object representing an API request
    """
    request = Entity.request_class()
    request.wraps_request(**kwargs)
    return request


def intercept_missing_entities(e):
    """ If the given excepction e is a 400 or 410, convert it to a 400 or 410
        exception that flask understands. otherwise reraise it as-is.
    """
    if e.status_code == 404:
        flask.abort(404)
    elif e.status_code == 410:
        flask.abort(410)
    elif e.status_code == 403:
        flask.abort(403)
    raise e


class Entity(object, metaclass=Meta):

    primary_key = 'id'
    file_data = []  # type: ignore
    request_class = Request

    def __init__(self, values=None):
        self.escape_fields = []  # type: ignore
        # should not apply html safe to url fields
        self.url_fields = []  # type: ignore
        self.rights = Rights(ALL_RIGHTS)
        # if it is set to True the entity should
        # only be treat as a reference to the backend
        # entity
        self.only_for_reference = False
        self._is_dirty = False
        self._back_objects = set()  # type: Set[Entity]

    def _set_hidden(self, hidden_property, value):
        """ Set an attribute of this entity.

            This method handles dependency tracking for the purposes of
            computing which objects have changes compared to the server.
        """
        if getattr(value, "_is_merchi_entity", False):
            value._back_objects.add(self)
        elif isinstance(value, list):
            for item in value:
                if getattr(item, "_is_merchi_entity", False):
                    item._back_objects.add(self)
        return setattr(self, hidden_property, value)

    def mark_dirty(self):
        """ Mark this object, and recursively all objects that have refered
            to it, as changed compared to the backend.
        """
        open_set = queue.Queue()  # type:  queue.Queue[Entity]
        closed_set = set()  # type: Set[Entity]
        open_set.put(self)
        while not open_set.empty():
            current = open_set.get()
            if current in closed_set:
                continue
            current._is_dirty = True
            closed_set.add(current)
            for child in current._back_objects:
                open_set.put(child)

    def send_to_entity(self, request, identifier):
        """ Cause the given request to be sent, using this entities URI as
            the address.

            Args:
              request (Request): the request to send
              identifier (int): primary key of resource to send to

            Returns:
              requests.Response: response
        """
        request.resource = '{0}{1}/'.format(self.resource, identifier)
        response = request.send()
        return response

    def destroy(self, as_domain=None):
        request = self.request_class()
        request.as_domain = as_domain
        request.method = 'DELETE'
        response = self.send_to_entity(request, self.primary_value())
        check_response(response, 204)
        return response

    def post(self, **kwargs):
        request = generate_request(**kwargs)
        request.method = 'POST'
        request.resource = self.resource
        response = request.send()
        return response

    def create(self, **kwargs):
        self.process_before_transfer()
        data_json, files = self.serialise(consider_rights=False)
        resp = self.post(data=data_json, files=enumerate_files(files), **kwargs)
        check_response(resp, 201)
        self.from_json(resp.json())

    def patch(self, **kwargs):
        request = generate_request(**kwargs)
        request.method = 'PATCH'
        return self.send_to_entity(request, self.primary_value())

    def update(self, only_updates=None, refresh=False, **kwargs):
        if only_updates:
            empty_entity = self.__class__()
            for key in only_updates:
                setattr(empty_entity, key, only_updates[key])
                # also update the attribute in original entity
                setattr(self, key, only_updates[key])
            setattr(empty_entity, empty_entity.primary_key,
                    self.primary_value())
            self = empty_entity
        self.process_before_transfer()
        data_json, files = self.serialise(force_primary=False,
                                          consider_rights=False,
                                          for_updates=True,
                                          exclude_old=True)
        resp = self.patch(data=data_json,
                          files=enumerate_files(files),
                          **kwargs)
        check_response(resp, 200)
        if refresh:
            self.from_json(resp.json())

    def serialise(self, force_primary=True, files=None,
                  time_format=None, consider_rights=True,
                  for_updates=False, html_safe=False, exclude_old=False):
        result = {}  # type: ignore

        def insert_primary_key(result_dict):
            try:
                result_dict[self.primary_key] = self.primary_value()
            except AttributeError:
                return result_dict

        if force_primary:
            insert_primary_key(result)

        if self.only_for_reference and for_updates:
            # if the entity is just used for reference and this serialise
            # function is used for update, then we just need to know
            # the id of the entity.
            if not force_primary:
                insert_primary_key(result)
            return result, files

        if files is None:
            files = []
        # check whether there is a real file and whether the file has a name
        if self.file_data and self.file_data[0]:
            index = len(files)
            files.append(self.file_data)
            result['fileDataIndex'] = index

        if consider_rights:
            result[Rights.json_name] = self.rights.to_dict()

        for property_name, type_ in list(self.json_properties.items()):
            if exclude_old and not self.wants_update[property_name]:
                continue
            data = getattr(self, property_name)
            if data is None:
                continue
            if type_ == datetime:
                if not isinstance(data, (datetime, arrow.Arrow)):
                    raise ValueError(str(property_name) + " " + str(data) +
                                     " should be a datetime attribute")
                if not time_format:
                    data = to_unix_timestamp(data)
                else:
                    data = data.strftime(time_format)
            if isinstance(data, str) and html_safe and property_name \
                    not in self.url_fields:
                escaped = utils.escape(data)
                result[camelize(property_name)] = escaped  # type: ignore
            else:
                result[camelize(property_name)] = data

        for property_name in self.recursive_properties:
            recursive_property = getattr(self, property_name)
            if recursive_property is None:
                pass
            elif isinstance(recursive_property, list):
                if exclude_old and not (self.wants_update[property_name] or
                                        any(getattr(r, '_is_dirty', False) for
                                            r in recursive_property)):
                    continue
                result[property_name] = []  # type: ignore
                recursive_properties = recursive_property
                for each_property in recursive_properties:
                    d, files = each_property.\
                        serialise(force_primary, files,
                                  consider_rights=consider_rights,
                                  html_safe=html_safe,
                                  for_updates=for_updates)
                    result[property_name].append(d)  # type: ignore
            elif isinstance(recursive_property, int):
                if exclude_old and not self.wants_update[property_name]:
                    continue
                count_key = property_name + '-count'
                count = result.get(count_key, 0)
                result[count_key] = count + 1
                result[property_name + '-{0}-id'.format(count)] = \
                    recursive_property
            else:
                if exclude_old and not (self.wants_update[property_name] or
                                        recursive_property._is_dirty):
                    continue
                result[property_name], files = recursive_property.\
                    serialise(force_primary, files,
                              html_safe=html_safe,
                              consider_rights=consider_rights,
                              for_updates=for_updates)
        return result, files

    def to_json(self, camel_key=True, parse_date_format=True, html_safe=False):
        serialise_kwargs = {"html_safe": html_safe}
        if parse_date_format:
            serialise_kwargs["time_format"] = "%Y-%m-%d %H:%M"

        data_json, _ = self.serialise(**serialise_kwargs)

        if camel_key:
            data_json = parse_json_key_camel(data_json)
        return data_json

    def dump_to_json_str(self, **kwargs):
        """ Dump to a json str where comply the convention of
            a javascript object.
        """
        try:
            data_json_str = json.dumps(self.to_json(**kwargs))
        except AttributeError:
            data_json_str = ""
        return data_json_str

    def from_json(self, json_object, makes_dirty=True):
        try:
            o = json_object[self.json_name]
            if not isinstance(o, (dict, int)):
                o = json_object
        except (KeyError, TypeError):
            o = json_object

        def set_attribute(public_property, hidden_property, value):
            """ Set the value of an attribute on self.

                Iff `makes_dirty`, the property will be marked as stale and
                thus included in any request sent to the backend.
            """
            if makes_dirty:
                setattr(self, public_property, value)
            else:
                self._set_hidden(hidden_property, value)

        if isinstance(o, dict):
            try:
                rights_codes = o[Rights.json_name]
                self.rights.from_json(rights_codes, makes_dirty=makes_dirty)
            except KeyError:
                self.rights.from_json(ALL_RIGHTS)

            for json_property, type_ in self.json_properties.items():
                data = o.get(camelize(json_property), None)
                if type_ == datetime:
                    data = parse_time_hook(data)
                set_attribute(json_property, '_' + json_property, data)
            for json_property, relation in self.recursive_properties.items():
                hidden_name = "_" + json_property
                try:
                    element = o[camelize(json_property)]
                except KeyError:
                    set_attribute(json_property, hidden_name, None)
                    continue
                if isinstance(element, int):
                    instance = relation()
                    instance.from_json(element, makes_dirty=makes_dirty)
                    set_attribute(json_property, hidden_name, instance)
                elif isinstance(element, dict):
                    instance = relation()
                    instance.from_json(element, makes_dirty=makes_dirty)
                    set_attribute(json_property, hidden_name, instance)
                elif isinstance(element, list):
                    result = []
                    for e in element:
                        # embedded record
                        instance = relation()
                        instance.from_json(e, makes_dirty=makes_dirty)
                        result.append(instance)
                    set_attribute(json_property, hidden_name, result)
                else:
                    set_attribute(json_property, hidden_name, element)
        elif isinstance(o, int):
            setattr(self, self.primary_key, o)

    def process_for_transfer(self):
        pass

    def process_before_transfer(self):
        """ Every entity ensure that all the recursive attribute
            (entity subclass object) do its corresponding process
            before transfer
        """
        self.process_for_transfer()
        for json_property_name in self.recursive_properties:
            recursive_property = getattr(self, json_property_name)
            if isinstance(recursive_property, list):
                for item in recursive_property:
                    if item and not item.is_empty():
                        item.process_before_transfer()
            if recursive_property and isinstance(recursive_property, Entity) \
                    and not recursive_property.is_empty():
                recursive_property.process_before_transfer()

    def primary_value(self):
        return getattr(self, self.primary_key)

    def has_none_attribute(self):
        whether_has_none = False
        for json_property_name in self.json_properties:
            if getattr(self, json_property_name) is None \
                    and json_property_name not in self.escape_fields:
                return False
        for json_property_name in self.recursive_properties:
            if getattr(self, json_property_name) is None:
                return False
            else:
                entity_attribute = getattr(self, json_property_name)
                whether_has_none = entity_attribute.has_none_attribute()

        return whether_has_none

    def entity_process(self, attribute_group_name, process_func,
                       except_error_type=ValueError):
        """ Process the attributes in attribute group of attribute group
            name by applying process function on the attribute value.
        """
        attribute_group = getattr(self, attribute_group_name)
        if not attribute_group:
            return self
        for attribute_name in attribute_group:
            attribute_value = getattr(self, attribute_name)
            try:
                new_attribute_value = process_func(attribute_value)
            except except_error_type:
                continue
            setattr(self, attribute_name, new_attribute_value)

        for json_property_name in self.recursive_properties:
            recursive_property = getattr(self, json_property_name)
            if isinstance(recursive_property, list):
                for item in recursive_property:
                    item.entity_process(attribute_group_name,
                                        process_func,
                                        except_error_type)
            elif recursive_property is not None:
                recursive_property.entity_process(attribute_group_name,
                                                  process_func,
                                                  except_error_type)

    def is_empty(self):
        """ Return true if every attribute of that entity is None or '' """
        for json_property_name in self.json_properties:
            if json_property_name in self.escape_fields:
                continue
            json_property = getattr(self, json_property_name)
            json_property_unicode = str(json_property).strip()
            if json_property_unicode not in ["None", "", "0.0"]:
                return False

        for json_property_name in self.recursive_properties:
            if json_property_name in self.escape_fields:
                continue
            recursive_property = getattr(self, json_property_name)
            if isinstance(recursive_property, list):
                for item in recursive_property:
                    if not item.is_empty():
                        return False
            elif recursive_property is not None and \
                    not recursive_property.is_empty():
                return False

        return True

    @classmethod
    def fetch(cls, identifier, **kwargs):
        """ Factory method that returns an instance of this entity named by
            the given primary key.

            Args:
              identifier: primary key of entity to fetch
              embed (dict): map of related entities to fill in
              include_archived: specified whether archived entity should
                                been taken into account
        """
        entity = cls()
        request = generate_request(**kwargs)
        response = entity.send_to_entity(request, identifier)
        check_response(response, 200)
        json_response = response.json()
        entity.from_json(json_response, makes_dirty=False)
        return entity


class Resource(object):

    def __init__(self):
        self.resource = self.entity_class.resource
        self.can_create = True

    def get(self, forbid_auto_update=False, **kwargs):
        req = Entity.request_class(forbid_auto_update)
        req.wraps_request(**kwargs)
        req.resource = self.resource
        resp = req.send()
        return resp

    def from_json(self, json_object, makes_dirty=True):
        result = []
        o = json_object[self.json_name]
        for item in o:
            entity = self.entity_class()
            entity.from_json(item[entity.json_name], makes_dirty=makes_dirty)
            result.append(entity)
        return result

    def fetch(self, **kwargs):
        resp = self.get(**kwargs)
        check_response(resp, 200)
        response_json = resp.json()

        return (self.from_json(response_json, makes_dirty=False),
                PageSpecification(response_json['count'],
                                  response_json['available'],
                                  response_json['offset'],
                                  response_json['limit'],
                                  bool(response_json['canCreate'])))


class PageSpecification(object):

    def __init__(self, count, available, offset, limit, can_create):
        self.count = int(count)
        self.available = int(available)
        self.has_create_button = can_create
        self.offset = int(offset)
        self.limit = int(limit)

    def available_pages(self):
        return int(math.ceil(float(self.available) / self.limit))

    def current_page(self):
        return self.offset / self.limit + 1

    def page_offset(self, page):
        return self.limit * (page - 1)

    def next_offset(self):
        return self.page_offset(int(self.current_page()) + 1)

    def last_offset(self):
        return self.page_offset(int(self.current_page()) - 1)


def check_response(response, expected):
    """ Raise an exception with an error message if the status code of the
        given HTTP response does not match the expected value. Used to prevent
        execution continuing after a backend error.

        Args:
          response: response to check
          expected (int): status code that would indicate success

        Returns:
          bool: True if the status code is okay

        Raises:
          ApiError: if the status code indicates an error has occured.
          JsonDecodeError: if no error message could be recovered.
    """
    if response.status_code != expected:
        try:
            message_data = response.json()
            try:
                error_code = message_data['error_code']
            except KeyError:
                error_code = sdk.python.util.errors.UNKNOWN_ERROR
            try:
                message = message_data['message']
            except KeyError:
                message = "unknown error"
        except simplejson.scanner.JSONDecodeError:
            message = "unknown error"
            error_code = sdk.python.util.errors.UNKNOWN_ERROR
        raise ApiError(message, response.status_code, error_code)
    return True
