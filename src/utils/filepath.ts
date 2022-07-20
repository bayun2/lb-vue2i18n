import fs from 'fs';
import path from 'path';
import type { IConfig } from './getConfig';

export const formatI18nKey = (key: string): string => {
  return key
    .replace(/[^a-z0-9A-Z]/g, '_')
    .replace(/[_]+/g, '_')
    .replace(/(^_|_$)/g, '');
};

/**
 * 获取 key 前缀
 * @param file
 * @returns {string}
 */
const generateKeyPrefix = (file: string, config: IConfig): string => {
  let pathName = path.dirname(file);
  let filename = path.basename(file, path.extname(file));

  let pathStr = path.relative(config.rootPath, pathName);
  let pathParts = pathStr.split('/');

  if (config.keyPrefixMaxDepth > 0) {
    pathParts = pathParts.slice(-config.keyPrefixMaxDepth);
  }

  pathStr = pathParts.join('_') + '_' + filename;
  let key = formatI18nKey(pathStr);
  if (config.stripKeyPrefix) {
    key = formatI18nKey(key.replace(config.stripKeyPrefix, ''));
  }

  return key + '_';
};

/**
 * 读取解析 JSON 文件
 * @param file
 * @returns JSON Object
 */
const readJSONFile = (file: string): Object => {
  let content = fs.readFileSync(file, 'utf8');
  return JSON.parse(content);
};

export { generateKeyPrefix, readJSONFile };
