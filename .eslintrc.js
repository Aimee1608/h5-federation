module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es6: true,
      node: true,
      jest: true,
    },
    parser: "babel-eslint",
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "prettier"
    ],
    globals: {
      god: true,
      PageData: true
    },
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: [],
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: [2, 'always'],
      'no-console': 'off',
      'no-prototype-builtins': 0,
      'react/prop-types': [0],
    },
    settings: {
      react: {
        createClass: 'createReactClass', // Regex for Component Factory to use,
        pragma: 'React', // Pragma to use, default to "React"
        version: 'detect', // React version. "detect" automatically picks the version you have installed.
        flowVersion: '0.53', // Flow version
      },
    },
  };
  