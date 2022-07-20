require('colors');
import fs from 'fs';
import path from 'path';
import { generateKeyPrefix } from './filepath';
import { getConfig } from './utils/getConfig';

let i18nFile;
let messages;
let messagesHash = {};
let generated = 0;
let rootPath;

const initMessage = () => {
  if (fs.existsSync(i18nFile)) {
    try {
      delete require.cache[i18nFile];
      messages = require(i18nFile);
      Object.keys(messages).forEach((key) => {
        if (typeof messages[key] === 'string') {
          messagesHash[messages[key]] = key;
        }
      });
      //获取最大的 index
      generated =
        Math.max(
          ...Object.keys(messages).map(
            // @ts-ignore
            (item) => item.replace(/([^\d]+)|(\d\_+)/g, '') - 0
          ),
          Object.keys(messages).length
        ) || 0;
      // generated = Object.keys(messages).length || 1;
    } catch (e) {
      console.log(e);
    }
  }
  if (!messages || !Object.keys(messages).length) {
    messages = {};
  }
};

const writeMessage = () => {
  fs.writeFileSync(
    i18nFile,
    JSON.stringify(messages, null, '  ') + '\n',
    'utf8'
  );
};

/**
 * 获取当前 key
 * @returns {*}
 */
const getCurrentKey = (match, file) => {
  if (messagesHash[match]) return messagesHash[match];
  generated++;
  let key = generateKeyPrefix(rootPath, file, getConfig()) + generated;
  if (!messages[key]) return key.toLowerCase();
  return getCurrentKey(match, file);
};

const generateVueFile = (file, type, vueType) => {
  let hasReplaced = false;
  let content = fs.readFileSync(file, 'utf8');

  const replaceJS = (match) => {
    //替换注释部分
    let comments = {};
    let commentsIndex = 0;
    match = match.replace(
      /(\/\*(.|\n|\r)*?\*\/)|(\/\/.*)/gim,
      (match, p1, p2, p3, offset, str) => {
        //排除掉 url 协议部分
        if (offset > 0 && str[offset - 1] === ':') return match;
        let commentsKey = `/*comment_${commentsIndex++}*/`;
        comments[commentsKey] = match;
        return commentsKey;
      }
    );
    match = match.replace(
      /(['"`])([^'"`\n\r]*[\u4e00-\u9fa5]+[^'"`\n\r]*)(['"`])/gim,
      (_, prev, match, after) => {
        match = match.trim();
        let currentKey;
        let result = '';
        if (prev !== '`') {
          //对于普通字符串的替换
          currentKey = getCurrentKey(match, file);
          result =
            type === 'js' || vueType === 'vue3'
              ? `t('${currentKey}')`
              : `this.$t('${currentKey}')`;
        } else {
          //对于 `` 拼接字符串的替换
          let matchIndex = 0;
          let matchArr: string[] = [];
          match = match.replace(/(\${)([^{}]+)(})/gim, (_, prev, match) => {
            matchArr.push(match);
            return `{${matchIndex++}}`;
          });
          currentKey = getCurrentKey(match, file);
          if (!matchArr.length) {
            result =
              type === 'js' || vueType === 'vue3'
                ? `t('${currentKey}')`
                : `this.$t('${currentKey}')`;
          } else {
            result =
              type === 'js' || vueType === 'vue3'
                ? `t('${currentKey}', [${matchArr.toString()}])`
                : `this.$t('${currentKey}', [${matchArr.toString()}])`;
          }
        }
        // readFileSync 时，会把 value 里的\n转仓\\n，在这里需要转回去
        messages[currentKey] = match.replace(/\\n/g, '\n');
        messagesHash[match] = currentKey;
        hasReplaced = true;
        return result;
      }
    );
    //换回注释
    return match.replace(/\/\*comment_\d+\*\//gim, (match) => {
      return comments[match];
    });
  };

  const replaceTemplate = (oriContent) => {
    return oriContent.replace(/<template(.|\n|\r)*template>/gim, (match) => {
      return match.replace(
        /(\w+='|\w+="|>|'|")([^'"<>]*[\u4e00-\u9fa5]+[^'"<>]*)(['"<])/gim,
        (_, prev, match, after) => {
          match = match.trim();
          let result = '';
          let currentKey;
          if (match.match(/{{[^{}]+}}/)) {
            //对于 muscache 中部分的替换
            let matchIndex = 0;
            let matchArr: string[] = [];
            match = match.replace(/{{([^{}]+)}}/gim, (_, match: string) => {
              matchArr.push(match);
              return `{${matchIndex++}}`;
            });
            currentKey = getCurrentKey(match, file);
            if (!matchArr.length) {
              result =
                vueType === 'vue3'
                  ? `${prev}{{t('${currentKey}')}}${after}`
                  : `${prev}{{$t('${currentKey}')}}${after}`;
            } else {
              result =
                vueType === 'vue3'
                  ? `${prev}{{t('${currentKey}', [${matchArr.toString()}])}}${after}`
                  : `${prev}{{$t('${currentKey}', [${matchArr.toString()}])}}${after}`;
            }
          } else {
            currentKey = getCurrentKey(match, file);
            if (prev.match(/^\w+='$/)) {
              //对于属性中普通文本的替换
              result =
                vueType === 'vue3'
                  ? `:${prev}t("${currentKey}")${after}`
                  : `:${prev}$t("${currentKey}")${after}`;
            } else if (prev.match(/^\w+="$/)) {
              //对于属性中普通文本的替换
              result =
                vueType === 'vue3'
                  ? `:${prev}t('${currentKey}')${after}`
                  : `:${prev}$t('${currentKey}')${after}`;
            } else if (prev === '"' || prev === "'") {
              //对于属性中参数形式中的替换
              result =
                vueType === 'vue3'
                  ? `t(${prev}${currentKey}${after})`
                  : `$t(${prev}${currentKey}${after})`;
            } else {
              //对于 tag 标签中的普通文本替换
              result =
                vueType === 'vue3'
                  ? `${prev}{{t('${currentKey}')}}${after}`
                  : `${prev}{{$t('${currentKey}')}}${after}`;
            }
          }
          messages[currentKey] = match;
          messagesHash[match] = currentKey;
          hasReplaced = true;
          return result;
        }
      );
    });
  };

  const replaceScript = (oriContent) => {
    return oriContent.replace(/<script(.|\n|\r)*script>/gim, (match) => {
      return replaceJS(match);
    });
  };

  if (type === 'vue') {
    // 替换 template 中的部分
    content = replaceTemplate(content);
    // 替换 script 中的部分
    content = replaceScript(content);
  } else if (type === 'js') {
    content = replaceJS(content);
  }

  if (!hasReplaced) {
    return false;
  }
  hasReplaced && fs.writeFileSync(file, content, 'utf-8');
  return true;
};

const generate = (file, rPath, showInformationMessage, type = 'vue') => {
  rootPath = rPath;

  const { localePath, vueType, ext = 'json' } = getConfig();
  i18nFile = path.join(rootPath, localePath, `zh-CN.${ext}`);
  messages = {};
  messagesHash = {};
  generated = 1;
  initMessage();
  const hasReplaced = generateVueFile(file, type, vueType);
  if (hasReplaced) {
    writeMessage();
  }
  const msg = hasReplaced
    ? `成功提取中文到 ${i18nFile} 内`
    : '没有需要提取的内容';
  showInformationMessage(msg);
};

export { generate };
