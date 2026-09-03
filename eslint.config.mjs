/**
 * ESLINT (flat config)
 * ----------------------------------------------------------------
 * Next 16 + ESLint 10 uchun `eslint-config-next/core-web-vitals`
 * allaqachon FLAT config massiv qaytaradi (ichida next, next/typescript
 * va core-web-vitals bor) — shuning uchun FlatCompat/endash KERAK EMAS.
 *
 * Qo'shimcha qoidalar loyihaga moslab yumshatilgan:
 *   - ishlatilmagan o'zgaruvchilar `_` prefiksi bilan ruxsat
 *   - `any` — warn (migratsiya davrida qulay)
 *   - apostroflar matnda ruxsat (o'zbek tilida juda ko'p)
 */

import next from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  ...next,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/data/catalog.json',
      'scripts/**',
    ],
  },
  {
    // Plugin SHU obyektning o'zida e'lon qilinishi kerak (flat config qoidasi)
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default eslintConfig;
