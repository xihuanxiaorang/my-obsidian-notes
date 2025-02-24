---
tags:
  - DevKit
  - CDN
create_time: 2024-12-29 11:14
update_time: 2025/02/14 18:37
---

UNPKG 是一个快速、全球性的 CDN（内容分发网络），为 [npm](https://www.npmjs.com/) 上的所有包提供服务。它可以通过 URL 加载任意 npm 包中的文件，简单方便，URL 格式如下：

```http
https://unpkg.com/:package@:version/:file
```

- `:package` 是 npm 包的名称。
- `:version`（可选）是具体的版本号、版本范围，或省略以使用最新版本。
- `:file`（可选）是包内文件的路径。

举个栗子（以 Vue 为例）：

1. **加载指定版本的文件**：
   - `https://unpkg.com/vue@3.2.31/dist/vue.global.js`：加载 Vue `3.2.31` 版本中的全局构建文件。
2. **使用版本范围或标签**：
   - `https://unpkg.com/vue@^3/dist/vue.global.js`：加载 `3.x`（（满足 ^3 的语义版本范围））的最新版本的全局构建文件。
   - `https://unpkg.com/vue/dist/vue.global.js`：省略版本号时，将加载 Vue 的最新标签版本（通常是最新发布版本）的全局构建版本。
3. **省略文件路径**：
   - `https://unpkg.com/vue`：当省略文件路径时，UNPKG 会尝试加载包中 `package.json` 的 `unpkg` 字段指定的文件。如果该字段不存在，则会回退到 `main` 字段指定的文件。
4. **查看包内所有文件列表（在 URL 末尾添加斜杠 `/`）**：
   - `https://unpkg.com/vue/`：显示 Vue 包内所有文件的列表（如下图所示），方便查找所需的文件路径。
     ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412291158897.png)
