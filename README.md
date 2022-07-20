# VS Code I18n Extractor

支持从 Vue, JavaScript, TypeScript, React 的文件中，提取硬编码的中文，把他们转换成 I18n 变量，将提取后的语言合并到语言包 `{workDir}/lang/zh-CN.json`。

通过 diff 命令可以比对 {rootProject}/lang/zh-CN.json 比 {rootProject}/lang/en.json 新增了哪些词条

![demo](https://cdn-support.lbkrs.com/uploads/files/201912/CkYBSKTn1pmcScE3mueYCFCcKCWCiKCc.gif)

下载项目多语言文件，支持 Loco 翻译平台指定 project 下载到当前项目可以在项目根目录的 `package.json` 中设置

```json5
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
