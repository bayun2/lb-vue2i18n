// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const { generate } = require('./lib/generate');
const { exportFiles } = require('./lib/exportFiles');
const { diffCNWithEN, diffCNWithHK } = require('./lib/diffCMD');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "lb-vue2i18n" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.lbVue2i18n',
    function () {
      // The code you place here will be executed every time your command is executed
      // /Users/rwt/gitlab/stock-activity/pages/index.vue
      const currentlyOpenTabfilePath =
        vscode.window.activeTextEditor.document.fileName;
      if (
        !path.extname(currentlyOpenTabfilePath).toLowerCase().includes('vue')
      ) {
        vscode.window.showWarningMessage('仅支持从 Vue 文件内提取文本。');
        return false;
      }
      // /Users/rwt/gitlab/stock-activity
      const rootPath = vscode.workspace.workspaceFolders[0].uri.path;
      generate(
        currentlyOpenTabfilePath,
        rootPath,
        vscode.window.showWarningMessage
      );
    }
  );

  let disposable2 = vscode.commands.registerCommand(
    'extension.lbJS2i18n',
    function () {
      // The code you place here will be executed every time your command is executed
      // /Users/rwt/gitlab/stock-activity/pages/index.vue
      const currentlyOpenTabfilePath =
        vscode.window.activeTextEditor.document.fileName;

      const extname = path.extname(currentlyOpenTabfilePath);
      if (!extname.match(/(js|jsx|tsx|ts)$/i)) {
        vscode.window.showWarningMessage(
          '仅支持 JavaScript / TypeScript 类型 [js, jsx, ts, tsx] 的文件。'
        );
        return false;
      }

      // /Users/rwt/gitlab/stock-activity
      const rootPath = vscode.workspace.workspaceFolders[0].uri.path;
      generate(
        currentlyOpenTabfilePath,
        rootPath,
        vscode.window.showInformationMessage,
        'js'
      );
    }
  );

  let disposable3 = vscode.commands.registerCommand(
    'extension.lbDiffCNWithEN',
    function () {
      diffCNWithEN();
    }
  );

  let disposable4 = vscode.commands.registerCommand(
    'extension.lbDiffCNWithHK',
    function () {
      diffCNWithHK();
    }
  );

  let disposable5 = vscode.commands.registerCommand(
    'extension.lbExportArchive',
    function () {
      // /Users/rwt/gitlab/stock-activity
      const rootPath = vscode.workspace.workspaceFolders[0].uri.path;

      exportFiles(rootPath, vscode.window.showInformationMessage);
    }
  );

  context.subscriptions.concat([
    disposable,
    disposable2,
    disposable3,
    disposable4,
    disposable5,
  ]);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
