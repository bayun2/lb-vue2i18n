import path from 'path';
import type { IConfig } from './utils/getConfig';

/**
 * 获取 key 前缀
 * @param file
 * @returns {string}
 */
const generateKeyPrefix = (
  rootPath: string,
  file: string,
  config: IConfig
): string => {
  let pathName = path.dirname(file);
  let filename = path.basename(file, path.extname(file));

  let pathStr = path.relative(rootPath, pathName);
  let pathParts = pathStr.split('/');

  if (config.keyPrefixMaxDepth > 0) {
    pathParts = pathParts.slice(-config.keyPrefixMaxDepth);
  }

  pathStr = pathParts.join('_') + '_' + filename;

  const key = `${pathStr.replace(/[^a-z0-9A-Z]/g, '_')}_`;

  return key.replace(/[_]+/, '_');
};

export { generateKeyPrefix };
