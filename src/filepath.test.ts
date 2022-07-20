import assert from 'assert';
import { generateKeyPrefix } from './filepath';
import { getConfig } from './utils/getConfig';

test('generateKeyPrefix', () => {
  let config = getConfig();

  assert.equal(
    generateKeyPrefix(
      './foo/bar',
      './foo/bar/dar/aaa/bbb/cc*c/users.vue',
      config
    ),
    'dar_aaa_bbb_cc_c_users_'
  );

  assert.equal(
    generateKeyPrefix(
      '/work/lb-vue2i18n',
      '/work/lb-vue2i18n/packages/vue2i18n/src/lib/utils/files/filepath.ts',
      { keyPrefixMaxDepth: 2 } as any
    ),
    'utils_files_filepath_'
  );

  assert.equal(
    generateKeyPrefix(
      '/work/lb-vue2i18n',
      '/work/lb-vue2i18n/packages/vue2i18n/src/lib/utils/files/filepath.ts',
      { keyPrefixMaxDepth: 3 } as any
    ),
    'lib_utils_files_filepath_'
  );

  assert.equal(
    generateKeyPrefix(
      './src/renderer',
      './src/renderer/business-_components/LBStockHolding/index.vue',
      config
    ),
    'business_components_LBStockHolding_index_'
  );
});
