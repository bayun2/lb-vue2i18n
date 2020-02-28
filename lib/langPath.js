const vscode = require('vscode')
module.exports.getPath = () => {
  return vscode.workspace.getConfiguration('vue-i18n').get('i18nPaths') || 'lang'
}