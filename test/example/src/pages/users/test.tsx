import React from 'react';

export default () => {
  const a = '你好啊';

  return (
    <>
      <div className="flex" title={`Hello 你好`}>
        <label>姓名</label>
        <input placeholder="请输入姓名" />
      </div>
    </>
  );
};
