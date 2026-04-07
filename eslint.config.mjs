import prettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

const eslintConfig = defineConfig([
    tseslint.configs.recommended,
    prettier,
    globalIgnores(['.next/**', 'out/**', 'build/**'])
])

export default eslintConfig
