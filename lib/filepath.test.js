import assert from 'assert';
import { generateKeyPrefix } from './filepath';

test('generateKeyPrefix', () => {
  assert.equal(
    generateKeyPrefix('./foo/bar', './foo/bar/dar/aaa/bbb/cc*c/users.vue'),
    'dar_aaa_bbb_cc_c_users.'
  );

  assert.equal(
    generateKeyPrefix(
      '/work/lb-vue2i18n',
      '/work/lb-vue2i18n/packages/vue2i18n/src/lib/utils/files/filepath.ts',
      2
    ),
    'utils_files_filepath.'
  );

  assert.equal(
    generateKeyPrefix(
      '/work/lb-vue2i18n',
      '/work/lb-vue2i18n/packages/vue2i18n/src/lib/utils/files/filepath.ts',
      3
    ),
    'lib_utils_files_filepath.'
  );
});
