import assert from 'assert';
import { convert } from './opencc';

test('Convert OpenCC', () => {
  assert.equal(convert('软件', { from: 'zh-CN', to: 'zh-HK' }), '軟件');
  assert.equal(
    convert('请选择标签', { from: 'zh-CN', to: 'zh-HK' }),
    '請選擇標籤'
  );
  assert.equal(
    convert('成功，已经开始生成，请五分钟以后刷新页面', {
      from: 'zh-CN',
      to: 'zh-HK',
    }),
    '成功，已經開始生成，請五分鐘以後刷新頁面'
  );
});
