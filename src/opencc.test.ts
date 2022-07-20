import assert from 'assert';
import { convert } from './opencc';

test('Convert OpenCC', () => {
  assert.equal(convert('软件', { from: 'zh-CN', to: 'zh-HK' }), '軟件');
});
