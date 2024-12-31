---
tags:
  - Frontend
  - Vue
create_time: 2024-12-28 22:06
update_time: 2024/12/31 22:01
---

Vue 提供了灵活的使用方式，通过直接在 HTML 文件中引入 CDN 链接，可以快速搭建开发环境，无需复杂的构建工具。以下是详细的指南和示例，展示如何通过 CDN 使用 Vue。

---

使用 `<script>` 标签从 CDN 引入 Vue，可以快速启动开发。常用的 CDN 包括 [[UNPKG]]、[jsDelivr](https://www.jsdelivr.com/package/npm/vue) 和 [cdnjs](https://cdnjs.com/libraries/vue)。

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

> [!note]
> 使用 CDN 引入 Vue 不涉及构建步骤，因此**无法使用单文件组件（SFC）语法**。

## 全局构建版本

通过全局构建版本引入 Vue 的所有 API 都暴露在全局的 `Vue` 对象中。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>通过 CDN 使用 Vue</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  </head>
  <body>
    <div id="app">{{message}}</div>

    <script>
      const { createApp } = Vue;

      createApp({
        data() {
          return {
            message: "Hello Vue!",
          };
        },
      }).mount("#app");
    </script>
  </body>
</html>
```

## ES 模块构建版本

现代浏览器大多都已原生支持 [ES 模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)。因此我们可以像这样通过 CDN 以及原生 ES 模块使用 Vue：

```html hl:11,12
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>通过 CDN 使用 Vue</title>
  </head>
  <body>
    <div id="app">{{message}}</div>

    <script type="module">
      import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

      createApp({
        data() {
          return {
            message: "Hello Vue!",
          };
        },
      }).mount("#app");
    </script>
  </body>
</html>
```

> [!note]
> 使用了 `<script type="module">`，并且导入的 CDN URL 指向的是 Vue 的 ES 模块构建版本。

### 启用 Import maps

为了避免使用完整的 CDN URL 导入，开发中可以通过 **Import Maps** 映射模块路径。这种方法更加简洁和可维护。

```html hl:7-12,19
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>通过 CDN 使用 Vue</title>
    <script type="importmap">
      {
        "imports": {
          "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
        }
      }
    </script>
  </head>
  <body>
    <div id="app">{{message}}</div>

    <script type="module">
      import { createApp } from "vue";

      createApp({
        data() {
          return {
            message: "Hello Vue!",
          };
        },
      }).mount("#app");
    </script>
  </body>
</html>
```

> [!info] 导入映射表的浏览器支持情况
> 导入映射表是一个新功能，请参考[浏览器支持情况](https://caniuse.com/import-maps)，确保使用支持的浏览器版本（如 Safari 16.4+）。

### 拆分模块

在复杂项目中，可以通过模块拆分的方式组织代码，以提高可维护性。

`index.html`

```html hl:20,22
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>通过 CDN 使用 Vue</title>
    <script type="importmap">
      {
        "imports": {
          "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
        }
      }
    </script>
  </head>
  <body>
    <div id="app"></div>

    <script type="module">
      import { createApp } from "vue";
      import MyComponent from "./my-component.js";

      createApp(MyComponent).mount("#app");
    </script>
  </body>
</html>
```

`my-component.js`

```js hl:7
export default {
  data() {
    return {
      count: 0
    }
  },
  template: /*html*/`<div>Count is: {{ count }}</div>`
}
```

> [!note]
> ES 模块无法通过 `file://` 协议加载，因为浏览器出于安全原因要求通过 `http://` 协议工作。可以使用 [[Live Server]] 插件在本地启动 HTTP 服务器。

在上面的代码中，**组件模板是以内联 JavaScript 字符串形式存在的**。如果使用 VS Code，可以安装 [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) 扩展，让模板字符串支持高亮显示。在字符串前添加 `/*html*/` 注释即可。

## 总结

通过 CDN 使用 Vue 是快速启动项目的理想选择，特别适合小型项目或测试环境。它无需构建工具，但受限于无法使用 SFC（单文件组件）。使用 ES 模块版本结合 Import Maps 可以优化开发体验，而模块拆分和工具支持（如 Live Server 和模板高亮扩展）则能进一步提升开发效率。
