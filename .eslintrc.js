module.exports = {
    "extends": "airbnb",
    "env": {
        "browser": true,
        "jest": true,
        "node": true,
    },
    "plugins": [
      "import",
      "react",
      "jsx-a11y"
    ],
    "settings": {
      "import/resolver": {
        "node": {
          "paths": ["./src"]
        }
      }
    },
    "rules": {
        "import/no-unresolved": "off",
        "import/extensions": "off",
        "jsx-a11y": "off",
        "jsx-a11y/href-no-hash": "off",
        "jsx-a11y/label-has-for": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/anchor-is-valid": ["warn", { "aspects": ["invalidHref"] }],
        "react/forbid-prop-types": "off",
        "react/jsx-filename-extension": "off",
        "react/require-default-props": "off",
        "space-before-function-paren": "off",
        "function-paren-newline": "off",
        "comma-dangle": "off",
        "quotes": "off",
        "no-confusing-arrow": "off",
        "arrow-body-style": "off",
    }
};
