---
tags:
  - Frontend
  - Vue
create_time: 2024-12-28 22:06
update_time: 2024/12/29 18:55
---

我们可以借助 script 标签直接通过 CDN（如 [[UNPKG]]、[jsDelivr](https://www.jsdelivr.com/package/npm/vue) 或 [cdnjs](https://cdnjs.com/libraries/vue)） 来使用 Vue：

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

通过 CDN 使用 Vue 时，虽然不涉及 "构建步骤"，但是**无法使用单文件组件（SFC）语法**。

## 全局构建版本

上面的链接使用了全局构建版本的 Vue，该版本的所有顶层 API 都以属性的形式暴露在了<u>全局</u>的 `Vue` 对象上。

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

在上面的示例中，我们使用了完整的 CDN URL 来导入，但在日常开发过程中，你将看到如下代码：

```js
import { createApp } from 'vue'
```

我们可以使用导入映射表（Import Maps）来告诉浏览器如何定位到导入的 `vue`：

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
> 导入映射表是一个相对较新的浏览器功能。请确保使用其[支持范围](https://caniuse.com/import-maps)内的浏览器。请注意，只有 Safari 16.4 以上版本支持。
