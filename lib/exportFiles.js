require('colors');
const path = require('path');
const fs = require('fs');
const LocoClient = require('loco-api-js');
const _ = require('lodash')
const { getConfig } = require('./utils/getConfig');

const writeMessage = (json, filePath) => {
  fs.writeFileSync(filePath, JSON.stringify(json, null, '\t'), 'utf8');
};

module.exports.exportFiles = async (rootPath, showInformationMessage) => {
  const { langPath, locoExportKey } = getConfig();

  let loco;
  if (locoExportKey) {
    loco = new LocoClient(locoExportKey);
  } else {
    showInformationMessage(
      '没有在 package.json 中，配置项目对应多语言平台 key'
    );
    return;
  }

  let downloaded = 0;
  const locales = ['zh-CN', 'en', 'zh-HK'];
  for (const locale of locales) {
    const filePath = path.join(rootPath, langPath, `${locale}.json`);
    // 默认语言置空
    const json = await loco.exportLocale(locale, {fallback: ''});
    // 默认语言置空
    const bankJson = await loco.exportLocale(locale, {fallback: '&status=Blank translation'});
    if (json.error) {
      showInformationMessage(`${locale} 语言文件下载失败，${json.error}`);
    } else {
      // 移除语言包中的空词条，并且保留状态为 Blank translation 的词条
      const message = _.assign(_.pickBy(json), bankJson)
      writeMessage(message, filePath);
      showInformationMessage(`${locale} 语言文件下载完成`);
      downloaded++;
    }
  }
  if (downloaded === locales.length) {
    showInformationMessage('全部语言文件下载完成');
  }
};
