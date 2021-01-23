module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  "plugins": ["prettier"],
  
  "extends": [
    'plugin:vue/recommended',
    "standard",
    "plugin:prettier/recommended"
  ],
  rules: {
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    // with taking DB scheme into considaration, allow snakecase
    camelcase: 0,
    // do not use var definition
    "no-var": "error",
    // git priority to prettier
    "prettier/prettier": ["error", { semi: false, trailingComma: "es5" }],
    "space-before-function-paren": "off",
    "object-curly-spacing": "off",
    indent: "off",
    curly: "off",
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      },
    ],
    "max-len": ["warn", { code: 100 }],
    // v-html は許可する
    "vue/no-v-html": 0,
    // propsはupperCaseで書く
    "vue/attribute-hyphenation": ["error", "never"],
    // Prettierに任せる
    "vue/max-attributes-per-line": 0,
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
        },
      },
    ],
    "vue/singleline-html-element-content-newline": 0,
    "vue/html-closing-bracket-newline": 0,
    "vue/html-indent": 0,
  },
}
