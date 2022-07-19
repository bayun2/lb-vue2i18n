const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

module.exports.getConfig = () => {
  const rootPath = vscode.workspace.workspaceFolders[0].uri.path;
  const packagePath = path.join(rootPath, 'package.json');
  let packageJson;
  if (fs.existsSync(packagePath)) {
    delete require.cache[packagePath];
    packageJson = require(packagePath);
  } else {
    vscode.window.showInformationMessage('项目根目录缺少 package.json');
    return;
  }

  let { i18nExtractor } = packageJson || {};

  // DEPRECATED: lbVue2i18n 废弃，改用 i18nExtractor
  if (packageJson.lbVue2i18n) {
    i18nExtractor = packageJson.lbVue2i18n;
  }

  let locoExportKey,
    localePath = 'lang',
    ext = 'json',
    vueType = 'vue2',
    keyPrefixMaxDepth = 0;

  if (i18nExtractor) {
    locoExportKey = i18nExtractor.locoExportKey;
    // DEPRECATED: langPath 废弃，改用 localePath
    localePath = i18nExtractor.localePath || i18nExtractor.langPath;
    ext = i18nExtractor.ext;
    vueType = i18nExtractor.vueType;
    keyPrefixMaxDepth = i18nExtractor.maxKeyPrefixDepth;
  }

  return {
    localePath,
    locoExportKey,
    rootPath,
    vueType, // 是 Vue 3 还是 Vue 2，默认 Vue 2，决定了输出到 Vue 文件的是 this.$t or $t，Vue  3 大概率写在 setup 中不要加 this
    ext, // I18n 文件扩展名，默认 json，多语言文件后缀不一定是 json
    keyPrefixMaxDepth,
  };
};
