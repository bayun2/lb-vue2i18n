import path = require('path');
import vscode = require('vscode');
import { getConfig } from './getConfig';

export function getRootDir(): string | undefined {
  return getConfig().rootPath;
}
