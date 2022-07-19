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

  const { lbVue2i18n } = packageJson || {};

  let locoExportKey,
    langPath = 'lang',
    ext = 'json',
    vueType = 'vue2',
    keyPrefixMaxDepth = 0;

  if (lbVue2i18n) {
    locoExportKey = lbVue2i18n.locoExportKey;
    langPath = lbVue2i18n.langPath;
    ext = lbVue2i18n.ext;
    vueType = lbVue2i18n.vueType;
    keyPrefixMaxDepth = lbVue2i18n.maxKeyPrefixDepth;
  }

  return {
    langPath,
    locoExportKey,
    rootPath,
    vueType, // 是 Vue 3 还是 Vue 2，默认 Vue 2，决定了输出到 Vue 文件的是 this.$t or $t，Vue  3 大概率写在 setup 中不要加 this
    ext, // I18n 文件扩展名，默认 json，多语言文件后缀不一定是 json
    keyPrefixMaxDepth,
  };
};
