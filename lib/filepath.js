const path = require('path');

/**
 * 获取 key 前缀
 * @param file
 * @returns {string}
 */
export const generateKeyPrefix = (rootPath, file, maxDepth = 0) => {
  let pathName = path.dirname(file);
  let filename = path.basename(file, path.extname(file));
  let pathStr = path.relative(rootPath, pathName);
  let pathParts = pathStr.split('/');

  if (maxDepth > 0) {
    pathParts = pathParts.slice(-maxDepth);
  }

  pathParts.push(filename);
  pathStr = pathParts.join('_');

  return `${pathStr.replace(/[^a-z0-9]/g, '_').replace(/\..*$/, '')}.`;
};
