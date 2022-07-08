module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["eslint:recommended", "plugin:import/recommended"],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "globals": {
        "io": "readonly"
    },
    "rules": {
        "indent": "off",
        "one-var": "off",
        "quotes": "off",
        "object-curly-spacing": "off",
        "no-underscore-dangle": "off",
        "quote-props": "off",
        "no-extra-boolean-cast": "off",
        "no-param-reassign": "off",
        "no-alert": "off",
        "consistent-this": "off",
        "brace-style": "off",
        "camelcase": "off",
        "curly": "off",
        "padded-blocks": "off",
        "no-multi-spaces": "off",
        "semi": "off",
        "eqeqeq": "off",
        "dot-notation": "off",
        "max-params": "off",
        "no-trailing-spaces": "off",
        "no-func-assign": "off",
        "no-proto": "off",
        "consistent-return": "off",
        "space-before-function-paren": "off",
        "no-extra-parens": "off",
        "no-empty": "off",
        "max-depth": "off",
        "no-else-return": "off",
        "no-prototype-builtins": "off",
        "no-throw-literal": "off",
        "yoda": "off",
        "no-extra-semi": "off",
        "valid-jsdoc": "off",
        "new-cap": "off",
        "no-native-reassign": "off",
        "no-global-assign": "off",
        "no-unused-vars": ["error", { "args": "none" }]
    }
};
