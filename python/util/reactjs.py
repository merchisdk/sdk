#!/usr/bin/env python

r"""
example usage:

    jsx = "var HelloComponent = React.createClass({\
               render: function() {\
                   return <div>Hello {this.props.name}</div>;\
               }\
           });\
           <HelloComponent name={'teddy'} /> "
    js = jsx_to_javascript(jsx)
    print jsx
    html = javascript_to_html(js)
    print html
"""

import execjs
import os

node = execjs.get("Node")

node_modules_path = os.getcwd() + "/node_modules/"

javascript = """
    var BabelCore = require("{0}babel-core/"),
        React = require("{0}react/");
        TypeScript = require("{0}typescript"),
        ReactDOM = require("{0}react-dom/server"),
        TSESLintParser = require("{0}typescript-eslint-parser/parser"),
        ESLint = require("{0}eslint/lib/api");

    function lint(code) {{
        var parserOptions = {{ecmaFeatures: {{jsx: true}},
                              tokens: true,
                              comment: true}};
        var ast = TSESLintParser.parse(code, parserOptions);
        var source = new ESLint.SourceCode(code, ast);
        var lintOptions = {{
            "globals": {{
             "CURRENCY": false,
             "React": false,
             "URL_MAP": false,
             "moment": false,
             "toastSettingsJobProductionAssignmentComments": false,
             "toastSettingsJobProductionAssignmentQuote": false,
             "$": false,
             "MERCHI": false,
             "console": false,
             "job": false,
             "currentUser": false,
            }},
            rules:
            {{"semi": 2,
              "no-cond-assign": ["error", "always"],
              "no-constant-condition": ["error"],
              "no-control-regex": ["error"],
              "no-debugger": ["error"],
              "no-dupe-args": ["error"],
              "no-dupe-keys": ["error"],
              "no-duplicate-case": ["error"],
              "no-empty": ["error", {{"allowEmptyCatch": true}}],
              "no-empty-character-class": ["error"],
              "no-ex-assign": ["error"],
              "no-extra-boolean-cast": ["error"],
              "no-extra-parens": ["error"],
              "no-extra-semi": ["error"],
              "no-func-assign": ["error"],
              "no-inner-declarations": ["error"],
              "no-invalid-regexp": ["error"],
              "no-irregular-whitespace": ["error"],
              "no-negated-in-lhs": ["error"],
              "no-obj-calls": ["error"],
              "no-prototype-builtins": ["error"],
              "no-regex-spaces": ["error"],
              "no-sparse-arrays": ["error"],
              "no-unexpected-multiline": ["error"],
              "no-unreachable": ["error"],
              "no-unsafe-finally": ["error"],
              "use-isnan": ["error"],
              "valid-typeof": ["error"],
              "accessor-pairs": ["error"],
              "array-callback-return": "error",
              "block-scoped-var": "error",
              "consistent-return": "error",
              "eqeqeq": ["error", "always"],
              "guard-for-in": "error",
              "no-alert": "error",
              "no-caller": "error",
              "no-case-declarations": "error",
              "no-div-regex": "error",
              "no-else-return": "error",
              "no-empty-pattern": "error",
              "no-eq-null": "error",
              "no-eval": "error",
              "no-extend-native": "error",
              "no-extra-bind": "error",
              "no-extra-label": "error",
              "no-fallthrough": "error",
              "no-floating-decimal": "error",
              "no-implicit-coercion": "error",
              "no-implied-eval": "error",
              "no-iterator": "error",
              "no-labels": "error",
              "no-lone-blocks": "error",
              "no-loop-func": "error",
              "no-native-reassign": "error",
              "no-new": "error",
              "no-new-func": "error",
              "no-new-wrappers": "error",
              "no-param-reassign": "error",
              "no-proto": "error",
              "no-redeclare": "error",
              "no-return-assign": "error",
              "no-script-url": "error",
              "no-self-assign": "error",
              "no-self-compare": "error",
              "no-sequences": "error",
              "no-unmodified-loop-condition": "error",
              "no-unused-expressions": "error",
              "no-unused-labels": "error",
              "no-useless-call": "error",
              "no-useless-concat": "error",
              "no-useless-escape": "error",
              "no-void": "error",
              "no-warning-comments": "error",
              "no-with": "error",
              "radix": "error",
              "no-catch-shadow": "error",
              "no-delete-var": "error",
              "no-label-var": "error",
              "no-shadow-restricted-names": "error",
              "no-undef": "error",
              "no-undefined": "error",
              "no-new-require": "error",
              "no-path-concat": "error",
              "no-process-env": "error",
              "no-unneeded-ternary": "error",
              "no-whitespace-before-property": "error",
              "no-mixed-spaces-and-tabs": "error",
              "space-before-blocks": "error",
              "space-before-function-paren": ["error", {{"anonymous": "always",
                                                         "named": "never"}}],
              "space-in-parens": "error",
              "space-infix-ops": "error",
              "space-unary-ops": "error",
              "arrow-body-style": "error",
              "arrow-parens": "error",
              "arrow-spacing": "error",
              "constructor-super": "error",
              "generator-star-spacing": ["error", "after"],
              "no-class-assign": "error",
              "no-confusing-arrow": "error",
              "no-const-assign": "error",
              "no-dupe-class-members": "error",
              "no-duplicate-imports": "error",
              "no-new-symbol": "error",
              "no-restricted-imports": "error",
              "no-this-before-super": "error",
              "no-useless-computed-key": "error",
              "no-useless-constructor": "error",
              "no-useless-rename": "error",
              "prefer-const": "error",
              "prefer-rest-params": "error",
              "prefer-spread": "error",
              "no-console": "0"}}}};
        return ESLint.linter.verify(source, lintOptions);
    }}

    function compile(code) {{
        const options = {{plugins: ["transform-react-jsx",
                                    "transform-remove-strict-mode"]}};
        try {{
          var lintFailures = lint(code);
        }} catch (e) {{
           return [e, ''];
        }}
        if (lintFailures.length !== 0) {{
            return [lintFailures, ''];
        }}
        code = TypeScript.transpile(code);
        return [[], BabelCore.transform(code, options).code];
    }}

    function renderToString(component, args) {{
        eval("var element = " + component + ".apply(null, args);");
        return ReactDOM.renderToString(element);
    }}
""".format(node_modules_path)

library = node.compile(javascript)


def tsx_to_javascript(jsx):
    """ Take a TSX template (e.g. ReactJS component template stuff) and return
        javascript, as a string, that will generate the given component, when
        invoked. Requires nodejs, babel-core, react, react-dom and
        transform-react-jsx installed and available.

        If there are major parsing errors, an exception may be raised. If there
        are warnings or lint errors, a list of errors may be returned.
    """
    result = library.call('compile', jsx)
    if result[0] != []:
        raise ValueError(result[0])
    return result[1]


def javascript_to_html(input_javascript, props):
    """ Take javascript describing how to create a ReactJS component, as a
        string, such as might be returned by jsx_to_javascript, and return
        HTML markup as a string. The resulting DOM nodes have attributes that
        can be understood by ReactJS on the client so that it can transperently
        take over rendering after first page load.
    """
    return library.call('renderToString', input_javascript, [props])


def component_to_javascript(name, body):
    """ Given the name and body (as a JSX string) of a component, convert it to
        a javascript function, as a string, that will generate an in-memory
        react component when invoked. If the name or body is invalid, raise
        ValueError.
    """
    template = "class {} extends React.Component {{\n{}\n}}"
    component = template.format(name, body)
    try:
        result = tsx_to_javascript(component)
    except (execjs._exceptions.RuntimeError,
            execjs._exceptions.ProgramError,
            ValueError) as e:
        raise ValueError(str(e))
    if isinstance(result, list):
        # got lint errors
        raise ValueError(str(result))
    return result
