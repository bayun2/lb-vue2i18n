import fs from 'fs';
import path from 'path';
import vscode from 'vscode';
import { getRootDir } from '.';
import { readJSONFile } from './filepath';

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

const findNearPackageJSON = () => {
  const document = vscode.window.activeTextEditor?.document;
  const rootPath = getRootDir();
  if (!rootPath) {
    return 'package.json';
  }

  if (!document) {
    return path.join(rootPath, 'package.json');
  }

  // 递归寻找最近的 package.json
  let parentDir = path.dirname(document.uri.path);
  while (!fs.existsSync(path.join(parentDir, 'package.json'))) {
    parentDir = path.join(parentDir, '..');
    if (parentDir == rootPath || parentDir == '') {
      return path.join(rootPath, 'package.json');
    }
  }

  return path.join(parentDir, 'package.json');
};

export const getConfig = (): IConfig => {
  const rootPath = getRootDir();
  if (!rootPath) {
    return DEFAULT_CONFIG;
  }

  const packagePath = findNearPackageJSON();
  // console.log('------------', packagePath);

  let packageJson;
  if (fs.existsSync(packagePath)) {
    packageJson = readJSONFile(packagePath);
  } else {
    vscode.window.showWarningMessage(
      '项目根目录缺少 package.json，无法正确运行。'
    );
    return DEFAULT_CONFIG;
  }

  let { i18nExtractor } = packageJson || {};

  // DEPRECATED: lbVue2i18n 废弃，改用 i18nExtractor
  if (packageJson.lbVue2i18n) {
    i18nExtractor = packageJson.lbVue2i18n;
  }

  let config: any = {};

  if (i18nExtractor) {
    config.rootPath = rootPath;
    config.locoExportKey = i18nExtractor.locoExportKey;
    // DEPRECATED: langPath 废弃，改用 localePath
    config.localePath =
      i18nExtractor.localePath ||
      i18nExtractor.langPath ||
      DEFAULT_CONFIG.localePath;
    config.ext = i18nExtractor.ext || DEFAULT_CONFIG.ext;
    config.vueType = i18nExtractor.vueType || DEFAULT_CONFIG.vueType;
    config.keyPrefixMaxDepth =
      i18nExtractor.keyPrefixMaxDepth || DEFAULT_CONFIG.keyPrefixMaxDepth;
    config.stripKeyPrefix =
      i18nExtractor.stripKeyPrefix || DEFAULT_CONFIG.stripKeyPrefix;
  }

  return config;
};
