import re
import json
import flask
from typing import Set  # noqa # pylint: disable=unused-import
from abc import ABC, abstractmethod
from bs4 import BeautifulSoup
from sdk.python.util.css import validate_stylesheet, ValidateError
from sdk.python.util.css import validate_declaration_list
from sdk.python.util.embed_resource import public_views_embed
import sdk.python.util.reactjs as reactjs


ALLOWED_TAGS = {'a', 'address', 'article', 'aside', 'b', 'blockquote',
                'button', 'br', 'caption', 'cite', 'code', 'col', 'colgroup',
                'content', 'details', 'dialog', 'div', 'dl', 'dt', 'fieldset',
                'figcaption', 'figure', 'footer', 'h1', 'h2', 'h4', 'h5', 'h6',
                'header', 'hr', 'i', 'label', 'li', 'listing', 'main',
                'marquee', 'menu', 'menuitem', 'nav', 'ol', 'p', 'pre',
                'section', 'small', 'spacer', 'span', 'strike', 'strong',
                'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead',
                'tr', 'text', 'ul'}


ALLOWED_ATTRIBUTES = {'align', 'alt', 'autocomplete', 'autofocus', 'autosave',
                      'bgcolor', 'border', 'checked', 'class', 'color', 'cols',
                      'colspan', 'contenteditable', 'contextmenu',
                      'data-target', 'data-toggle', 'disabled', 'draggable',
                      'dropzone', 'for', 'headers', 'height', 'hidden', 'href',
                      'id', 'label', 'max', 'min', 'placeholder', 'readonly',
                      'required', 'rows', 'rowspan', 'size', 'span',
                      'spellcheck', 'title', 'type', 'width', 'wrap'}


def to_camelcase(string):
    return re.sub(r'(?!^)_([a-zA-Z])', lambda m: m.group(1).upper(), string)


class ComponentsDatabase(ABC):
    """ Abstract Base Class for keeping track components for a template.

        Subclasses must provide the logic for fetching a component object from
        some form of real database or service.
    """

    def __init__(self):
        self.used_components = set([])  # type: Set[str]

    def mark_used(self, name):
        """ Record a component (by name) as used in some template. """
        self.used_components.add(name)

    @abstractmethod
    def __getitem__(self, component_name):
        """ Return a component by name, or raise IndexError """
        pass

    def __contains__(self, key):
        """ Return whether the component exists (by name). """
        try:
            self[key]  # pylint: disable=pointless-statement
            return True
        except IndexError:
            return False

    def compile_component(self, component_name):
        """ Fetch a component by name and generate javascript to draw it.  """
        component = self[component_name]
        return reactjs.component_to_javascript(component.name, component.body)

    def generate_react_components(self):
        """ Generate javascript to render every component which has been marked
            used in this ComponentsDatabase, if any.
        """
        view_embeds = public_views_embed.get(flask.request.endpoint, {})
        script = """
document.addEventListener("DOMContentLoaded", function () {
    'use strict';

    var """
        for key, value in view_embeds.items():
            script += to_camelcase(str(key)) + " = " + json.dumps(value) + ","
            script += """
        """
        for component in self.used_components:
            script += self.compile_component(component)
        script += """components = ["""
        script += ', '.join(self.used_components)
        script += """];
    function redraw(component) {
        'use strict';

        var mountpoints = $('.react-mount-component-here.' +
                            component.name);
        var element = React.createElement(component,
                                          { currentUser: window.currentUser,
                                            currentDomain: window.currentDomain,
                                            job: window.job });
        mountpoints.each(function (_, mountpoint) {
            ReactDOM.render(element, mountpoint);
        });
    }
    components.map(redraw);
});
"""
        return script


def compile_template(string, components_database, with_script=True):
    """ Take a public page template to a compiled template string.

        In the output:
         - Tags of the form {{ component-name }} are replaced with mountpoints
              for ReactJS components that can implement dynamic behaviour
         - Missing closing tags are added, extraneous < or > characters removed
              and other normalisation may be performed. Malformed HTML is
              replaced with a best guess at the intent.
         - A script tag is appended which includes instructions for how to
              render the required components.

        Not all HTML elements are supported, only those deemed safe to be
        provided by semi-trusted users. For example, script tags are banned.
        Using dissalowed elements will raise ValueError.
     """
    def check_string(string):
        """ Replace {{ tag }}'s in string with react mountpoint divs.

            The input should be a BeautifulSoup NavigableString, which will
            be destructively modified.
        """
        index = string.find("{{")
        if index == -1:
            return string
        end_index = string.find("}}", index)
        if end_index == -1:
            return string
        component = string[index + 2:end_index].strip()
        if component not in components_database:
            raise ValueError("unknown component '{}'".format(component))
        components_database.mark_used(component)
        # replacing {{ tag }} string with <div> element
        head = parse.new_string(string[:index])
        tail = parse.new_string(string[end_index + 2:])
        string.replace_with(head)
        mountpoint = parse.new_tag("div")
        mountpoint["class"] = "react-mount-component-here " + component
        head.insert_after(mountpoint)
        mountpoint.insert_after(tail)
        return string

    def check_element(parse, element):
        if element.name is None:
            check_string(element)
        else:
            check_tag(parse, element)

    def check_tag(parse, element):
        """ Check if the HTML tag type is allowed.

            If not throw, ValueError, else recursively check child elements.
        """
        if element.name == "style":
            if len(elements) != 1:
                raise ValueError("bad style element")
            try:
                validate_stylesheet(element.contents[0], {})
            except ValidateError as e:
                err = "bad stylesheet: {}".format(e.error_indication())
                raise ValueError(err)
        elif element.name not in ALLOWED_TAGS:
            err = "unknown or dissallowed tag '{}'".format(element.name)
            raise ValueError(err)
        for name, value in element.attrs.items():
            check_attribute(element.tag, name, value)
        # tree recursion step
        for child in element.contents:
            check_element(parse, child)

    def check_attribute(tag, name, value):
        """ Raise ValueError if the given attribute is unsuported. """
        if name == "style":
            try:
                validate_declaration_list(value, {}, False)
            except ValidateError as e:
                err = "bad style attribute: '{}'".format(e.error_indication())
                raise ValueError(err)
        elif name == "href" and value and value[0] != '#':
            err = "href value may only refer to a fragment"
            raise ValueError(err)
        elif name not in ALLOWED_ATTRIBUTES:
            err = "unknown or dissallowed attribute '{}'".format(name)
            raise ValueError(err)

    if not string:
        return ''
    # using lxml for the parser, as it is the fastest HTML parser available
    # for python, but BeautifulSoup for the in-memory document object model,
    # because traversing lxml trees is a bad experience
    string = string.strip()
    parse = BeautifulSoup(string, 'lxml')
    if len(parse) == 0:
        raise ValueError("no parse")
    # the lxml etree HTML parser assumes an entire document instead of a
    # fragment and wraps everything in <html><body></body></html>. here we fetch
    # out just the original, because our inputs (and outputs) should be only
    # fragments, not entire documents:
    elements = parse.contents[0].contents[0].contents
    if len(elements) != 1:
        raise ValueError("there must be exactly one top-level element")
    element = elements[0]
    check_element(parse, element)
    if with_script:
        script_tag = parse.new_tag("script")
        script_tag.string = components_database.generate_react_components()
        element.append(script_tag)
    return str(element)
