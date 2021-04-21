const vscode = require('vscode');
const path = require('path');
const { getConfig } = require('./utils/getConfig');
const { diff } = require('./utils/diff');

const diffCommon = (source, target) => {
  const rootPath = vscode.workspace.workspaceFolders[0].uri.path;
  const { langPath } = getConfig();
  const cnObj = require(path.join(rootPath, langPath, `${source}.json`));
  const enObj = require(path.join(rootPath, langPath, `${target}.json`));
  const diffObj = diff(cnObj, enObj);
  const newFile = vscode.Uri.parse(
    'untitled:' + path.join(rootPath, langPath, `diff-${source}-${target}.json`)
  );
  vscode.workspace.openTextDocument(newFile).then((document) => {
    const edit = new vscode.WorkspaceEdit();
    edit.insert(
      newFile,
      new vscode.Position(0, 0),
      JSON.stringify(diffObj, null, '\t')
    );
    return vscode.workspace.applyEdit(edit).then((success) => {
      if (success) {
        vscode.window.showTextDocument(document);
      } else {
        vscode.window.showInformationMessage('Error!');
      }
    });
  });
};

module.exports.diffCNWithHK = () => {
  diffCommon('zh-CN', 'zh-HK');
};
module.exports.diffCNWithEN = () => {
  diffCommon('zh-CN', 'en');
};
