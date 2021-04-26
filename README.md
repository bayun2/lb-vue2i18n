# lb-vue2i18n README

提取.vue 文件中的中文，并把他转成 i18n 变量，将提取后的语言合并到语言包 {rootProject}/lang/zh-CN.json

通过 diff 命令可以比对 {rootProject}/lang/zh-CN.json 比 {rootProject}/lang/en.json 新增了哪些词条

![demo](https://cdn-support.lbkrs.com/uploads/files/201912/CkYBSKTn1pmcScE3mueYCFCcKCWCiKCc.gif)

下载项目多语言文件，支持 loco 翻译平台指定 project 下载到当前项目
可以在项目根目录的 package.json 中设置

```json
"lbVue2i18n": {
  "locoExportKey": "xxxx", // 对应 loco 上的项目 api key
  "langPath": "src/lang", // 默认 /lang
  "vueType": "vue3" //是 vue3 还是 vue2, 默认 vue2，决定了输出到 vue 文件的是 this.$t or t,vue3 大概率写在 setup 中不要加 this, 且不能加 $,vue3 $ 只能加载vue自己的内部变量上
}
```

新增提取 js 文件内的中文
