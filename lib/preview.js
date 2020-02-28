const path = require('path');
const merge = require('deepmerge');
const fs = require('fs');
const vscode = require('vscode');
const LinkedList = require('small-linked-list').default;
const preview = { 
  provideHover(document, position) {
    const i18nKey = this.getI18nkey(document, position);
    if (!i18nKey) {
      return new vscode.Hover('');
    }
    const text = this.render(i18nKey);
    const contents = new vscode.MarkdownString(text);
    return new vscode.Hover(contents);
  },
  getI18nkey(document, position) {
    const range = document.getWordRangeAtPosition(
      position,
      /\$t\([^\)]+\)/gi
    );
    if (!range) {
      return "";
    }
    const text = document.getText(range);
    return text.replace(/\$t|\(|\)|'|"/gi, "");
  },
  render(i18nKey) {
    const data = this.getData()
    const html = [];
    Object.keys(data).map((langType) => {
      const source = data[langType];
      const value = this.toText(i18nKey,source);
      if (value) {
        html.push(this.formatter(langType, value));
      }else{
        html.push(this.formatter(langType,`"${i18nKey}" is undefined.`));
      }
    });
    return html.join("\n\n");
  },
  formatter(key, value) {
    return `**${key}**: ${value}`;
  },
  toText(key, source) {
    const partKeys = key.split(".");
    const linkedList = new LinkedList.default();
    partKeys.map(partKey => {
      linkedList.append(partKey);
    });
    let value = this.findValue(linkedList.head, source);
    return value;
  },
  findValue(node, target) {
    if (!target[node.element]) {
      return "";
    }
    if (node.next) {
      return this.findValue(node.next, target[node.element]);
    } else {
      return target[node.element];
    }
  },
  getData() {
    let data = {};
    const direNames = this.getLanguageName();
    direNames.map(direName => {
      data = merge(data, this.getContent(direName));
    });
    return data;
  },
  getContent(langName) {
    const configPath = vscode.workspace.workspaceFolders[0].uri.path + '/lang';
    const direPath = path.resolve(configPath, langName);
    try {
      const content = fs.readFileSync(direPath, { encoding: "utf-8" });
      return {
          [langName]: JSON.parse(content)
        };
    } catch (ex) {
      vscode.window.showErrorMessage(`
        Is read path [${direPath}] file when an exception occurs,
        the output format may not be in accordance with the contents of JSON.
      `);
      return {};
    }
  },
  getLanguageName() {
    const configPath = vscode.workspace.workspaceFolders[0].uri.path + '/lang';
    const dires = this.readdir(configPath);
    const langNames = [];
    dires.map(dire => {
      const direPath = path.resolve(configPath, dire);
      if (/\.json$/.test(direPath)){
        langNames.push(dire)
      }
    });
    return langNames
  },
  readdir(path) {
    if (!path) {
      return [];
    }
    return fs.readdirSync(path);
  },
}
module.exports = preview