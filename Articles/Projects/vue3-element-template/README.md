---
tags:
  - Frontend/Vue
  - Frontend/TypeScript
  - Project/后台管理系统
create_time: 2025/06/05 22:35
update_time: 2025/06/30 13:06
---

```dataview
TABLE file.ctime AS "📅 创建时间", file.mtime AS "🕓 修改时间" 
FROM ""
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```

## 推荐插件

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [ESLint Chinese Rules](https://marketplace.visualstudio.com/items/?itemName=maggie.eslint-rules-zh-plugin)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Vue - Official](https://marketplace.visualstudio.com/items/?itemName=Vue.volar)
- [UnoCSS](https://marketplace.visualstudio.com/items/?itemName=antfu.unocss)
- [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)

在项目根目录下创建 `.vscode/extensions.json` 文件，内容如下所示：

```json hl:3-9
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "maggie.eslint-rules-zh-plugin",
    "esbenp.prettier-vscode",
    "editorconfig.editorconfig",
    "antfu.unocss",
    "antfu.iconify"
  ]
}
```

这样团队其他小伙伴在拉取代码使用 VSCode 打开之后，在扩展中输入 `@recommended` 就会推荐安装这些插件。
