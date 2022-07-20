import { Locale } from 'opencc-js';
import vscode from 'vscode';
const OpenCC = require('opencc-js');

const LANGS: Record<string, Locale> = {
  'zh-cn': 'cn',
  'zh-tw': 'tw',
  'zh-hk': 'hk',
};

const getLang = (locale?: string): Locale | null => {
  locale ||= 'cn';
  return LANGS[locale.toLowerCase()];
};

const SUPPORT_LANGS = ['cn', 'tw', 'hk'];

interface IConvertOptions {
  from: string;
  to: string;
}

export const convert = (text: string, options: IConvertOptions): string => {
  const to = getLang(options.to);
  const from = getLang(options.from);

  if (!to || !from) {
    return text;
  }

  // Return error, when from or to not supports, so translate will fallback to next engine.
  if (!SUPPORT_LANGS.includes(to) || !SUPPORT_LANGS.includes(from)) {
    return text;
  }

  const converter = OpenCC.Converter({ from, to });
  return converter(text);
};

export const convertCurrentDocument = (options) => {
  const document = vscode.window.activeTextEditor?.document;

  if (!document) {
    vscode.window.showInformationMessage('没有打开任何文件，无法转换。');
    return;
  }

  const out = convert(document.getText(), options);
  const writeData = Buffer.from(out, 'utf8');
  vscode.workspace.fs.writeFile(document.uri, writeData);
  vscode.window.showInformationMessage('文档语言转换完成。');
};
