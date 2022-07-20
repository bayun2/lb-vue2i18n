import path = require('path');
import vscode = require('vscode');

export function getRootDir(document?: vscode.TextDocument): string | undefined {
  if (vscode.window.activeTextEditor) {
    document = vscode.window.activeTextEditor.document;
  }

  if (!document) {
    return undefined;
  }

  let rootDir = vscode.workspace.getWorkspaceFolder(document.uri);
  if (!rootDir) {
    return path.dirname(document.uri.fsPath);
  }

  return rootDir.uri.fsPath;
}
