import stylistic from '@stylistic/eslint-plugin';

const indent = 2,
      letIndent = 2,
      constIndent = 3;

const recommendedStyleConfig = stylistic.configs['recommended-flat'];

const additionalStyleConfig = {
  plugins: { stylistic },
  rules: {
    '@stylistic/array-bracket-newline': ['error'],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/brace-style': [
      'error', '1tbs',
      { allowSingleLine: false },
    ],
    '@stylistic/function-call-spacing': ['error'],
    '@stylistic/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/function-paren-newline': ['error', 'multiline'],
    '@stylistic/generator-star-spacing': ['error', 'after'],
    '@stylistic/indent': [
      'error', indent,
      { VariableDeclarator: { let: letIndent, const: constIndent } },
    ],
    '@stylistic/line-comment-position': ['error'],
    '@stylistic/linebreak-style': ['error'],
    '@stylistic/lines-around-comment': ['error'],
    '@stylistic/lines-between-class-members': [
      'error',
      {
        enforce: [
          { blankLine: 'never', prev: 'field', next: 'field' },
          { blankLine: 'always', prev: 'method', next: 'field' },
          { blankLine: 'always', prev: '*', next: 'method' },
        ],
      },
    ],
    '@stylistic/max-len': [
      'error',
      {
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
      },
    ],
    '@stylistic/multiline-comment-style': ['error', 'separate-lines'],
    '@stylistic/no-confusing-arrow': ['error'],
    '@stylistic/no-extra-parens': [
      'error',
      'all',
      {
        conditionalAssign: false,
        returnAssign: false,
        nestedBinaryExpressions: false,
        ternaryOperandBinaryExpressions: false,
        ignoreJSX: 'multi-line',
        enforceForArrowConditionals: false,
        enforceForSequenceExpressions: false,
        enforceForNewInMemberExpressions: false,
      },
    ],
    '@stylistic/no-extra-semi': ['error'],
    '@stylistic/nonblock-statement-body-position': ['error'],
    '@stylistic/object-curly-newline': ['error', { multiline: true }],
    '@stylistic/object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: true },
    ],
    '@stylistic/one-var-declaration-per-line': ['error', 'initializations'],
    '@stylistic/operator-linebreak': [
      'error',
      'none',
      {
        overrides: {
          '?': 'ignore',
          ':': 'ignore',
          '||': 'after',
          '&&': 'after',
        },
      },
    ],
    '@stylistic/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: [
          'multiline-block-like', 'multiline-const', 'multiline-let',
          'directive',
        ],
        next: ['*'],
      },
      {
        blankLine: 'always',
        prev: ['multiline-block-like', 'const', 'let'],
        next: [
          'multiline-block-like', 'multiline-const', 'multiline-let',
          'if', 'do', 'while', 'for',
        ],
      },
      {
        blankLine: 'always',
        prev: ['*'],
        next: ['return', 'class'],
      },
    ],
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/semi-style': ['error'],
    '@stylistic/switch-colon-spacing': ['error'],
    '@stylistic/wrap-regex': ['error'],
    '@stylistic/yield-star-spacing': ['error'],
  },
};

export default [
  recommendedStyleConfig,
  additionalStyleConfig,
];
