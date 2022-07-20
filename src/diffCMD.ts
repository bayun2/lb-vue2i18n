import path from 'path';
import vscode from 'vscode';
import { diff } from './utils/diff';
import { getConfig } from './utils/getConfig';

const diffCommon = (source, target) => {
  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.path;
  if (!rootPath) {
    return;
  }

  const { localePath } = getConfig();
  const cnObj = require(path.join(rootPath, localePath, `${source}.json`));
  const enObj = require(path.join(rootPath, localePath, `${target}.json`));
  const diffObj = diff(cnObj, enObj);
  const newFile = vscode.Uri.parse(
    'untitled:' +
      path.join(rootPath, localePath, `diff-${source}-${target}.json`)
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

export const diffCNWithHK = () => {
  diffCommon('zh-CN', 'zh-HK');
};
export const diffCNWithEN = () => {
  diffCommon('zh-CN', 'en');
};
