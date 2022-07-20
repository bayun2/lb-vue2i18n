# Change Log

All notable changes to the "lb-vue2i18n" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Initial release

## [0.2.0] - 2022-02-07

- Add TypeScript language support

## [0.3.0] - 2022-07-19

- 支持 jsx, tsx 扩展名支持（React 支持实验，有问题需要手工处理）;
- 重构 API，配置 key 改成 `i18nExtractor`
- 新增 `keyPrefixMaxDepth` 配置参数，设置 I18n key 生成获取文件夹的最大层数，默认 0 不限制。
- `langPath` 废弃，改用 `localePath`
- 改进 I18n key 的格式，为 `path_to_dir.filename_{n}`

```json
// package.json
"i18nExtractor": {
  // 对应 Loco 上的项目 API Key
  "locoExportKey": "xxxx", 
  // I18n 文件存储路径，默认 /lang
  "localePath": "src/locales", 
  // 是 Vue 3 还是 Vue 2，默认 Vue 2，决定了输出到 Vue 文件的是 this.$t or t，vue3 大概率
  // 写在 setup 中不要加 this，且不能加 $,vue3 $ 只能加载 vue 自己的内部变量上
  "vueType": "vue3",
  // 设置最大的 I18n key 生成文件夹组合层数，默认：0 (不限制)
  // I18n 提取的时候是用文件路径来组合的，例如：{workDir}/src/pages/users/index.vue -> src_pages_users_index_1
  // 这个参数可以控制最大文件夹层数，比如设置 2，会用上面最大两层文件夹作为 key，生成的 key 会是 pages_users_index_1
  "keyPrefixMaxDepth": 5
}
```

## [0.5.0] - 2022-07-20

- 新增 OpenCC 用来实现简体转换繁体（香港），也可以繁体转换简体，以及提供相应的命令转换当前打开的文档。
- 新增  配置，用于定义生成 I18n key 的时候，清理匹配的前缀（缩短 Key 的长度）。
- 修复 I18n key 生成，避免出现连续的下划线。

## [0.5.1] - 2022-07-20

- 新增下载该项目多语言文件菜单项

## [0.6.0] - 2022-07-20

- 改进 package.json 的配置读取，从当前文件最近的地方找 package.json
- 繁体、简体转换命令改进，可以允许只转换文档选区的内容，如果未选择才做整个文件转换。
