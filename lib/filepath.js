const path = require('path');

/**
 * 获取 key 前缀
 * @param file
 * @returns {string}
 */
const generateKeyPrefix = (rootPath, file, maxDepth = 0) => {
  let pathName = path.dirname(file);
  let filename = path.basename(file, path.extname(file));

  let pathStr = path.relative(rootPath, pathName);
  let pathParts = pathStr.split('/');

  if (maxDepth > 0) {
    pathParts = pathParts.slice(-maxDepth);
  }

  pathStr = pathParts.join('_') + '.' + filename;

  return `${pathStr.replace(/[^a-z0-9\.]/g, '_')}_`;
};

module.exports = {
  generateKeyPrefix,
};
