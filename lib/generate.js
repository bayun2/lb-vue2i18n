require('colors')
const path = require('path')
const fs = require('fs')

let i18nFile
let messages
let messagesHash = {}
let generate = 1
let rootPath

const initMessage = () => {
  if (fs.existsSync(i18nFile)) {
    try {
      delete require.cache[i18nFile]
      messages = require(i18nFile)
      Object.keys(messages).forEach(key => {
        if (typeof messages[key] === 'string') {
          messagesHash[messages[key]] = key
        }
      })
      //获取最大的index
      generate =
        Math.max(
          ...Object.keys(messages).map(item => item.replace(/^[^\d]+/, '') - 0)
        ) || 1
    } catch (e) {
      console.log(e)
    }
  }
  if (!messages || !Object.keys(messages).length) {
    messages = {}
  }
}

const writeMessage = () => {
  fs.writeFileSync(i18nFile, JSON.stringify(messages, null, '\t'), 'utf8')
}

/**
 * 获取key前缀
 * @param file
 * @returns {string}
 */
const getPreKey = file => {
  return `${path
    .relative(rootPath, file)
    .replace(/[\\/\\\\-]/g, '_')
    .replace(/\..*$/, '')}_`
}

/**
 * 获取当前key
 * @returns {*}
 */
const getCurrentKey = (match, file) => {
  if (messagesHash[match]) return messagesHash[match]
  let key = getPreKey(file) + generate++
  if (!messages[key]) return key.toLowerCase()
  return getCurrentKey(match, file)
}

const generateVueFile = file => {
  let hasReplaced = false
  let content = fs.readFileSync(file, 'utf8')
  // 替换template中的部分
  content = content.replace(/<template(.|\n|\r)*template>/gim, match => {
    return match.replace(
      /(\w+-\w+="|\w+='|\w+="|>|'|")([^'"<>]*[\u4e00-\u9fa5]+[^'"<>]*)(['"<])/gim,
      (_, prev, match, after) => {
        match = match.trim()
        let result = ''
        let currentKey
        if (match.match(/{{[^{}]+}}/)) {
          //对于 muscache 中部分的替换
          let matchIndex = 0
          let matchArr = []
          match = match.replace(/{{([^{}]+)}}/gim, (_, match) => {
            matchArr.push(match)
            return `{${matchIndex++}}`
          })
          currentKey = getCurrentKey(match, file)
          if (!matchArr.length) {
            result = `${prev}{{$t('${currentKey}')}}${after}`
          } else {
            result = `${prev}{{$t('${currentKey}', [${matchArr.toString()}])}}${after}`
          }
        } else {
          currentKey = getCurrentKey(match, file)
          if (prev.match(/^(\w+\-\w+=")$/)) {
            //对于属性中普通文本的替换
            result = `:${prev}$t('${currentKey}')${after}`
          } else if (prev.match(/^\w+='$/)) {
            //对于属性中普通文本的替换
            result = `:${prev}$t("${currentKey}")${after}`
          } else if (prev.match(/^\w+="$/)) {
            //对于属性中普通文本的替换
            result = `:${prev}$t('${currentKey}')${after}`
          } else if (prev === '"' || prev === "'") {
            //对于属性中参数形式中的替换
            result = `$t(${prev}${currentKey}${after})`
          } else {
            //对于tag标签中的普通文本替换
            result = `${prev}{{$t('${currentKey}')}}${after}`
          }
        }
        messages[currentKey] = match
        messagesHash[match] = currentKey
        hasReplaced = true
        return result
      }
    )
  })
  // 替换script中的部分
  content = content.replace(/<script(.|\n|\r)*script>/gim, match => {
    //替换注释部分
    let comments = {}
    let commentsIndex = 0
    match = match.replace(
      /(\/\*(.|\n|\r)*\*\/)|(\/\/.*)/gim,
      (match, p1, p2, p3, offset, str) => {
        //排除掉url协议部分
        if (offset > 0 && str[offset - 1] === ':') return match
        let commentsKey = `/*comment_${commentsIndex++}*/`
        comments[commentsKey] = match
        return commentsKey
      }
    )
    match = match.replace(
      /(['"`])([^'"`\n\r]*[\u4e00-\u9fa5]+[^'"`\n\r]*)(['"`])/gim,
      (_, prev, match, after) => {
        match = match.trim()
        let currentKey
        let result = ''
        if (prev !== '`') {
          //对于普通字符串的替换
          currentKey = getCurrentKey(match, file)
          result = `this.$t('${currentKey}')`
        } else {
          //对于 `` 拼接字符串的替换
          let matchIndex = 0
          let matchArr = []
          match = match.replace(/(\${)([^{}]+)(})/gim, (_, prev, match) => {
            matchArr.push(match)
            return `{${matchIndex++}}`
          })
          currentKey = getCurrentKey(match, file)
          if (!matchArr.length) {
            result = `this.$t('${currentKey}')`
          } else {
            result = `this.$t('${currentKey}', [${matchArr.toString()}])`
          }
        }
        // readFileSync时，会把value里的\n转仓\\n，在这里需要转回去
        messages[currentKey] = match.replace(/\\n/g, '\n')
        messagesHash[match] = currentKey
        hasReplaced = true
        return result
      }
    )
    //换回注释
    return match.replace(/\/\*comment_\d+\*\//gim, match => {
      return comments[match]
    })
  })
  if (!hasReplaced) {
    return false
  }
  hasReplaced && fs.writeFileSync(file, content, 'utf-8')
  return true
}

module.exports.generate = (file, rPath) => {
  rootPath = rPath
  i18nFile = path.join(rootPath, `/lang/zh-CN.json`)
  messages = {}
  messagesHash = {}
  generate = 1
  initMessage()
  const hasReplaced = generateVueFile(file)
  if (hasReplaced) {
    writeMessage()
    return true
  } else {
    return false
  }
}
