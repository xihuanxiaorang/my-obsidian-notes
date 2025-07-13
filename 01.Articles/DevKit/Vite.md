---
tags:
  - Frontend/Vite
  - DevKit
create_time: 2025/05/17 12:59
update_time: 2025/07/13 13:07
---

## 环境变量与模式

在前端工程中，环境变量常用于根据不同运行模式（如开发环境 `development` 或生产环境 `production`）控制代码行为，实现按环境区分的逻辑处理。

### 内置常量

Vite 通过 `import.meta.env` 对象提供了一组内置常量，这些常量在开发时作为全局变量使用，在构建时会被静态替换，有助于实现更高效的 tree-shaking。这些常量在任意环境中均可使用：
![](https://img.xiaorang.fun/202505161900396.png)

- **`import.meta.env.MODE`**:应用当前的[[#模式|运行模式]]。
- **`import.meta.env.BASE_URL`**:应用部署时的基础路径，由 [`base`](https://cn.vite.dev/config/shared-options.html#base) 配置项决定。
- **`import.meta.env.PROD`**:应用是否运行在生产环境（使用 `NODE_ENV='production'` 运行开发服务器或构建应用时使用 `NODE_ENV='production'` ）。
- **`import.meta.env.DEV`**:应用是否运行在开发环境 (永远与 `import.meta.env.PROD` 相反)。
- **`import.meta.env.SSR`**:应用是否运行在[服务端](https://cn.vite.dev/guide/ssr.html#conditional-logic)。

### 自定义环境变量

**Vite 会自动将 `.env` 文件中的环境变量注入至 `import.meta.env` 对象中**。不过，为了防止意外将敏感变量暴露到客户端，**只有以 `VITE_` 前缀命名的变量**才会暴露给经过 Vite 处理的代码。该前缀可通过 [`envPrefix`](https://cn.vite.dev/config/shared-options.html#envprefix) 配置项进行自定义。^595cb7

例如下面这些环境变量：

```env file:.env
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

上述示例中，只有 `VITE_SOME_KEY` 会被暴露为 `import.meta.env.VITE_SOME_KEY` 供客户端访问，而 `DB_PASSWORD` 则不会。

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

> [!note] 环境变量解析
> **所有环境变量均以字符串形式注入**。如上例所示，尽管 `VITE_SOME_KEY` 是一个数字，但它在解析后仍然会返回一个字符串。布尔类型的变量也同样如此。因此在使用时，请根据需要手动进行类型转换。

^bfe456

#### `.env` 文件

Vite 使用 [dotenv](https://github.com/motdotla/dotenv) 从指定的[环境目录](https://cn.vite.dev/config/shared-options.html#envdir)中加载以下几类环境变量文件：

```text
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

> [!tip] 加载优先级说明
> - 模式特定文件（如 `.env.production`）优先级高于通用文件（如 `.env`）。
> - `.env` 和 `.env.local` 文件始终加载，模式匹配时会额外加载对应的 `.env.[mode]` 和 `.env.[mode].local` 文件。
> - 模式文件中的变量会覆盖通用文件中同名变量，但仅在 `.env` 和 `.env.local` 中定义的变量仍然可以在环境中使用。
> - 启动命令行中声明的环境变量（如 `VITE_SOME_KEY=123 vite build`）具有最高的优先级，不会被 `.env` 类文件覆盖。
> - `.env` 类文件会在 Vite 启动一开始时被加载，而改动会在重启服务器后生效。

> [!warning] 安全注意事项
> - `.env.*.local` 文件建议仅用于本地开发，可以包含敏感信息，务必将其加入 `.gitignore` 排除版本控制。
> - 所有暴露给客户端的 `VITE_*` 变量最终都会打包进客户端代码，因此请勿包含任何敏感数据。

#### TypeScript 的智能提示

默认情况下，Vite 在 [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) 中为 `import.meta.env` 提供了基本类型定义。但若希望为自定义的 `VITE_` 前缀环境变量添加智能提示，可在 `src` 目录下添加 `vite-env.d.ts` 文件，扩展 `ImportMetaEnv` 接口：

```ts file:vite-env.d.ts hl:3-10
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

如需进一步限制环境变量的使用范围，还可以启用严格模式，仅允许访问已声明的变量：

```ts file:vite-env.d.ts hl:1-4
interface ViteTypeOptions {
  // 启用严格模式，禁止访问未声明的环境变量
  strictImportMetaEnv: unknown
}
```

### HTML 中的环境变量替换

Vite 支持在 HTML 文件中使用环境变量。你可以通过 `%CONST_NAME%` 的占位符语法插入 `import.meta.env` 中的任意变量：

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

如果某个变量在 `import.meta.env` 中不存在（如 `%NON_EXISTENT%`），该占位符将被忽略，不会进行替换；而在 JavaScript 中访问未定义的 `import.meta.env.NON_EXISTENT` 则会返回 `undefined`。

### 模式

Vite 通过 "模式" 区分不同的运行环境。默认情况下：

- 执行 `vite` 或 `vite dev` 命令时，使用 `development` 模式；
- 执行 `vite build` 命令时，使用 `production` 模式。

这意味着当执行 `vite build` 命令时会自动加载 `.env.production` 文件中的环境变量：

```text file:.env.production
VITE_APP_TITLE=My App
```

在应用中，可以通过 `import.meta.env.VITE_APP_TITLE` 访问该变量。

如需在构建时使用其他模式（如 `staging`），可通过 `--mode` 参数覆盖默认模式：

```bash
vite build --mode staging
```

并创建对应的 `.env.staging` 文件：

```text file:.env.staging
VITE_APP_TITLE=My App (staging)
```

由于 `vite build` 默认运行生产模式构建，你也可以通过使用不同的模式和对应的 `.env` 文件配置来改变它，用以运行开发模式的构建：

```text file:.env.testing
NODE_ENV=development
```

#### NODE_ENV 和模式的区别

需要注意，`NODE_ENV`（即 `process.env.NODE_ENV`）与 Vite 的 "模式"（`mode`）是两个不同的概念。下表展示了不同命令组合对二者的影响：

| 命令                                                   | NODE_ENV        | 模式（`mode`）|
| ---------------------------------------------------- | --------------- | --------------- |
| `vite build`                                         | `"production"`  | `"production"`  |
| `vite build --mode development`                      | `"production"`  | `"development"` |
| `NODE_ENV=development vite build`                    | `"development"` | `"production"`  |
| `NODE_ENV=development vite build --mode development` | `"development"` | `"development"` |

`NODE_ENV` 和模式的不同值也会反映在相应的 `import.meta.env` 属性上：

| 环境设置                   | `import.meta.env.PROD` | `import.meta.env.DEV` |
| ---------------------- | ---------------------- | --------------------- |
| `NODE_ENV=production`  | `true`                 | `false`               |
| `NODE_ENV=development` | `false`                | `true`                |
| `NODE_ENV=other`       | `false`                | `true`                |

| 模式设置                 | `import.meta.env.MODE` |
| -------------------- | ---------------------- |
| `--mode production`  | `"production"`         |
| `--mode development` | `"development"`        |
| `--mode staging`     | `"staging"`            |

> [!tip] `.env` 文件中的 `NODE_ENV`
> `NODE_ENV=…` 可通过命令行参数或者在 `.env` 文件中指定。若在 `.env.[mode]` 中指定了 `NODE_ENV`，则可以使用模式来控制其值。尽管如此，`NODE_ENV` 与模式（`mode`）仍然是两个不同的概念。
>
> 使用命令行设置 `NODE_ENV=…` 的优势在于，它可以在 Vite 配置解析前生效，使你能在 `vite.config.ts` 中通过 `process.env.NODE_ENV` 读取该值，而无需等待 `.env` 文件加载。

## 配置

### 反向代理

[`server.proxy`](https://cn.vite.dev/config/server-options.html#server-proxy) 选项用于为开发服务器配置自定义代理规则，常用于解决本地开发中的请求跨域问题。

- 类型：`Record<string, string | ProxyOptions>`，即一个以路径前缀为键、代理配置为值的 `{ key:options }` 对象；
- ✨所有以指定 `key` 开头的请求路径会被代理到对应目标地址；
- ✨若 `key` 以 `^` 开头，则会被视为正则表达式进行匹配；
- 可通过 `ProxyOptions.configure` 访问底层代理实例（[`http-proxy`](https://github.com/http-party/node-http-proxy) 对象），实现更细粒度的控制；
- 匹配代理规则的请求将不会被 Vite 转换；
- ✨若配置了非相对的基础路径 [`base`](https://cn.vite.dev/config/shared-options.html#base)，则必须在每个 `key` 前加上该 `base` 前缀。

示例：

```ts file:vite.config.ts hl:11-15
export default defineConfig({
  server: {
    proxy: {
      // 简写形式：
      // http://localhost:5173/foo → http://localhost:4567/foo
      '/foo': 'http://localhost:4567',

      // 完整选项形式：
      // http://localhost:5173/api/bar → http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },

      // 正则匹配形式：
      // http://localhost:5173/fallback/ → http://jsonplaceholder.typicode.com/...
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/fallback/, ''),
      },

      // 使用 configure 自定义代理行为：
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 为 http-proxy 实例，可进行自定义处理
        }
      },

      // WebSocket 代理（如 socket.io）：
      // ws://localhost:5173/socket.io → ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
        rewriteWsOrigin: true, // 注意：启用后需防范 CSRF 风险
      },
    },
  },
})
```

## 插件

### unplugin-auto-import

> [!quote]
> [`unplugin-auto-import`](https://github.com/unplugin/unplugin-auto-import) 是基于 [`unplugin`](https://github.com/unplugin) 构建的插件，支持 Vite、Webpack、Rspack、Rollup、esbuild 等工具，实现 **API 自动按需导入**，并支持 TypeScript 类型提示。

✨ 特性亮点：

- 💡 自动导入常用函数和 API，无需手动 `import`
- 🧠 智能分析使用的函数并按需导入
- 🪄 支持 **Vue**、React、**Pinia**、**Vue Router** 等常见库
- 🧩 支持 Vue 模板语法中使用（需开启 `vueTemplate:true`）
- 🧾 支持自动生成 `.d.ts` 类型声明文件
- 🛠 支持自定义导入源、解析器（resolver）、目录扫描等高级用法

无需手动导入：

```ts
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

等价于传统方式：

```ts
import { computed, ref } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
```

#### 安装

```bash
pnpm install -D unplugin-auto-import
```

#### 集成

```ts file:vite.config.ts hl:1,5
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({ /* options */ }),
  ],
})
```

##### 配置项说明

```ts hl:12-38,48-60,70,85-87,96-106
AutoImport({
  // 指定要自动导入的文件类型（即要处理的文件），通过正则表达式匹配
  include: [
    /\.[tj]sx?$/,          // 包括 .ts, .tsx, .js, .jsx 文件
    /\.vue$/,              // .vue 文件
    /\.vue\?vue/,          // 特殊情况的 .vue 文件，vue-loader 启用 experimentalInlineMatchResource 时生成的文件
    /\.vue\.[tj]sx?\?vue/, // Vue 中的 <script setup lang="ts">
    /\.md$/,               // Markdown 文件，常用于文档中写 Vue 示例
  ],

  // 自动导入的模块（支持预设与自定义）
  imports: [
    // 预设支持
    'vue', // 自动导入 Vue API，如 ref、computed 等
    'vue-router', // 自动导入路由 API，如 useRoute、useRouter 等

    // 自定义导入
    {
      '@vueuse/core': [
        'useMouse',                   // import { useMouse } from '@vueuse/core'
        ['useFetch', 'useMyFetch'],   // import { useFetch as useMyFetch } from '@vueuse/core'
      ],
      axios: [
        ['default', 'axios'],         // import axios from 'axios'
      ],
      '[package-name]': [							// 示例结构，可根据需要替换
        '[import-names]',
        ['[from]', '[alias]'],
      ],
    },

    // 类型导入示例（用于全局组件类型提示）
    {
      from: 'vue-router',
      imports: ['RouteLocationRaw'],
      type: true,
    },
  ],

  // 需要忽略自动导入的函数名，即使在 imports 中声明了 useMouse，这里也会过滤掉
  ignore: ['useMouse', 'useFetch'],

  // 根据文件的文件名，自动导入该文件的默认导出，并且变量名就是文件名本身。
  defaultExportByFilename: false,

  // 指定哪些目录下的文件需要被扫描，并自动导入这些文件中导出的函数、变量等
  // 特别适合管理通用工具、hooks、composables 等代码。
  dirs: [
    './hooks',                    // 扫描 hooks 根目录
    './composables',       				// 只扫描 composables 目录下一级模块
    './composables/**',    				// 深度扫描所有嵌套模块
    {
      glob: './hooks',
      types: true,                // 启用该目录下的类型自动导入
    },
    {
      glob: './composables',
      types: false,               // 单独关闭此目录的类型导入（即使上面启用了）
    },
  ],

  // 控制扫描目录时是否自动导入类型
  dirsScanOptions: {
    types: true, // 启用后，自动导入该目录下模块的类型定义
  },

  // 指定生成自动导入 API 的类型声明文件（.d.ts）的路径（如：'src/types/auto-imports.d.ts'）
  // 如果您的项目中已安装 TypeScript，默认会生成 './auto-imports.d.ts' 文件
  // 设置为 false 可关闭类型声明文件的生成
  dts: './auto-imports.d.ts',

  // 生成类型声明文件时需要忽略的函数（通过名称或正则）
  ignoreDts: [
    'ignoredFunction', // 忽略名为 ignoredFunction 的函数
    /^ignore_/         // 忽略以 ignore_ 开头的函数
  ],

  // 是否在 Vue 模板中自动导入（如模板表达式中）
  vueTemplate: false,

  // 是否在 Vue 模板中自动导入指令（v- 指令）
  vueDirectives: undefined,

  // 自定义解析器，用于支持一些特定导入逻辑（与 unplugin-vue-components 兼容）
  resolvers: [
    /* 例如：自动导入某些 UI 库组件 */
  ],

  // 是否将自动导入的依赖加入到 Vite 的依赖优化中
  viteOptimizeDeps: true, // 建议启用，加快构建速度

  // 是否将自动导入语句插入在其他 import 语句后
  injectAtEnd: true,

  // 用于为 ESLint 自动生成一个包含 全局变量声明 的配置文件 .eslintrc-auto-import.json，避免 ESLint 报 no-undef 错误
  eslintrc: {
    enabled: false,                         // 是否启用
    filepath: './.eslintrc-auto-import.json', // 生成的配置文件路径及文件名
    // 指定自动导入变量的权限类型，对应 ESLint 的 globals 设置：
    // true：等价于 'readonly'，变量只能读不能写（推荐）
    // false：等价于 'writable'，变量可被修改
    // 'readonly'：明确指定只读
    // 'writable'：明确指定可写
    // 推荐使用默认的 true，以确保您不会意外修改这些导入值。
    globalsPropValue: true,                
  },

  // 自动生成 Biome Lint 配置文件（适用于 biomejs 代码风格工具）
  biomelintrc: {
    enabled: false,
    filepath: './.biomelintrc-auto-import.json',
  },

  // 将未导入项保存到指定 JSON 文件，可用于调试或其他工具分析
  dumpUnimportItems: './auto-imports.json',
})
```

#### TypeScript 支持说明（类型提示）

为了让 TypeScript 能够正确识别自动导入的 API，并提供智能提示、类型校验功能，需：

1. 启用类型声明文件生成：这会自动生成一个 `auto-imports.d.ts` 类型声明文件，其中包含所有自动导入函数、变量的声明。这样，TypeScript 才能 "看到" 这些变量的存在。

	```ts
	AutoImport({
	  dts: true // 或指定路径，如 './auto-imports.d.ts'
	})
	```

2. 确保声明文件没有被 `tsconfig.json` 排除 & **将 `auto-imports.d.ts` 添加到 `tsconfig.json` 的 `include` 中！**

#### ESLint 配置指南

##### 报错信息

在使用自动导入时，您可能会遇到如下 ESLint 报错：

```perl
'ref' is not defined. (no-undef)
```

这是因为 ESLint 默认会检查变量是否声明，而它并不知道这些变量其实是自动导入的。

##### 解决方案

###### 方案一：直接禁用 `no-undef` 规则（推荐）

如果您使用的是 TypeScript，建议**直接关闭 ESLint 的 `no-undef` 规则**，因为 TypeScript 本身就能准确检查未声明的变量，无需 ESLint 重复校验。

###### 方案二：自动生成 ESLint 全局变量声明配置

通过自动生成的 `.eslintrc-auto-import.json` 文件，让 ESLint 识别自动导入的全局变量，避免 `no-undef` 报错。

1. 启用自动生成 ESLint 配置文件：

	```ts
	AutoImport({
	  eslintrc: {
	    enabled: true,
	  }
	})
	```

2. 在主 ESLint 配置中引入生成的配置文件：

	```js
	// .eslintrc.js
	module.exports = {
	  extends: [
	    './.eslintrc-auto-import.json',
	  ],
	}
	```

### unplugin-vue-components

> [!quote]
> [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) 是基于 [`unplugin`](https://github.com/unplugin) 构建的插件，用于 Vue 项目的 **自动按需导入组件和指令**，兼容多种构建工具，并提供完善的类型支持。

✨ 特性亮点：

- 💚 **支持 Vue 2 与 Vue 3**：无需额外配置，自动适配
- ⚡ **自动导入组件与指令**：无需手动注册，直接在模板中使用即可
- 📦 **构建工具兼容性强**：支持 Vite、Webpack、Rspack、Vue CLI、Rollup、esbuild 等
- 🌴 **自动 Tree-shaking**：只引入实际使用的组件，构建体积更小
- 🗂 **支持目录命名空间**：以文件夹名作为组件前缀，有效避免命名冲突
- 🧾 **自动生成类型声明**：提供 `.d.ts` 文件，TypeScript 支持完善
- 🧩 **内置主流 UI 库解析器**：如 Element Plus、Ant Design Vue、Naive UI、Vuetify 等，可自动注册其组件
- 🔗 **与 `unplugin-icons` 无缝集成**：图标组件也可自动按需注册
- 🛠 **高度可配置**：支持自定义解析器、组件路径、导入规则等高级用法

#### 安装

```bash
pnpm install -D unplugin-vue-components
```

#### 集成

```ts file:vite.config.ts hl:1,5
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({ /* options */ }),
  ],
})
```

##### 配置项说明

```ts hl:3,16,21,24,27
Components({
  // 组件搜索目录（相对路径）
  dirs: ['src/components'],

  // 组件有效文件扩展名
  extensions: ['vue'],

  // 使用 Glob 模式匹配组件文件。配置后将忽略 dirs、extensions 和 directoryAsNamespace。
  // 可使用 `!` 开头的负向匹配排除组件。
  globs: ['src/components/*.{vue}'],

  // 是否递归搜索子目录
  deep: true,

  // 自定义组件解析器（如 ElementPlusResolver、VantResolver 等）
  resolvers: [],

  // 指定生成自动注册组件的类型声明文件（.d.ts）的路径（如：'src/types/components.d.ts'）。
  // 如果您的项目中已安装 TypeScript，默认会生成 './components.d.ts' 文件。
  // 设置为 false 可关闭类型声明文件的生成。
  dts: false,

  // 使用子目录作为组件命名空间（避免重名组件冲突）
  directoryAsNamespace: false,

  // 折叠命名空间中组件目录与文件名中重复的前缀（需配合 directoryAsNamespace 使用）
  collapseSamePrefixes: false,

  // 指定无需作为命名空间前缀的子目录名
  globalNamespaces: [],

  // 是否自动导入 Vue 指令（Vue 3 默认开启；Vue 2 默认关闭）
  // Vue 2 需安装 Babel 支持：npm install -D @babel/parser
  directives: true,

  // 路径转换钩子，可用于自定义路径映射
  importPathTransform: v => v,

  // 是否允许后注册的组件覆盖之前的同名组件
  allowOverrides: false,

  // 匹配目标文件（即需要插入组件导入的文件）
  include: [/\.vue$/, /\.vue\?vue/, /\.vue\.[tj]sx?\?vue/],

  // 排除的文件（不会插入导入）
  exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],

  // 排除的组件名（不会自动导入）
  // 可用于排除异步组件或命名冲突的组件
  excludeNames: [/^Async.+/],

  // Vue 版本，自动检测为默认值
  // 可显式指定：2 | 2.7 | 3
  version: 2.7,

  // 为全局注册的组件补充类型声明（不导入）
  types: [],
}
```

#### 使用方式

只需像平常一样在模板中使用组件即可，**无需手动导入和注册组件**！插件会自动按需导入组件。

如果您的 **父组件本身是异步加载的**，比如您用 Vue Router 的懒加载语法：

```ts
{
  path: '/about',
  component: () => import('@/views/About.vue'), // 异步加载 About.vue
}
```

那么，**`unplugin-vue-components ` 自动导入的子组件**，比如 `ElButton`、`MyCard.vue` 等，**也不会提前打包进主包**，而是和父组件一起，被 Webpack 或 Vite 代码分割（code splitting），**按需加载**。

这可以：

- 减少初始包体积
- 提高页面加载速度（特别是首屏）
- 提升整体性能，尤其是组件量大、页面多的项目

换句话说：自动导入的子组件，会"跟着"父组件走，如果父组件是懒加载的，那它们也不会提前被加载，而是懒加载时一起加载。

您写的代码：

```vue
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
```

等价于：

```vue hl:8,12-14
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
import HelloWorld from './src/components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
}
</script>
```

> [!tip] 默认行为
> 插件默认会扫描 `src/components` 目录下的组件并进行自动导入。如果您有自定义的组件目录，可以通过 `dirs` 选项进行修改。

#### TypeScript 支持

要为自动导入的组件启用 TypeScript 类型提示，Vue 3 社区已提交相关 PR 来扩展全局组件接口。目前 [Volar](https://github.com/vuejs/language-tools) 已原生支持该特性。

如果您使用 Volar，只需启用 `dts` 选项：

```ts
Components({
  dts: true, // 如果项目中已安装 TypeScript，默认会启用
})
```

配置完成后，插件会在项目中自动生成并维护一个 `components.d.ts` 文件，其中包含所有自动导入组件的类型定义。

您可以根据项目需求选择是否将该文件提交至 Git 版本控制中。

> [!note]
> **别忘了将 `components.d.ts` 添加到 `tsconfig.json` 的 `include` 中！**

#### 支持 UI 组件库的自动导入

`unplugin-vue-components` 内置了多个流行 UI 库的解析器（resolvers），可用于按需自动导入对应组件和样式。只需启用相应的解析器即可。

支持的 UI 库包括：

- [Ant Design Vue](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/antdv.ts)
- [Arco Design Vue](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/arco.ts)
- [BootstrapVue](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/bootstrap-vue.ts)
- [Element Plus](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/element-plus.ts)
- [Element UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/element-ui.ts)
- [Headless UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/headless-ui.ts)
- [IDux](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/idux.ts)
- [Inkline](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/inkline.ts)
- [Ionic](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/ionic.ts)
- [Naive UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/naive-ui.ts)
- [Prime Vue](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/prime-vue.ts)
- [Quasar](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/quasar.ts)
- [TDesign](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/tdesign.ts)
- [Vant](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/vant.ts)
    - 官方支持自动导入：[`@vant/auto-import-resolver`](https://github.com/youzan/vant/blob/main/packages/vant-auto-import-resolver/README.md)
- [Varlet UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/varlet-ui.ts)
    - 官方支持自动导入：[`@varlet/import-resolver`](https://github.com/varletjs/varlet/blob/dev/packages/varlet-import-resolver/README.md)
- [VEUI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/veui.ts)
- [View UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/view-ui.ts)
- [Vuetify](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/vuetify.ts)（建议优先使用其官方插件），支持 [v3 + vite](https://www.npmjs.com/package/vite-plugin-vuetify), [v3 + webpack](https://www.npmjs.com/package/webpack-plugin-vuetify), [v2 + webpack](https://npmjs.com/package/vuetify-loader)
- [VueUse Components](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/vueuse.ts)
- [VueUse Directives](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/vueuse-directive.ts)
- [Dev UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/devui.ts)

使用示例：

```ts hl:2,7
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

Components({
  resolvers: [
    // 自动导入 Element Plus 组件
    ElementPlusResolver(),
  ],
})

```

自定义解析器示例：您也可以快速编写自定义 resolver。例如手动导入 Vant 组件：

```ts
Components({
  resolvers: [
    (componentName) => {
      // 所有组件名为 PascalCase（大驼峰）
      if (componentName.startsWith('Van')) {
        return {
          name: componentName.slice(3), // 去除前缀 "Van"
          from: 'vant',
        }
      }
    },
  ],
})
```

#### 全局组件的类型声明支持

部分库（如 Vue Router）会自动注册一些**全局组件**，例如 `<RouterLink>` 和 `<RouterView>`，您可以在任何地方直接使用它们，无需导入或注册。

但这些全局组件**通常没有自动的 TypeScript 类型支持**，需要您手动声明其类型。为此，`unplugin-vue-components` 提供了 `types` 选项，仅用于**补充全局组件的类型声明**，不会做实际导入。

```ts
Components({
  dts: true,
  types: [
    {
      from: 'vue-router',
      names: ['RouterLink', 'RouterView'],
    },
  ],
})
```

上例会将 `RouterLink` 和 `RouterView` 的类型写入自动生成的 `components.d.ts` 文件中，提升开发体验和类型提示。

**插件默认会自动检测如 `vue-router` 等已安装的库，并为其全局组件注册类型声明**。如果您想**禁用这一行为**，可以传入空数组：

```ts
Components({
  types: [], // 完全关闭全局组件类型注册
})
```

### unplugin-icons

> [!quote]
> [`unplugin-icons`](https://github.com/unplugin/unplugin-icons) 是基于 [`unplugin`](https://github.com/unplugin) 构建的插件，支持 Vite、Webpack、Rollup、Rspack、Nuxt 等构建工具，可将 [Iconify](https://iconify.design/) 上的图标自动转换为框架组件，并支持自动导入与 TypeScript 类型提示。

✨ 特性亮点：

- 🌍 **通用支持**：兼容多种构建工具与主流前端框架，跨平台使用无障碍
- 🎨 **图标资源丰富**：内置 150+ 图标集、20 万+ 图标，包括品牌 Logo、Emoji 等
- 📦 **构建工具适配**：原生支持 Vite、Webpack、Rollup、Nuxt、Rspack 等
- ⚙️ **框架广泛兼容**：适用于 Vue 2 / Vue 3、React、Svelte、Solid、Web Components 等
- 🚀 **自动按需加载**：仅打包实际使用的图标，构建更轻量高效
- 🖨 **SSR/SSG 友好**：图标以组件形式编译，支持服务端渲染，避免闪烁（FOUC）
- 🌈 **样式灵活**：可通过类名或 CSS 控制图标大小、颜色、动画等
- 📥 **支持自定义图标**：支持加载本地或远程 SVG，自定义注册为组件
- ⚡ **自动导入组件**：无需手动注册，直接使用 `<IconXXX />` 即可
- 🦾 **TypeScript 支持完善**：自动生成类型声明，拥有完整提示与校验
- 🔍 **图标浏览器集成**：[Icônes](https://icones.js.org/)，在线查找图标并复制组件名

#### 安装

##### 插件安装

```bash
pnpm install -D unplugin-icons
```

##### 图标集安装方式

###### 安装完整图标集

```bash
pnpm install -D @iconify/json
```

- 包含全部图标集（约 120MB）
- 可任意使用所有图标，无需再手动安装
- **构建产物中只包含实际使用的图标**

###### 安装指定图标集

例如：仅安装 [Material Design Icons](https://icon-sets.iconify.design/mdi/)：

```bash
pnpm install -D @iconify-json/mdi
```

您也可以安装其他图标集，包名格式为：`@iconify-json/[图标集 ID]`。

|图标集名称|图标集 ID|
|---|---|
|Element Plus| `ep` |
|Material Design| `mdi` |
|Tabler Icons| `tabler` |

完整列表见：[Iconify 图标库](https://icon-sets.iconify.design/)

###### 自动安装图标集 (推荐)

通过启用 `autoInstall` 选项，在首次使用图标时会自动安装对应图标集，无需手动操作：

```ts file:vite.config.ts hl:6
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    Icons({
      autoInstall: true,
    })
  ],
})
```

- 根据图标前缀（如 `ep`）自动安装对应图标集
- 自动识别当前包管理器（npm / yarn / pnpm）

![](https://img.xiaorang.fun/202505112253794.png)

#### 配置自动导入与组件注册

> [!quote]
> 可配合 [[#unplugin-auto-import]]  和 [[#unplugin-vue-components]] 实现图标组件的自动导入与全局注册。

```ts hl:2-4,12,18-23,26-29
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [
        // 自动导入图标组件
        IconsResolver(),
      ],
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          // 限定启用指定图标集（可选）
          // 若启用多个图标集，可设置为 ['ep', 'mdi', 'tabler'] 等
          // 不指定时默认启用所有已安装图标集
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      // 启用图标集自动安装
      autoInstall: true,
    }),
  ],
})
```

#### 命名规则

使用图标组件解析器（`IconsResolver`）时，**组件名称必须遵循特定的命名规则**，以便正确推断图标来源。

##### 默认命名格式

```text
[prefix]-[图标集 ID]-[图标名称]
```

- `prefix`：组件前缀，默认为 `i`，可通过 `prefix` 选项自定义或禁用
- `图标集 ID`：图标所属图标集，参考 [Iconify 图标集 ID](https://icon-sets.iconify.design/)
- `图标名称`：图标在图标集中的名称

例如，使用自定义前缀 `Icon` 时：

```ts hl:20
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          // 限定启用指定图标集（可选）
          // 若启用多个图标集，可设置为 ['ep', 'mdi', 'tabler'] 等
          // 不指定时默认启用所有已安装图标集
          enabledCollections: ['ep'],
          // 自定义前缀，默认前缀为 'i'，可通过设置为 false | '' 来禁用前缀
          // 例如：默认情况下，图标组件名称为 <IEpAddLocation />
          // 例如：设置为 'Icon'，则图标组件名称将变为 <IconEpAddLocation />
          // 例如：设置为 false，则图标组件名称将变为 <EpAddLocation />
          prefix: 'Icon',
        }),
      ],
    }),
  ],
})
```

##### 禁用前缀

若希望组件名称更简洁，可将 `prefix` 显式设置为 `false` 或 `''`，但**建议配合 `enabledCollections` 限定图标集**，以避免与现有组件重名：

```ts
IconsResolver({
  prefix: false,
  enabledCollections: ['ep'], // 建议配合限制使用的图标集，避免命名冲突
})
```

> [!tip] 推荐实践
> 若通过将 `prefix` 显式设为 `false` 或者 `''` 来禁用前缀，请结合 `enabledCollections` 限定图标集范围，以避免与现有组件命名冲突。

#### 使用示例

```vue
<template>
  <i-ep-home />
  <i-mdi-account-box style="font-size: 2em; color: red" />
</template>
```
