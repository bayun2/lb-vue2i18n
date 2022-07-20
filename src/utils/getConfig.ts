import fs from 'fs';
import path from 'path';
import vscode from 'vscode';

type VueType = 'vue2' | 'vue3';

export interface IConfig {
  rootPath: string;
  locoExportKey: string;
  localePath: string;
  // I18n 文件扩展名，默认 json，多语言文件后缀不一定是 json
  ext: string;
  // 是 Vue 3 还是 Vue 2，默认 Vue 2，决定了输出到 Vue 文件的是 this.$t or $t，Vue  3 大概率写在 setup 中不要加 this
  vueType: VueType;
  keyPrefixMaxDepth: number;
  /**
   * 生成 I18n key 的时候，去掉前缀
   *
   * 例如：stripKeyPrefix: "src/pages"
   *
   * 原本生成 src_pages_users_show_100 会变成 users_show_100
   */
  stripKeyPrefix: string;
}

const DEFAULT_CONFIG: IConfig = {
  rootPath: '',
  localePath: 'lang',
  ext: 'json',
  vueType: 'vue2',
  keyPrefixMaxDepth: 0,
  stripKeyPrefix: '',
  locoExportKey: '',
};

export const getConfig = (): IConfig => {
  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.path;
  if (!rootPath) {
    return DEFAULT_CONFIG;
  }

  const packagePath = path.join(rootPath, 'package.json');
  let packageJson;
  if (fs.existsSync(packagePath)) {
    delete require.cache[packagePath];
    packageJson = require(packagePath);
  } else {
    vscode.window.showInformationMessage('项目根目录缺少 package.json');
    return DEFAULT_CONFIG;
  }

  let { i18nExtractor } = packageJson || {};

  // DEPRECATED: lbVue2i18n 废弃，改用 i18nExtractor
  if (packageJson.lbVue2i18n) {
    i18nExtractor = packageJson.lbVue2i18n;
  }

  const config = Object.assign({}, DEFAULT_CONFIG);

  if (i18nExtractor) {
    config.locoExportKey = i18nExtractor.locoExportKey;
    // DEPRECATED: langPath 废弃，改用 localePath
    config.localePath = i18nExtractor.localePath || i18nExtractor.langPath;
    config.ext = i18nExtractor.ext;
    config.vueType = i18nExtractor.vueType;
    config.keyPrefixMaxDepth = i18nExtractor.maxKeyPrefixDepth;
    config.stripKeyPrefix = i18nExtractor.stripKeyPrefix || '';
  }

  return config;
};
