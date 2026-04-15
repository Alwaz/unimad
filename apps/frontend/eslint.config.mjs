import nextConfig from '@repo/eslint-config/next';

export default [
  ...nextConfig,
  {
    files: ['next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
];
