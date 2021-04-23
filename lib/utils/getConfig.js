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

  let locoExportKey;
  if (
    packageJson &&
    packageJson.lbVue2i18n &&
    packageJson.lbVue2i18n.locoExportKey
  ) {
    locoExportKey = packageJson.lbVue2i18n.locoExportKey;
  }

  let langPath = 'lang';
  if (
    packageJson &&
    packageJson.lbVue2i18n &&
    packageJson.lbVue2i18n.langPath
  ) {
    langPath = packageJson.lbVue2i18n.langPath;
  }

  let ext = 'json';
  if (packageJson && packageJson.lbVue2i18n && packageJson.lbVue2i18n.ext) {
    ext = packageJson.lbVue2i18n.ext;
  }

  return {
    langPath,
    locoExportKey,
    rootPath,
    ext, // 后缀，多语言文件后缀不一定是 json
  };
};
