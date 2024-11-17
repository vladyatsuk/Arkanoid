import styleConfigs from './style.config.mjs';
import eslintConfigs from './default.config.mjs';
import ts from 'typescript-eslint';

const filesConfig = { files: ['**/*.{js,mjs,cjs,ts,mts,jsx,tsx}'] };

const tsConfig = {
  files: ['**/*.{ts,mts,tsx}'],
  ...ts.configs.recommended,
};

export default [
  filesConfig,
  tsConfig,
  ...styleConfigs,
  ...eslintConfigs,
];
