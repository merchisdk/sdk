"""

 Utility to validate untrusted CSS to be served and linked to from your own
 host and domain.

 Allowed:
     - (almost) complete control over page styling as much as css allows
     - including static images passed to the system at validation time

 Not allowed:
     - editing html (XSS attacks...)
     - running javascript via stylesheet (XSS attacks and more)
     - escaping to run code in flash, activex, etc.
     - network requests including loading images (reflection attack DOS,
           information leak)

 Out of scope:
      - protecting against phishing
      - removing offensive or illegal content
      - checking for css best practices
      - minifying css
      - pretty printing css or making the output in any way nice


 Works by walking the AST produced by tinycss2 parser and checking attribute
 and function names against a whitelist. A blacklist is also included to
 protect against hastily whitelisting known unsafe names.

 No attempt has been made to check every known css property. Commons ones have
 been added as needed.

 Example usage:

   with open('image.png', 'rb') as image:
       image_bytes = image.read()
   file_map = {'file1_placeholder': (image_bytes, 'image/png')}
   css = "body { background-image: url('file1_placeholder'); }"
   print(validate_stylesheet(css, file_map))

"""
import tinycss2
from common.url import data_url_from_bytes
from common.legal import is_legal_theme_file_mimetype


class ValidateError(ValueError):

    def __init__(self, message, line, column, *args):
        self.message = message
        self.line = line
        self.column = column
        super(ValidateError, self).__init__(message, line, column, *args)

    def error_indication(self):
        """ Return a indication string which aims to help frontend
            user find the error of their css template.
        """
        return "Error {} on line {} at column {}.".\
            format(self.message, self.line, self.column)


def validate_declaration_name(declaration, file_map):
    """ Validate that name of the supplied css declaration is safe to serve from
        own domain. If there is a parse error or validation failure,
        ValidationError is raised. The property is checked against a whitelist.
    """
    # please keep in alphabetical order
    banned_names = {'filter',
                    '-moz-binding',
                    'behavior'}
    # please keep in alphabetical order
    allowed_names = {'-moz-border-radius',
                     '-moz-box-shadow',
                     '-moz-box-sizing',
                     '-moz-hyphens',
                     '-moz-osx-font-smoothing',
                     '-moz-transition',
                     '-moz-transition',
                     '-moz-user-select',
                     '-ms-autohiding-scrollbar',
                     '-ms-hyphens',
                     '-ms-interpolation-mode',
                     '-ms-overflow-style',
                     '-ms-text-size-adjust',
                     '-ms-transform',
                     '-ms-user-select',
                     '-o-animation',
                     '-o-linear-gradient',
                     '-o-linear-gradient',
                     '-o-transform',
                     '-o-transition',
                     '-webkit-animation',
                     '-webkit-animation-duration',
                     '-webkit-animation-fill-mode',
                     '-webkit-appearance',
                     '-webkit-border-radius',
                     '-webkit-box-shadow',
                     '-webkit-box-sizing',
                     '-webkit-font-smoothing',
                     '-webkit-hyphens',
                     '-webkit-linear-gradient',
                     '-webkit-overflow-scrolling',
                     '-webkit-tap-highlight-color',
                     '-webkit-text-size-adjust',
                     '-webkit-transform',
                     '-webkit-transform-3d',
                     '-webkit-transition',
                     '-webkit-transition-duration',
                     '-webkit-transition-property',
                     '-webkit-transition-timing-function',
                     '-webkit-user-select',
                     'animation',
                     'animation-duration',
                     'animation-fill-mode',
                     'background',  # ony dangerous with url or uri function
                     'background-clip',
                     'background-color',
                     'background-image',
                     'background-repeat',
                     'background-size',
                     'border',
                     'border-bottom',
                     'border-bottom-color',
                     'border-bottom-left-radius',
                     'border-bottom-right-radius',
                     'border-bottom-width',
                     'border-collapse',
                     'border-color',
                     'border-left',
                     'border-left-color',
                     'border-left-width',
                     'border-radius',
                     'border-right',
                     'border-right-color',
                     'border-right-width',
                     'border-spacing',
                     'border-style',
                     'border-top',
                     'border-top-color',
                     'border-top-left-radius',
                     'border-top-right-radius',
                     'border-top-width',
                     'border-width',
                     'bottom',
                     'box-shadow',
                     'box-sizing',
                     'clear',
                     'clip',
                     'color',
                     'content',   # only dangerous with attr function
                     'cursor',
                     'display',
                     'float',
                     'font',
                     'font',
                     'font-family',
                     'font-size',
                     'font-style',
                     'font-weight',
                     'height',
                     'hyphens',
                     'left',
                     'letter-spacing',
                     'line-break',
                     'line-height',
                     'linear-gradient',
                     'linear-gradient',
                     'list-style',
                     'list-style-position',
                     'list-style-type',
                     'margin',
                     'margin-bottom',
                     'margin-left',
                     'margin-right',
                     'margin-top',
                     'max-height',
                     'max-width',
                     'min-height',
                     'min-width',
                     'opacity',
                     'outline',
                     'outline-offset',
                     'overflow',
                     'overflow-x',
                     'overflow-x',
                     'overflow-y',
                     'padding',
                     'padding-bottom',
                     'padding-left',
                     'padding-right',
                     'padding-top',
                     'pointer-events',
                     'position',
                     'right',
                     'src',  # as long as url() is validated
                     'table-layout',
                     'text-align',
                     'text-decoration',
                     'text-indent',
                     'text-overflow',
                     'text-rendering',
                     'text-shadow',
                     'text-transform',
                     'transform',
                     'top',
                     'touch-action',
                     'transition',
                     'transition',
                     'transition-duration',
                     'transition-property',
                     'transition-timing-function',
                     'user-select',
                     'vertical-align',
                     'visibility',
                     'white-space',
                     'width',
                     'word-break',
                     'word-brea',
                     'word-spacing',
                     'word-wrap',
                     'z-index',
                     'zoom'}
    name = declaration.name
    if declaration.lower_name in banned_names:
        raise ValidateError("'{}' is a forbidden name".format(name),
                            declaration.source_line,
                            declaration.source_column)
    if declaration.lower_name in allowed_names:
        return
    raise ValidateError("'{}' is an unknown or forbidden name".format(name),
                        declaration.source_line,
                        declaration.source_column)


def validate_mimetype(mimetype):
    """ Return True if the supplied mimetype is in our predefined list of
        safe image types that can be served from our own domain. Otherwise
        return False.
    """
    return is_legal_theme_file_mimetype(mimetype)


def validate_url_value(component, file_map, in_font_context):
    """ Raise ValidationError if the value of a url component has not been
        supplied in the file_map, or a non image mimetype was speciied.
    """
    value = component.value
    if component.value not in file_map:
        raise ValidateError("'{}' is an unknown file name".format(value),
                            component.source_line,
                            component.source_column)
    file_data, mimetype = file_map[component.value]
    if in_font_context:
        if mimetype == 'application/octet-stream' or not mimetype:
            component.value = data_url_from_bytes(file_data,
                                                  'application/font-woff')
            return
    if not validate_mimetype(mimetype):
        raise ValidateError("'{}' is an unknown mimetype".format(mimetype),
                            component.source_line,
                            component.source_column)
    component.value = data_url_from_bytes(file_data, mimetype)


def validate_function_value(component, file_map):
    """ Validate that supplied function to be used in a css declaration is safe
        to serve from own domain as detirmined by a manually maintained
        whitelist.  If there is a parse error or validation failure,
        ValidationError is raised.
    """
    banned_functions = {'attr', 'expression'}
    allowed_functions = {'rgb',
                         'rgba',
                         'rect',
                         'linear-gradient',
                         'translate',
                         'transform',
                         '-moz-linear-gradient',
                         '-ms-linear-gradient',
                         '-o-linear-gradient',
                         '-webkit-gradient',
                         '-webkit-linear-gradient'}
    name = component.name
    if name in banned_functions:
        raise ValidateError("'{}' is an unsupported name".format(name),
                            component.source_line,
                            component.source_column)
    if name in allowed_functions:
        return
    raise ValidateError("'{}' is an unsupported name".format(name),
                        component.source_line,
                        component.source_column)


def validate_declaration_component(component, file_map, in_font_context):
    """ Validate that supplied component of a css declaration is safe to serve
        from own domain.  If there is a parse error or validation failure,
        ValidationError is raised. Any urls are replaced with statically
        provided images from file_map (see the description in the documentation
        for validate_stylesheet). Any functions used are checked against a
        whitelist.
    """
    automatically_allowed = {'dimension',
                             'percentage',
                             'hash',
                             'whitespace',
                             'literal',
                             'number',
                             'string',
                             'ident'}
    if component.type in automatically_allowed:
        return
    elif component.type == 'url':
        validate_url_value(component, file_map, in_font_context)
    elif component.type == 'function':
        validate_function_value(component, file_map)
    else:
        raise ValidateError(component.message,
                            component.source_line,
                            component.source_column)


def validate_declaration(declaration, file_map, in_font_context):
    """ Validate that supplied css declaration is safe to serve from own
        domain.  If there is a parse error or validation failure,
        ValidationError is raised. Any urls are replaced with statically
        provided images from file_map (see the description in the documentation
        for validate_stylesheet). The property name and any functions are
        checked against a whitelist.
    """
    if declaration.type == 'error':
        raise ValidateError(declaration.message, declaration.source_line,
                            declaration.source_column)
    validate_declaration_name(declaration, file_map)
    result = []
    for component in declaration.value:
        result.append(validate_declaration_component(component, file_map,
                                                     in_font_context))


def validate_rule_list(rules, file_map, in_font_context):
    """ Validate that supplied list of rules is safe to serve from own
        domain.  If there is a parse error or validation failure,
        ValidationError is raised. Any urls are replaced with statically
        provided images from file_map (see the description in the documentation
        for validate_stylesheet).
    """
    parsed = tinycss2.parse_rule_list(rules,
                                      skip_whitespace=True,
                                      skip_comments=True)
    for rule in parsed:
        if rule.type == 'at-rule':
            in_font_context = in_font_context or rule.at_keyword == "font-face"
            validate_rule_list(rule.content, file_map, in_font_context)
        elif rule.type == 'qualified-rule':
            validate_declaration_list(rule.content, file_map, in_font_context)
        elif rule.type == 'error':
            raise ValidateError(rule.message,
                                rule.source_line,
                                rule.source_column)
        else:
            raise ValidateError("unknown error",
                                rule.source_line,
                                rule.source_column)


def validate_declaration_list(declarations, file_map, in_font_context):
    """ Validate that supplied list of declarations is safe to serve from own
        domain.  If there is a parse error or validation failure,
        ValidationError is raised. Any urls are replaced with statically
        provided images from file_map (see the description in the documentation
        for validate_stylesheet).
    """
    parsed = tinycss2.parse_declaration_list(declarations,
                                             skip_whitespace=True,
                                             skip_comments=True)
    for declaration in parsed:
        if declaration.type == 'declaration':
            validate_declaration(declaration, file_map, in_font_context)
        elif declaration.type == 'error':
            raise ValidateError(declaration.message,
                                declaration.source_line,
                                declaration.source_column)
        else:
            raise ValidateError("unknown error",
                                declaration.source_line,
                                declaration.source_column)


def validate_stylesheet(css_bytes, file_map):
    """ Validate that untrusted stylesheet is safe to serve from own domain.

        Args:
            css_bytes (bytes): css content to check
            file_map: map of the X in url{x} to a tuple (file_data, mimetype)

        Returns CSS as a string, with files included safely.

        If there is a parse error or validation failure, ValidationError is
        raised.
    """
    rules, _ = tinycss2.parse_stylesheet_bytes(css_bytes,
                                               skip_whitespace=True,
                                               skip_comments=True)
    output = ''
    for rule in rules:
        if rule.type == 'at-rule':
            if rule.content is not None:
                in_font_context = rule.at_keyword == "font-face"
                try:
                    validate_declaration_list(rule.content, file_map,
                                              in_font_context)
                except ValidateError as e:
                    try:
                        validate_rule_list(rule.content, file_map,
                                           in_font_context)
                    except ValidateError:
                        raise e
        elif rule.type == 'qualified-rule':
            validate_declaration_list(rule.content, file_map, False)
        elif rule.type == 'error':
            raise ValidateError(rule.message,
                                rule.source_line,
                                rule.source_column)
        else:
            raise ValidateError("unknown error",
                                rule.source_line,
                                rule.source_column)
        output += rule.serialize()
        output += '\n'
    return output
