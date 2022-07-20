import assert from 'assert';
import { formatI18nKey, generateKeyPrefix } from './filepath';

test('formatI18nKey', () => {
  assert.equal(
    formatI18nKey('/foo/app/user_list/Bar.dar&1123/中文的-path/app.tsx'),
    'foo_app_user_list_Bar_dar_1123_path_app_tsx'
  );
  assert.equal(formatI18nKey('__foo_bar__dar__'), 'foo_bar_dar');
});

test('generateKeyPrefix', () => {
  assert.equal(
    generateKeyPrefix('./foo/bar/dar/aaa/bbb/cc*c/users.vue', {
      rootPath: './foo/bar',
    } as any),
    'dar_aaa_bbb_cc_c_users_'
  );

  assert.equal(
    generateKeyPrefix(
      '/work/lb-vue2i18n/packages/vue2i18n/src/lib/utils/files/filepath.ts',
      {
        keyPrefixMaxDepth: 2,
        rootPath: '/work/lb-vue2i18n',
      } as any
    ),
    'utils_files_filepath_'
  );

  assert.equal(
    generateKeyPrefix(
      '/work/lb-vue2i18n/packages/vue2i18n/src/lib/utils/files/filepath.ts',
      {
        keyPrefixMaxDepth: 3,
        rootPath: '/work/lb-vue2i18n',
      } as any
    ),
    'lib_utils_files_filepath_'
  );

  assert.equal(
    generateKeyPrefix(
      './src/renderer/business-_components/LBStockHolding/index.vue',
      {
        rootPath: './src/renderer',
      } as any
    ),
    'business_components_LBStockHolding_index_'
  );

  assert.equal(
    generateKeyPrefix(
      './src/renderer/business-_components/LBStockHolding/index.vue',
      {
        rootPath: './src/renderer',
        stripKeyPrefix: 'business_components',
      } as any
    ),
    'LBStockHolding_index_'
  );
});
