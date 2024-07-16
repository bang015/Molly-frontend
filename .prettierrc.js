export default {
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  arrowParens: 'avoid',
  jsxBracketSameLine: false,
  endOfLine: 'auto',
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
  ],
}