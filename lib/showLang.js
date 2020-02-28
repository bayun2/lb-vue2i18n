const vscode = require('vscode');
const flatten = require('flat');
const fs = require('fs');
const Puid = require('puid');
const { getPath } = require('./langPath')
const puid = new Puid();
const langArr = ['javascript', 'vue'];
// 匹配 $t替换的字符串
const dollarTRegexp = /(?<=(\$t|i18n\.t)\(["'])[^'"]+/gm;

const DEFAULT_STYLE = {
  color: '#ffffff',
  backgroundColor: '#115A1C',
};
const ERROR_STYLE = {
  color: '#ffffff',
  backgroundColor: 'red',
};
let decorationTypesList = {};
const showLang = {
  init(uri, context) {
    const defaultOption = {
      selection: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)),
      preview: false,
    };
    if (uri && uri.path) {
      vscode.window.showTextDocument(vscode.Uri.file(uri.path), defaultOption).then(editor => {
        this.edit({editor, context})
      })
    } else {
      this.edit({ context})
    }
  },
  edit({editor}) { 
    let currentEditor = this.getEditor(editor);
    if (!currentEditor) return;
    this.updateDecorations(currentEditor);
  },
  getEditor (editor) {
    let currentEditor = editor || vscode.window.activeTextEditor;
    const stopFlag =
      !currentEditor || !langArr.includes(currentEditor.document.languageId);
    if (stopFlag) return false;
    return currentEditor;
  },
  clearDecorations(envent) {
    let currentEditor = vscode.window.activeTextEditor;
    const length = Object.keys(decorationTypesList).length
    if (length === 0) return
    if (envent && envent.document !== currentEditor.document) return
    Object.keys(decorationTypesList).forEach(v => {
      decorationTypesList[v]['value'].dispose();
    });
    decorationTypesList = {};
  },
  updateDecorations(currentEditor) {
    this.clearDecorations();
    const text = currentEditor.document.getText();
    const fsPath = vscode.workspace.workspaceFolders[0].uri.path + `/${getPath()}/zh-CN.json`
    if (fs.existsSync(fsPath)) {
      fs.readFile(fsPath, (err, data) => {
        try { 
          if (!data) return
          const i18nObj = JSON.parse(data);
          const localeObj = flatten(i18nObj);
          const matches = {};
          const defaultStyleForRegExp = Object.assign({}, DEFAULT_STYLE, {
              overviewRulerLane: vscode.OverviewRulerLane.Right,
          });
          const errorStyleForRegExp = Object.assign({}, ERROR_STYLE, {
              overviewRulerLane: vscode.OverviewRulerLane.Right,
          });
          // 重置 decorationTypes
          const decorationTypes = {};
          let match;
          while ((match = dollarTRegexp.exec(text))) {
            const matchedValue = match[0];
            const contentText = localeObj[matchedValue];
            const startPos = currentEditor.document.positionAt(match.index);
            const endPos = currentEditor.document.positionAt(
                match.index + match[0].length
            );
            const styleForRegExp = contentText
                ? defaultStyleForRegExp
                : errorStyleForRegExp;
            const decoration = {
                range: new vscode.Range(startPos, endPos),
                renderOptions: {
                    after: {
                        color: 'rgba(153,153,153,0.8)',
                        contentText: ` ➟ ${contentText}`,
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                    },
                },
            };

            //重复的可以被显示
            const id = puid.generate();
            if (matches[id]) {
                matches[id].push(decoration);
            } else {
                matches[id] = [decoration];
            }
            matches[id] = [decoration];
            decorationTypes[id] = {
              value: vscode.window.createTextEditorDecorationType(
                styleForRegExp
              ),
              startPos,
              endPos
            };
          }
          const types = Object.keys(decorationTypes);
          if (types.length > 0) {
            types.forEach((v, p) => {
              const decorationType = decorationTypes[v]['value'];
              decorationTypesList[v] = decorationTypes[v];
              currentEditor.setDecorations(decorationType, matches[v]);
            })
          }
        } catch (e) {
        }
      })
    }
  }
} 
module.exports = showLang