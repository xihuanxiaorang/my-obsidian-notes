---
tags:
  - Frontend/Vue
  - Frontend/TypeScript
  - Project/后台管理系统
create_time: 2025-05-02 18:56
update_time: 2025/05/16 23:46
---

## 创建项目

前置要求：确保已安装『 [[Node.js]] 』和『 [[pnpm]] 』

> [!note] 兼容性提醒
> Vite 需配合 [[Node.js]] 18+ 或 20+ 使用。但部分模板可能依赖更高版本的 Node。若包管理器提示版本警告，请及时升级（本项目使用 v22.11.0）。

### 初始化项目

使用命令初始化 Vite 项目：

```bash
pnpm create vite
```

![](https://img.xiaorang.fun/202505022213197.png)

> [!tip] 一步创建带模板的项目
> 可附加参数指定项目名与模板，例如创建一个 Vue + TypeScript 项目：
> ```bash
> pnpm create vite vue3-admin --template vue-ts
> ```

### 安装依赖

进入项目目录后，运行：

```bash
pnpm install
```

![](https://img.xiaorang.fun/202505022213198.png)

### 启动开发服务器

启动本地开发环境：

```bash
pnpm dev
```

默认访问地址：[http://localhost:5173](http://localhost:5173)
![](https://img.xiaorang.fun/202505022239495.png)

> [!tip] 更改默认端口
> 如需更换端口，可在 `vite.config.ts` 中添加以下配置：
>
> ```ts
> server: {
>   port: 3000
> }
> ```

## 协作规范

### EditorConfig

[EditorConfig](https://EditorConfig.org) 可帮助统一多编辑器、多操作系统下的代码风格。只需在项目根目录添加 `.editorconfig` 文件，即可自动应用缩进、换行符、字符编码等设置。

```ini
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# 适用于所有文件类型
[*]
# 文件编码
charset = utf-8
# 缩进风格（tab | space）
indent_style = space
# 缩进大小
indent_size = 2
# 换行符（lf | cr | crlf）
end_of_line = lf
# 去除行尾多余空格
trim_trailing_whitespace = true
# 文件末尾插入空行
insert_final_newline = true
```

> [!tip]
> 某些编辑器需安装插件才能生效。例如 VSCode：推荐安装 [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)。

### ESLint

#### 为什么使用 ESLint？

- **发现错误**：在编码阶段提前捕捉潜在的语法和逻辑错误
- **统一风格**：避免代码风格不一致，提升团队协作效率
- **增强可读性**：格式一致、逻辑清晰的代码更易于维护
- **保障上线质量**：结合 CI/CD 流程自动检测问题，降低线上风险

#### 初始化

通过以下命令快速初始化 ESLint，参考官方文档：[Getting Started with ESLint](https://eslint.org/docs/latest/use/getting-started)：

```bash
npx eslint --init
# 或
pnpm create @eslint/config@latest
```

初始化过程会引导您选择项目类型（如 TypeScript + Vue）、规则风格、运行环境（浏览器 / Node.js）等。示意图如下所示：
![](https://img.xiaorang.fun/202505022310389.png)

#### VSCode 插件支持

推荐安装官方插件：[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)，以便在编辑器中实时高亮并提示语法问题：
![](https://img.xiaorang.fun/202505031321263.png)

#### 执行 ESLint 检查

建议在 `package.json` 中添加 `lint` 脚本，用于检查整个项目的代码规范与语法错误：

```json hl:3
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

> [!note]
> `eslint .` 中的 `.` 表示"从当前目录开始递归检查所有子目录下的文件"，常用于扫描整个项目。虽然该参数不是必须的，但**强烈建议显式指定路径**（如 `.` 或 `src`），否则在以下情况下可能出现**未检查任何文件**的问题：
> - "存在 `.eslintignore` 文件排除了默认路径；"
> - "使用 Flat Config 且未明确指定检查路径；"
> - "命令未传入任何目标文件或目录；"

执行命令：

```bash
pnpm lint
```

![](https://img.xiaorang.fun/202505031540863.png)

#### 支持自动修复

ESLint 提供 `--fix` 选项，可自动修复常见格式与语法问题（如缩进、分号、未使用变量等）。建议添加带自动修复功能的脚本命令：

```json hl:4
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

> [!tip]
> 可根据需要指定具体路径限制范围，例如：
>
> ```bash
> eslint src --fix 
> ```
>
> 上述命令将仅对 `src` 目录内的文件执行自动修复。

执行命令：

```bash
pnpm lint:fix
```

ESLint 会扫描符合规则的文件并尝试自动修复部分问题，提升代码一致性与可维护性。
![](https://img.xiaorang.fun/202505031648209.png)

#### 仅显示错误（忽略警告）

ESLint 默认输出所有等级的问题（`warn` 和 `error`）。如只需关注严重错误，可使用 `--quiet` 参数，它会忽略所有 `warn` 级别的提示，仅输出 `error` 级别的错误。
可在 `package.json` 中添加脚本：

```json hl:5
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:strict": "eslint . --quiet"
  }
}
```

执行命令：

```bash
pnpm lint:strict
```

该命令只会报告严重错误，不会显示格式建议等提示项。
![](https://img.xiaorang.fun/202505031659310.png)

#### 配置示例

```js file:eslint.config.js
import js from "@eslint/js"; // 官方 JS 推荐规则插件（包含基础语法校验）
import pluginVue from "eslint-plugin-vue"; // Vue 3 支持插件，提供适配 Vue 文件的规则集
import { defineConfig } from "eslint/config"; // 用于类型安全地定义 ESLint 配置（Flat 模式专用）
import globals from "globals"; // 浏览器 & Node 全局变量定义
import tseslint from "typescript-eslint"; // TypeScript ESLint 支持插件，含推荐规则与专用解析器

export default defineConfig([
  {
    // 通用规则：适用于 JS / TS / Vue 文件
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    // 启用官方 JS 插件
    plugins: { js },
    // 应用 JS 官方推荐规则集
    extends: ["js/recommended"],
  },
  {
    // 指定运行环境：支持浏览器和 Node.js 全局变量
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  // 应用 TypeScript 官方推荐配置（包括类型检查相关规则）
  tseslint.configs.recommended,
  // 应用 Vue 官方提供的基础规则（essential，可升级为 strongly-recommended 或 recommended）
  pluginVue.configs["flat/essential"],
  {
    // 为 Vue 文件单独指定 TS 解析器，支持 <script lang="ts"> 正确解析
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    // 定义忽略的文件路径（不参与 ESLint 检查）
    name: 'app/files-to-ignore',
    ignores: [
      // 忽略 node_modules 目录
      '**/node_modules/**',
      // 忽略打包输出目录
      '**/dist/**',
      // 忽略测试文件
      '**/__tests__/**',
      // 忽略样式文件
      '**/*.css',
      // 忽略类型声明文件
      '**/*.d.ts'
    ]
  },
  {
    // 自定义规则
    rules: {
      // 变量声明未使用则发出警告（可帮助清理无效代码）
      'no-unused-vars': 'warn',
      // 使用 console.log 等输出语句时发出警告（生产环境应避免）
      'no-console': 'warn',
      // 使用 debugger 时发出警告
      'no-debugger': 'warn',
      // 禁止使用 var，建议使用 let 或 const
      'no-var': 'error',
      // 强制使用 === 和 !==，禁止 == 和 !=（避免类型转换引发 bug）
      'eqeqeq': ['error', 'always'],
      // 强制函数要么总是有返回值，要么总是没有返回值，避免出现在某些分支有返回值、而另一些分支没有返回值的情况（提高代码可读性和稳定性）
      'consistent-return': 'warn',
      // 避免多余的分号
      'no-extra-semi': 'warn',
      // 属性顺序建议规范书写（增强一致性）
      'vue/attributes-order': 'warn',
      // 关闭 Vue HTML 缩进规则（交给 Prettier 等工具处理）
      'vue/html-indent': 'off'
    }
  }
]);
```

### Prettier

#### 为什么使用 Prettier？

[Prettier](https://prettier.io/) 是一个**代码格式化工具**，用于自动统一项目代码风格。它会在保存文件时自动处理缩进、引号、分号、换行等格式问题，适用于 JS、TS、Vue、JSON、Markdown 等多种类型文件，提升代码一致性和可维护性。

#### 安装 Prettier（兼容 ESLint）

为与 ESLint 协同工作，除了安装 Prettier 本体，还需额外安装两个插件：

```bash
pnpm install -D prettier eslint-plugin-prettier eslint-config-prettier
```

![](https://img.xiaorang.fun/202505032240348.png)

各依赖作用如下：

| 包名                       | 作用                                         |
| ------------------------ | ------------------------------------------ |
| `prettier`               | 核心格式化引擎                                    |
| `eslint-plugin-prettier` | 将 Prettier 的格式规则集成到 ESLint，让 ESLint 报告格式问题 |
| `eslint-config-prettier` | 关闭可能与 Prettier 冲突的 ESLint 规则，防止两者"互相打架"    |

#### 集成 Prettier 到 ESLint

在 `eslint.config.js` 中引入 Prettier 推荐配置，让格式规则作为 ESLint 的一部分执行：

```js file:eslint.config.js hl:6,48
import js from '@eslint/js' // 官方 JS 推荐规则插件（包含基础语法校验）
import pluginVue from 'eslint-plugin-vue' // Vue 3 支持插件，提供适配 Vue 文件的规则集
import { defineConfig } from 'eslint/config' // 用于类型安全地定义 ESLint 配置（Flat 模式专用）
import globals from 'globals' // 浏览器 & Node 全局变量定义
import tseslint from 'typescript-eslint' // TypeScript ESLint 支持插件，含推荐规则与专用解析器
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended' // Prettier 推荐规则集

export default defineConfig([
  {
    // 通用规则：适用于 JS / TS / Vue 文件
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    // 启用官方 JS 插件
    plugins: { js },
    // 应用 JS 官方推荐规则集
    extends: ['js/recommended'],
  },
  {
    // 指定运行环境：支持浏览器和 Node.js 全局变量
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  // 应用 TypeScript 官方推荐配置（包括类型检查相关规则）
  tseslint.configs.recommended,
  // 应用 Vue 官方提供的基础规则（essential，可升级为 strongly-recommended 或 recommended）
  pluginVue.configs['flat/essential'],
  {
    // 为 Vue 文件单独指定 TS 解析器，支持 <script lang="ts"> 正确解析
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    // 定义忽略的文件路径（不参与 ESLint 检查）
    name: 'app/files-to-ignore',
    ignores: [
      // 忽略 node_modules 目录
      '**/node_modules/**',
      // 忽略打包输出目录
      '**/dist/**',
      // 忽略测试文件
      '**/__tests__/**',
      // 忽略样式文件
      '**/*.css',
      // 忽略类型声明文件
      '**/*.d.ts',
    ],
  },
  // 引入 Prettier 推荐配置（关闭 ESLint 格式冲突规则 + 启用 prettier 检查）
  eslintPluginPrettierRecommended,
  {
    // 自定义规则
    rules: {
      // 变量声明未使用则发出警告（可帮助清理无效代码）
      'no-unused-vars': 'warn',
      // 使用 console.log 等输出语句时发出警告（生产环境应避免）
      'no-console': 'warn',
      // 使用 debugger 时发出警告
      'no-debugger': 'warn',
      // 禁止使用 var，建议使用 let 或 const
      'no-var': 'error',
      // 强制使用 === 和 !==，禁止 == 和 !=（避免类型转换引发 bug）
      eqeqeq: ['error', 'always'],
      // 强制函数要么总是有返回值，要么总是没有返回值，避免出现在某些分支有返回值、而另一些分支没有返回值的情况（提高代码可读性和稳定性）
      'consistent-return': 'warn',
      // 避免多余的分号
      'no-extra-semi': 'warn',
      // 属性顺序建议规范书写（增强一致性）
      'vue/attributes-order': 'warn',
      // 关闭 Vue HTML 缩进规则（交给 Prettier 等工具处理）
      'vue/html-indent': 'off',
    },
  },
])
```

#### 配置示例

```js file:prettier.config.js
export default {
  // 每行最大字符数，超过将自动换行
  printWidth: 100,
  // 一个缩进级别所用的空格数
  tabWidth: 2,
  // 是否使用制表符（tab）缩进，false 表示使用空格
  useTabs: false,
  // 是否在语句末尾添加分号
  semi: false,
  // 否使用单引号替代双引号
  singleQuote: true,
  //对象属性名是否加引号：as-needed（仅在需要时）丨consistent（统一全部加）丨preserve（保留输入）
  quoteProps: 'as-needed',
  //多行对象或数组的末尾是否添加逗号：none（不添加）丨es5（ES5支持的地方加）丨all（全部加）
  trailingComma: 'all',
  // 对象大括号内是否保留空格，例如：{ foo：bar }
  bracketSpacing: true,
  //箭头函数参数是否总是带括号（如：（x）=x）
  arrowParens: 'always',
  //指定换行符：Lf（\n）丨crLf（\r\n）丨cr（\r）丨auto（自动检测)
  endOfLine: 'auto',
}
```

> [!important]
> 修改配置后请务必**重启 VSCode**，否则可能仍使用旧的格式规则。

#### VSCode 插件支持

推荐安装官方插件：[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)，可在编辑器中实时高亮格式问题：
![](https://img.xiaorang.fun/202505041325239.png)

在 VSCode 设置中，建议：
- 设置 Prettier 为默认格式化程序
- 启用保存时自动格式化

![](https://img.xiaorang.fun/202505041325241.png)

#### 配置格式化脚本

建议在 `package.json` 中添加以下脚本，用于统一代码风格管理：

```json hl:3-4
{
  "scripts": {
    "format": "prettier --write .", // 一键格式化项目中所有文件
    "format:check": "prettier --check ." // 检查文件格式是否符合 Prettier 规范
  }
}
```

使用说明：

- **格式化项目代码（自动修复）**

	```bash
	pnpm format
	```

- **仅进行格式检查（不修改文件）**

	```bash
	pnpm format:check
	```

#### 配置 Prettier 忽略文件（避免无效格式化）

在项目根目录新建 `.prettierignore` 文件，用于指定 **不需要被 Prettier 格式化的文件或目录**，避免格式化无效或无关内容（如依赖锁文件、打包产物等）。

```ini
# 忽略依赖锁文件
pnpm-lock.yaml

# 忽略打包输出目录
dist

# 忽略构建配置和临时缓存
node_modules
.cache
```

这样可避免提交时无意义的格式化变更，保持 Git 提交历史整洁。

### Husky

仅依赖 ESLint 和 Prettier 时，开发者需手动在提交前运行格式化和检查命令，容易遗漏或执行不一致。为实现自动化，可以借助 Git 的 Hook 机制，在代码提交前自动触发校验逻辑。

[Husky](https://typicode.github.io/husky/) 是一款 Git Hook 管理工具，可帮助统一配置并在团队中共享。

#### 安装与初始化

1. 安装 Husky

	```bash
	pnpm add -D husky
	```

2. 初始化 Husky，它会在 `.husky/` 目录下创建初始配置，并在 `package.json` 中添加 `prepare` 脚本（用于自动启用 hook）：

	```bash
	npx husky init
	```

![](https://img.xiaorang.fun/202505042128630.png)

#### 配置 `pre-commit` 钩子自动执行 ESLint

为了在每次提交代码前自动执行 ESLint 对代码进行质量检查，可将 `.husky/pre-commit` 钩子文件内容修改为：

```sh 
npm run lint
```

配置完成后，在每次提交代码时，Git 会自动触发 ESLint 检查代码质量。如果存在不符合规范的代码（例如格式混乱的 `App.vue` 文件），提交将被中断，并在终端会输出详细的错误信息。
![](https://img.xiaorang.fun/202505042225873.png)

### lint-staged

随着项目代码量的不断增长，若每次提交都对全量文件执行 ESLint 和 Prettier，势必会带来显著的性能开销。为提升提交效率，我们可以借助 [lint-staged](https://github.com/okonet/lint-staged)，仅对 **实际发生变更的文件（即暂存区中的文件）** 进行格式化和检查，从而实现更高效的代码校验流程。

#### 安装

```bash
pnpm add -D lint-staged
```

#### 配置 `package.json`

在 `package.json` 中添加 lint-staged 配置，如下所示：

```json hl:2-8
{
  "lint-staged": {
    "src/**/*.{js,cjs,ts,vue}": [
      "npm run lint:fix"
    ],
    "src/**/*.{html,json,css,scss}": [
      "npm run format"
    ]
  }
}
```

#### 配置 Husky 的 `pre-commit` 钩子

修改 `.husky/pre-commit` 文件，确保变更文件在提交前触发 lint-staged：

```sh
npx lint-staged
```

---

借助 lint-staged，配合 Husky 的 `pre-commit` 钩子，我们可以在每次提交前自动对实际变更的文件执行 ESLint 检查和 Prettier 格式化。这样不仅能避免对全量代码进行低效检查，还能保持良好的提交性能与统一的代码风格，提升团队协作体验。
![](https://img.xiaorang.fun/202505042304524.png)

### commitlint

[**Commitlint**](https://commitlint.js.org/#/) 是一款用于校验 Git 提交信息是否符合约定格式（如 [Conventional Commits](https://www.conventionalcommits.org/)）的工具。它常与 Husky 搭配使用，在提交阶段自动校验提交信息，从而规范项目提交历史，提升协作一致性。

| 类型         | 说明                                         |
| ---------- | ------------------------------------------ |
| `feat`     | 新增功能                                       |
| `fix`      | 修复 Bug                                     |
| `docs`     | 仅文档相关的变更                                   |
| `style`    | 不影响代码含义的修改（如空格、缩进、格式、缺少分号等）                |
| `refactor` | 重构代码（非功能性修改，且不涉及修复 Bug）                    |
| `perf`     | 性能优化相关的代码变更                                |
| `test`     | 添加或更新测试相关的代码                               |
| `build`    | 构建相关的修改（如构建脚本、工具配置：gulp、webpack、rollup 等）  |
| `revert`   | 回退某次提交                                     |
| `chore`    | 其他不属于上述类型的杂项变更（如 CI 流程配置：Travis、Jenkins 等） |

#### 安装

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

#### 添加配置文件 `commitlint.config.js`

```bash
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

#### 配置 Husky 的 `commit-msg` 钩子

为在提交阶段自动校验提交信息格式，可通过以下命令创建 `.husky/commit-msg` 文件并添加校验逻辑：

```bash
# 创建 commit-msg 钩子并写入 commitlint 校验命令（注意转义）
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

> [!warning]
>
> 若在 Windows 终端执行，请使用反引号转义 `$1`：
>
> ```bash
> echo "npx --no -- commitlint --edit `$1" > .husky/commit-msg
> ```

最终生成的 `.husky/commit-msg` 文件内容如下：

```sh
npx --no -- commitlint --edit $1
```

#### 提交测试

如提交信息不符合规范（例如 `foo: this will fail`），commitlint 会阻止提交，并输出提示：

![](https://img.xiaorang.fun/202505051222400.png)

### commitzen

[**Commitizen**](https://github.com/commitizen/cz-cli) 是一个命令行工具，可引导开发者按规范格式（如 [Conventional Commits](https://www.conventionalcommits.org/)）撰写 Git 提交信息，避免提交格式不一致或遗漏类型字段。通常配合适配器（如 [**cz-conventional-changelog**](https://github.com/commitizen/cz-conventional-changelog) 等）一起使用。

#### 为什么使用 Commitizen？

- **交互式输入**，降低使用门槛
- **统一提交格式**，配合 Commitlint 实现自动校验
- **自动生成变更日志**，如配合 [standard-version](https://github.com/conventional-changelog/standard-version)

#### 安装

```bash
pnpm add -D commitizen cz-conventional-changelog
```

#### 配置 `package.json`

在 `package.json` 中添加 `config.commitizen` 字段：

```json hl:2-6
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

这样在执行 `npx cz` 或 `pnpm cz` 命令时，Commitizen 会调用 `cz-conventional-changelog` 适配器，引导生成规范化的提交信息。

#### 使用演示

![](https://img.xiaorang.fun/202505051807859.png)

## 准备工作

### 路径别名配置

> [!quote]
> [resolve.alias \| 共享选项 \| Vite 官方中文文档](https://cn.vitejs.dev/config/shared-options.html#resolve-alias)

在 [Vite](https://cn.vitejs.dev/) 项目中配置路径别名（如 `@` 指向 `src` 目录）可有效避免模块导入路径过长、层级混乱等问题，提升项目的可读性和开发效率。

以下是配置 `@` 指向 `src` 的具体步骤：

1. 配置 `vite.config.ts`

	```ts hl:3,8-12
	import { defineConfig } from 'vite'
	import vue from '@vitejs/plugin-vue'
	import { fileURLToPath, URL } from 'node:url'
	
	// https://vite.dev/config/
	export default defineConfig({
	  plugins: [vue()],
	  resolve: {
	    alias: {
	      '@': fileURLToPath(new URL('./src', import.meta.url)),
	    },
	  },
	})
	```

2. 配置 `tsconfig.json`

	```json hl:2-7
	{
	  "compilerOptions": {
	    "baseUrl": ".",
	    "paths": {
	      "@/*": ["src/*"]
	    }
	  }
	}
	```

> [!note]
> 修改后请重启 VSCode，以确保路径别名生效。

### CSS 预处理器

> [!quote]
> [CSS 预处理器 \| 功能 \| Vite 官方中文文档](https://vitejs.cn/vite3-cn/guide/features.html#css-pre-processors)

由于 Vite 的目标仅为现代浏览器，因此建议使用原生 CSS 变量和实现 CSSWG 草案的 PostCSS 插件（例如 [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)）来编写简单的、符合未来标准的 CSS。

话虽如此，但 Vite 也同时提供了对 `.scss`, `.sass`, `.less`, `.styl` 和 `.stylus` 文件的内置支持。没有必要为它们安装特定的 Vite 插件，但必须安装相应的预处理器依赖：

```bash hl:2
# .scss and .sass
pnpm add -D sass-embedded # 或 sass

# .less
pnpm add -D less

# .styl and .stylus
pnpm add -D stylus
```

如果使用的是**单文件组件，可以通过 `<style lang="scss">`（或其他预处理器）自动开启**。

Vite 为 [Sass](https://github.com/sass) 和 [Less](https://github.com/less) 改进了 `@import` 解析，以保证 Vite 别名也能被使用。另外，`url()` 中的相对路径引用的，与根文件不同目录中的 Sass/Less 文件会自动变基以保证正确性。

由于 [Stylus](https://github.com/stylus) API 限制，`@import` 别名和 URL 变基不支持 Stylus。

您还可以通过在文件扩展名前加上 `.module` 来结合使用 CSS modules 和预处理器，例如 `style.module.scss`。

### ElementPlus 集成

> [!quote]
> [一个 Vue3 UI 框架 \| Element Plus](https://element-plus.org/zh-CN/)

#### 安装

```bash
pnpm install element-plus
```

> [!note] 兼容性
> 在 `2.8.5` 及以后的版本, [Sass](https://github.com/sass) 的最低支持版本为 `1.79.0`.
> 若终端提示 `legacy JS API Deprecation Warning` 警告, 您可以在 `vite.config.ts` 文件中添加 [css.preprocessorOptions](https://cn.vite.dev/config/shared-options#css-preprocessoroptions) 的配置，指定使用新版 API：
>
> ```ts hl:1-5
> css: {
>      preprocessorOptions: {
>        scss: { api: 'modern-compiler' },
>      }
> }
> ```

#### 用法

##### 完整引入

如果您对打包后的文件大小不是很在乎，那么使用完整导入会更方便。

```ts file:main.ts hl:6-7,13
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(ElementPlus)

app.mount('#app')
```

###### Volar 支持

如果您使用 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)，请在 `tsconfig.json` 中通过 `compilerOptions.type` 指定全局组件类型。

```json hl:4
{
  "compilerOptions": {
    // ...
    "types": ["element-plus/global"]
  }
}
```

##### 按需导入（推荐）

###### 安装插件

首先您需要安装 [[#unplugin-vue-components]] 和 [[#unplugin-auto-import]] 这两款插件：

```bash
pnpm install -D unplugin-vue-components unplugin-auto-import
```

###### 配置 `vite.config.ts`

```ts hl:2-4,9-34
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      // 自动导入 VueRouter 相关函数，如：useRouter 等
      // 自动导入 Pinia 相关函数，如：createPinia，defineStore，storeToRefs 等
      // 参考自： https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      imports: ['vue', 'vue-router', 'pinia'],
      // 自定义解析器
      resolvers: [
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        ElementPlusResolver(),
      ],
      // 指定哪些目录下的文件需要被扫描，并自动导入这些文件中导出的函数、变量等
      dirs: ['src/composables/**'],
      // 指定生成的类型声明文件路径
      dts: 'src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        // 自动注册 Element Plus 组件
        ElementPlusResolver(),
      ],
      // 指定自定义组件位置
      dirs: ['src/**/components'],
	  // 指定生成的类型声明文件路径
      dts: 'src/types/components.d.ts',
    }),
  ],
})

```

###### 解决 ESLint 报错

![[#报错信息]]

![[#方案一：直接禁用 `no-undef` 规则（推荐）]]

###### TypeScript 类型支持

为了获得完善的类型提示与自动补全，`unplugin-auto-import` 与 `unplugin-vue-components` 会自动生成 `auto-imports.d.ts` 和 `components.d.ts` 类型声明文件。

无需手动将这两个 `.d.ts` 文件显式添加至 `tsconfig.app.json` 的 `include` 中。因为：
- `"src/**/*.ts"` 会自动匹配 `src` 目录下所有的 `.ts` 和 `.d.ts` 文件；
- 自动生成的声明文件位于 `src/types/`，已包含在该范围内。

因此，保留默认配置即可，无需额外处理。

```ts file:tsconfig.app.json hl:17
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

### UnoCSS 集成

> [!quote]
> [重新构想原子化 CSS (antfu.me)](https://antfu.me/posts/reimagine-atomic-css-zh)

[**UnoCSS**](https://unocss.dev/) 是一个极简、性能极致的原子化 CSS 引擎，灵感来自 [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) 和 [Windi CSS](https://github.com/windicss/windicss)。它通过"按需生成（on-demand generation）"策略，仅构建页面中实际用到的样式，极大地减少了最终 CSS 的体积，并提供高度的可定制性和灵活的扩展机制。

- **极速构建**：真正的按需生成，无需构建完整的样式文件，首次构建和热更新速度极快。
- **原子化设计**：类名即功能，组合灵活，避免冗余类定义。
- **高度可配置**：可配置规则、预设、变体、主题等，支持完全自定义语法和行为。
- **多模式支持**：支持 class 模式（类名写法）、Attributify 模式（属性写法），甚至组合使用。
- **插件生态丰富**：提供丰富的官方预设（presets），并支持自定义插件机制。
- **极致体积优化**：生成的 CSS 体积极小，适合任何需要优化首屏加载的现代 Web 应用。
- **框架无关**：可用于 Vue、React、Svelte、Solid、原生 HTML 等各种技术栈中。

#### VSCode 插件支持

推荐安装官方插件：[UnoCSS](https://marketplace.visualstudio.com/items/?itemName=antfu.unocss)，可在编辑器中实时高亮类名、预览样式，并提示语法错误：
![](https://img.xiaorang.fun/202505072353096.png)

#### 集成

##### 在 Vite 中集成 UnoCSS

> [!quote]
> [UnoCSS Vite Plugin](https://unocss.dev/integrations/vite)

###### 安装

```bash
pnpm add -D unocss
```

###### 配置 `vite.config.ts`

```ts hl:3,7
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
})
```

###### 创建 UnoCSS 配置文件 `uno.config.ts`

```ts hl:1-5
import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
})
```

###### 引入 UnoCSS 样式

```ts file:main.ts
import 'virtual:uno.css'
```

##### 在 ESLint 中集成 UnoCSS

为统一原子类和 Attributify 属性的书写顺序，避免样式混乱，UnoCSS 提供了官方 ESLint 插件，推荐在 Flat 配置模式中使用。

###### 安装

```bash
pnpm add -D @unocss/eslint-config
```

###### 配置 `eslint.config.js`

```js hl:2,6
import { defineConfig } from 'eslint/config' // 用于类型安全地定义 ESLint 配置（Flat 模式专用）
import unocss from '@unocss/eslint-config/flat' // UnoCSS 官方 ESLint Flat 模式规则集（包含原子类顺序和 attributify 属性顺序校验等）

export default defineConfig([
  // 引入 UnoCSS ESLint 插件（默认启用 order/order-attributify）
  unocss,
])
```

###### 规则说明

UnoCSS ESLint 插件内置以下规则，用于规范 class 和属性的书写顺序、屏蔽高风险原子类、并确保样式合法性，从而提升代码可维护性：

| 规则名                             | 功能描述                                         | 默认状态    |
| ------------------------------- | -------------------------------------------- | ------- |
| `@unocss/order`                 | 强制 class 原子类的排列顺序，避免混乱                       | ✅ 已启用   |
| `@unocss/order-attributify`     | 强制 Attributify 模式下属性的排列顺序，增强可读性              | ✅ 已启用   |
| `@unocss/blocklist`             | 禁止使用指定的 class 原子类（如 `fixed`、`hidden` 等高风险样式） | ⛔ 需手动启用 |
| `@unocss/enforce-class-compile` | 强制所有 class 必须可被 UnoCSS 正确解析，避免拼写错误或无效类名滥用    | ⛔ 需手动启用 |

例如启用额外规则：

```js
{
  rules: {
    '@unocss/blocklist': ['error', ['fixed', 'hidden']],
    '@unocss/enforce-class-compile': 'warn',
  },
}
```

###### 示例演示

✅ **推荐写法**

```html
<div class="mt-10 h-[100px] w-[100px] bg-red font-600" text-white font-600>小橘猫</div>
```

❌ **错误写法**：

```html
<div class="h-[100px] mt-10 w-[100px] bg-red font-600" font-600 text-white>小橘猫</div>
```

- `mt-10` 应排在 `h-[100px]` 前，违反 `@unocss/order` 规则
- `text-white` 应排在 `font-600` 前，违反 `@unocss/order-attributify` 规则

这些问题将由 UnoCSS ESLint 插件自动提示，帮助开发者及时调整原子类与属性顺序，确保代码一致性与可读性：
![](https://img.xiaorang.fun/202505081226786.png)

#### 预设 (Presets)

UnoCSS 提供多种功能强大的预设（如 `@unocss/preset-uno`、`@unocss/preset-wind3`、`@unocss/preset-attributify`），可灵活组合以满足不同项目需求。

##### Uno 预设 (默认 & 已废弃)

`@unocss/preset-uno` 是 UnoCSS 官方早期**默认的核心预设**，提供类似 Tailwind CSS 的原子类体系，支持数千个常用工具类，覆盖尺寸、颜色、布局、状态、响应式等场景：
- **尺寸类**：`w-100`、`h-full`、`min-w-screen`
- **颜色类**：`text-red-500`、`bg-gray-100`
- **布局类**：`flex`、`grid`、`items-center`
- **状态类**：`hover: bg-blue-400`、`dark: text-white`
- **响应式类**：`md: px-4`、`lg: text-xl`

它是 UnoCSS 的重要构建块，开箱即用，适合追求快速开发和简洁 CSS 的项目。

> [!warning]
> `@unocss/preset-uno` **已被标记为废弃（deprecated）**，官方推荐改用功能更强、结构更现代的 [`@unocss/preset-wind3`](https://unocss.dev/presets/wind3)。
> 但它仍在 `unocss` 主包中内置，旧项目仍可兼容使用。

###### 安装 (可选)

```bash
pnpm add -D @unocss/preset-uno
```

> [!tip]
> 该预设已内置于 `unocss` 包中，通常无需单独安装，直接导入即可：
>
> ```ts
> import { presetUno } from 'unocss'
> ```

###### 配置 `uno.config.ts` (可选)

```ts hl:1,4
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
})
```

> [!tip] 默认行为
> UnoCSS 默认启用该预设，只有在**自定义预设组合**或**覆盖默认行为**时才需要显式添加。

##### Wind3 预设 (推荐)

`@unocss/preset-wind3` 是 UnoCSS 官方推荐的新一代预设，旨在替代早期的 `preset-uno`。它兼容大多数 Tailwind CSS 工具类，默认风格更现代，结构更清晰，适用于追求灵活性和语义化的项目开发。

- ✅ 类似 Tailwind 的语法兼容性
- ✅ 内置更现代的设计趋势（如 `container` 自动居中等）
- ✅ 推荐与 `preset-attributify` 搭配使用以启用属性写法

###### 安装 (可选)

```bash
pnpm add -D @unocss/preset-wind3
```

> [!tip]
> 该预设已内置于 `unocss` 包中，通常无需单独安装，直接导入即可：
>
> ```ts
> import { presetWind3 } from 'unocss'
> ```

###### 配置 `uno.config.ts`

```ts hl:1,4
import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
})
```

##### Attributify 预设 (属性化写法支持)

`@unocss/preset-attributify` 预设允许以 HTML 属性的方式书写原子类，结构更清晰、语义更直观，特别适合组件化开发与动态样式绑定。

###### 安装 (可选)

```bash
pnpm add -D @unocss/preset-attributify
```

> [!tip]
> 该预设已内置于 `unocss` 包中，通常无需单独安装，直接导入即可：
>
> ```ts
> import { presetAttributify } from 'unocss'
> ```

###### 配置 `uno.config.ts`

```ts hl:1,4
import { defineConfig, presetWind3, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [presetWind3(), presetAttributify()],
})
```

###### 示例对比

传统写法中，样式类集中堆叠在 `class` 属性中，既冗长又不易维护：

```html
<button class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600">
  Button
</button>
```

借助 **Attributify 模式**，您可以将原子类拆分成具备语义的属性：

```html
<button
  bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
  text="sm white"
  font="mono light"
  p="y-2 x-4"
  border="2 rounded blue-200"
>
  Button
</button>
```

例如 `text-sm text-white` 合并为 `text="sm white"`，减少重复前缀，代码更简洁。

> [!tip]
> 除组合属性写法外，Attributify 也支持将每个原子类直接写作属性名，无需使用 `class=""`：
>
> ```html
> <div h-100px w-100px flex items-center justify-center bg-red-300 text-sm text-white font-600 font-mono border-3 border-red rounded-2xl border-dashed>
>   小橘猫
> </div>
> ```

#### 转换器 (Transformers)

UnoCSS 提供多种转换器，可增强原子类在真实工程中的表达力与灵活性。

##### 指令转换器

`@unocss/transformer-directives` 是一个**指令式语法转换器**，支持在 CSS 或 `<style>` 标签中使用类似 Tailwind 的 `@apply`、`@screen`、`theme ()` 等指令，极大提升了样式编写的直观性与复用性。

###### 安装 (可选)

```bash
pnpm add -D @unocss/transformer-directives
```

> [!tip]
> 该预设已内置于 `unocss` 包中，通常无需单独安装，直接导入即可：
>
> ```ts
> import { transformerDirectives } from 'unocss'
> ```

###### 配置 `uno.config.ts`

```ts hl:1,5
import { defineConfig, presetWind3, presetAttributify, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetWind3(), presetAttributify()],
  transformers: [transformerDirectives()],
})
```

###### 使用示例

```css hl:1-3
.box {
  @apply px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white;
}
```

通过 `@apply` 指令，可以将多个原子类组合应用于一个选择器，提升样式的复用性和可读性。

### SCSS 全局变量

> [!quote]
> [css. preprocessorOptions[extension]. additionalData \| 共享选项 \| Vite 官方中文文档](https://cn.vite.dev/config/shared-options.html#css-preprocessoroptions)

该选项允许为每个样式文件中自动注入 SCSS 变量、函数或混入等内容。

> [!note]
> 若注入的是实际样式内容而非变量，可能会在构建产物中**重复出现**，应避免。

> [!info]- 前置知识
> [[#SCSS 模块引入方式]] & [[#SCSS 与 CSS 变量]]

#### 创建全局变量文件 `variables.scss`

```scss hl:1-3
$sidebarWidth: 210px;
$navbarHeight: 50px;
$tagsViewHeight: 34px;
```

#### 配置 Vite 自动注入变量

```ts hl:5-12
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 自动注入变量，无需在每个文件中单独引入
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
})
```

#### 生成 CSS 原生变量

```scss file:src/styles/index.scss hl:1-5
:root {
  --sidebar-width: #{$sidebarWidth};
  --navbar-height: #{$navbarHeight};
  --tags-view-height: #{$tagsViewHeight};
}
```

并在入口文件 `main.ts` 引入该文件：

```ts
import '@/styles/index.scss'
```

#### 在组件中使用 CSS 变量

```vue hl:20,26,29,33
<template>
<div class="app-wrapper">
  <div class="sidebar-container">侧边导航栏</div>
  <div class="main-wrapper">
    <div class="header-container">
      <div class="navbar">顶部导航栏</div>
      <div class="tags-view">标签导航栏</div>
  </div>
    <div class="content-container">
      <router-view></router-view>
  </div>
  </div>
  </div>
</template>

<style lang="scss" scoped>
  .app-wrapper {
    @apply flex w-screen h-screen;
    .sidebar-container {
      @apply w-[var(--sidebar-width)] bg-red-300;
    }
    .main-wrapper {
      @apply flex flex-col flex-1;
      .header-container {
        .navbar {
          @apply h-[var(--navbar-height)] bg-yellow-300;
        }
        .tags-view {
          @apply h-[var(--tags-view-height)] bg-blue-300;
        }
      }
      .content-container {
        @apply h-[calc(100vh-var(--navbar-height)-var(--tags-view-height))] bg-gray-100;
      }
    }
  }
</style>
```

---

以上方案是目前 **在使用 Vite + SCSS + UnoCSS 项目中管理全局样式变量的最佳实践之一**，具有以下几个关键优势：

| 方面         | 优势说明                                           |
| ---------- | ---------------------------------------------- |
| **自动注入变量** | 使用 `vite.config.ts` 配置 `additionalData`，避免重复引入 |
| **模块化引入**  | 使用 `@use` 代替旧式 `@import`，防止全局污染和重复编译           |
| **原生变量输出** | SCSS 编译期变量转换为 CSS 运行时变量，兼容 JS、HTML、UnoCSS 等环境  |
| **动态响应能力** | 可通过 JavaScript 修改 CSS 变量值，支持响应式布局、主题切换等场景      |
| **原子类兼容性** | UnoCSS 支持 `w-[var (--xxx)]` 形式，完美结合动态样式         |
| **样式分离清晰** | 样式、变量、逻辑职责明确，便于维护和多人协作开发                       |

> [!warning] 注意事项
> - 不建议在 `additionalData` 中注入样式内容（如 class 等），否则会导致**重复渲染和样式污染**。
> - CSS 原生变量建议写在 `:root` 或页面级容器中，确保作用域清晰。
> - **UnoCSS 不支持 SCSS 编译期变量**（如 `$xx`），必须转为 `var (--xx)` 后配合原子类使用。

### Normalize.css 集成

[**Normalize.css**](https://necolas.github.io/normalize.css/) 是一种现代 CSS 重置方案，旨在统一不同浏览器对 HTML 元素的默认样式渲染，并符合当代标准。

相较于传统的 CSS Reset，Normalize.css 具有以下优势：

- **保留有价值的默认样式**：不会盲目清除所有浏览器默认样式，避免重复定义基础样式。
- **统一不同浏览器的表现**：对多种 HTML 元素进行规范化，确保跨浏览器的一致性。
- **修复已知兼容性问题**：解决浏览器间已知的样式 bug 和不一致行为。
- **微调提升可用性**：对部分元素进行细致优化，改善用户体验。
- **代码注释详尽**：内含丰富注释，便于理解每项规范的目的。

引入 Normalize.css 可为项目建立一致、可靠的样式基础，减少浏览器差异带来的问题，提升开发效率。

#### 安装

```bash
pnpm install normalize.css
```

#### 引入

```scss file:src/styles/index.scss
@use 'normalize.css/normalize.css';
```

### 图标集成方案

#### iconify 图标库集成

借助 [[#unplugin-icons]] 配合 [[#unplugin-auto-import]] 与 [[#unplugin-vue-components]] 插件，可实现 [Iconify](https://iconify.design/) 图标的自动导入与组件注册。

##### 安装插件

```bash
pnpm install -D unplugin-icons unplugin-auto-import unplugin-vue-components
```

##### 配置 `vite.config.ts`

实现 ElementPlus 图标的自动按需导入与组件自动注册，您可以参考[此模板](https://github.com/sxzz/element-plus-best-practices/blob/db2dfc983ccda5570033a0ac608a1bd9d9a7f658/vite.config.ts#L21-L58)。

```ts hl:4-5,14,20-30,33-36
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      // 自定义解析器
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
          // 自定义前缀，默认前缀为 'i'，可通过设置为 false | '' 来禁用前缀
          // 例如：默认情况下，图标组件名称为 <IEpAddLocation />
          // 例如：设置为 'Icon'，则图标组件名称将变为 <IconEpAddLocation />
          // 例如：设置为 false，则图标组件名称将变为 <EpAddLocation />
          // prefix: 'Icon',
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

##### 使用示例

```vue
<template>
  <div class="mb-4">
    <IEpAddLocation />
    <IEpMapLocation h-48px w-48px text-red />
    <IEpSetting text-5xl text-cyan />
  </div>
</template>
```

#### 本地 SVG 图标集成

对于需要集成本地自定义图标的团队（如配合设计师工作），推荐使用 [vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons) 插件，实现本地 SVG 图标的高效加载与统一管理。

##### 安装插件

```bash
pnpm install -D vite-plugin-svg-icons
```

##### 配置 `vite.config.ts`

```ts hl:2-3,8-17
import { defineConfig } from 'vite'
import path from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      // 指定图标文件目录
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 定义生成的 symbol ID 格式：默认值为 icon-[dir]-[name]
      // - [prefix] 表示图标前缀
      // - [dir] 表示图标所在子目录名称
      // - [name] 表示图标文件名
      // 最终生成的 ID 形如：icon-user 或 icon-folder-user
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
})
```

###### 插件选项说明

| 参数            | 类型                       | 默认值                   | 说明                                                    |
| ------------- | ------------------------ | --------------------- | ----------------------------------------------------- |
| `iconDirs`    | `string[]`               | -                     | 指定 SVG 图标所在目录，支持递归收集所有 SVG 文件                         |
| `symbolId`    | `string`                 | `icon-[dir]-[name]`   | 生成图标的 symbol ID 格式，支持占位符 `[dir]`（目录）和 `[name]`（文件名）   |
| `svgoOptions` | `boolean \| SvgoOptions` | `true`                | svg 压缩配置，可以是对象 [SVGO 配置](https://github.com/svg/svgo) |
| `inject`      | `string`                 | `body-last`           | 指定 svgDom 的插入位置：`body-first` 或 `body-last`            |
| `customDomId` | `string`                 | `__svg__icons__dom__` | svgDom 插入节点的 ID                                       |

symbolId 命名规则：`icon-[dir]-[name]`
- `[dir]`：子目录名称（用于区分不同文件夹下的同名图标）
- `[name]`：SVG 文件名

```
src/assets/icons
├── icon1.svg              → icon-icon1
├── icon2.svg              → icon-icon2
├── icon3.svg              → icon-icon3
├── dir/
│   └── icon1.svg          → icon-dir-icon1
└── dir/dir2/
    └── icon1.svg          → icon-dir-dir2-icon1
```

##### 声明虚拟模块

> [!note]
> **必须执行此步骤**，否则在 `main.ts` 中引入 `virtual: svg-icons-register` 时会报错：找不到模块 `"virtual: svg-icons-register"` 或其相应类型声明。
> 详见：[vite-plugin-svg-icons#116](https://github.com/vbenjs/vite-plugin-svg-icons/issues/116)

> [!info]
> 以下内容参考自 `node_modules/vite-plugin-svg-icons/client.d.ts` 类型声明文件，手动添加至项目以通过类型检查。

```ts file:vite-env.d.ts hl:3-15
/// <reference types="vite/client" />

// 声明 vite-plugin-svg-icons 提供的虚拟模块：用于自动注册 SVG 图标
declare module 'virtual:svg-icons-register' {
  // eslint-disable-next-line
  const component: any
  export default component
}

// 声明图标名称数组模块：返回所有已注册的图标名称，适用于图标选择器、预览等功能
declare module 'virtual:svg-icons-names' {
  // eslint-disable-next-line
  const iconsNames: string[]
  export default iconsNames
}
```

- `/// <reference types="vite/client" />`
	- 引入 Vite 的客户端类型声明，支持如 `import.meta.env` 等特性，是 Vite 项目的标准配置。
- `declare module 'virtual: svg-icons-register'`
    - 声明该虚拟模块用于自动将所有 SVG 图标注册为 `<symbol>` 注入到页面 `<body>` 中，使 `<use xlink:href="#icon-name" />` 生效。
    - 使用方式见：[[#引入注册脚本]]
- `declare module 'virtual: svg-icons-names'`
	- 声明图标名称数组模块，导出一个 `string[]` 类型数组，包含所有已收集 SVG 图标的完整 ID（如 `icon-user`, `icon-folder-file`）。
	- 适用于构建图标选择器、图标预览面板等场景。
	- 使用示例：

		```ts
		import iconNames from 'virtual:svg-icons-names'
		
		iconNames.forEach(name => {
		  console.log(name) // 输出 icon-user、icon-home 等
		})
		```

##### 引入注册脚本

在项目入口文件 `main. ts` 中引入：

```ts
import 'virtual:svg-icons-register'
```

##### 封装 SVG 图标组件

为统一使用方式，建议封装一个通用 SVG 图标组件。

```vue
<template>
  <svg class="svg-icon" v-bind="$attrs" aria-hidden="true">
    <use :xlink:href="`#${symbolId}`" />
  </svg>
</template>

<script setup lang="ts">
const { prefix = 'icon', iconName } = defineProps<{
  prefix?: string
  iconName: string
}>()

const symbolId = computed(() => (iconName.startsWith(prefix) ? iconName : `${prefix}-${iconName}`))
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
  outline: none;
  overflow: hidden;
  fill: currentColor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
}
</style>
```

##### 使用示例

```vue
<template>
  <svg-icon
    v-for="iconName in iconNames"
    :key="iconName"
    :icon-name="iconName"
    text-5xl
    text-purple
  ></svg-icon>
</template>

<script setup lang="ts">
import iconNames from 'virtual:svg-icons-names'
</script>
```

### VueUse 集成

[VueUse](https://vueuse.org/) 是一组基于 Vue Composition API 的实用工具函数集合。在继续使用前，请确保你已掌握 [Composition API](https://cn.vuejs.org/guide/extras/composition-api-faq) 的基本概念。

#### 安装

```bash
pnpm install @vueuse/core
```

#### 配置自动导入

借助 [[#unplugin-auto-import]] 插件可实现自动导入 VueUse 中的常用函数（如 `useStorage`、`useTitle` 等）。

```ts file:vite.config.ts hl:13
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      // 自动导入 VueRouter 相关函数，如：useRouter 等
      // 自动导入 Pinia 相关函数，如：createPinia，defineStore，storeToRefs 等
      // 自动导入 @vueuse/core 相关函数，如：useStorage、useTitle 等
      // 参考自： https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
    }),
})
```

#### 使用示例

以下是一个结合 [Pinia](https://pinia.vuejs.org/zh/) 状态管理和 [VueUse](https://vueuse.org/) 的 [`useStorage()`](https://vueuse.org/core/useStorage/) 工具函数的计数器示例。通过 `useStorage` 可将状态同步至 `localStorage`，实现本地持久化，页面刷新后依然保留计数值。

```ts file:src/stores/counter.ts hl:2
export const useCounterStore = defineStore('counter', () => {
  const count = useStorage('count', 0)

  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }
  return { count, increment, decrement }
})
```

```vue hl:3,10
<template>
  <div class="mb-4">
    <el-input-number v-model="count" :min="1" :max="10" @change="handleChange" />
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const { count } = storeToRefs(useCounterStore())
const handleChange = (value: number | undefined) => {
  count.value = value
}
</script>
```

### 暗黑模式支持

#### Element Plus 暗黑模式

> [!quote]
> 官方文档：
> - 👉 [主题 | Element Plus](https://element-plus.org/zh-CN/guide/theming.html)
> - 👉 [暗黑模式 | Element Plus](https://element-plus.org/zh-CN/guide/dark-mode.html)

##### 如何启用？

启用非常简单，只需在 HTML 根节点上添加 `.dark` 类名即可：

```html
<html class="dark">
  <head></head>
  <body></body>
</html>
```

如果希望**动态切换明暗模式**，推荐使用 VueUse 提供的 [useDark](https://vueuse.org/core/useDark/) 实现响应式控制。

##### 推荐目录结构

```bash
src/
└── styles/
    ├── element/
    │   ├── light.scss        # 明亮主题变量（SCSS 变量覆盖）
    │   ├── dark.scss         # 暗黑主题变量（CSS 变量覆盖）
    │   └── index.scss        # 汇总统一导出
    └── index.scss            # 全局样式入口（引入 ElementPlus Dark CSS 变量）
```

> [!note]
> `light.scss` 与 `dark.scss` **必须分为两个独立文件**，因为 Sass **不允许在同一文件中多次 `@forward` 相同变量名（如 `$colors`）**，否则将导致变量名冲突和构建失败。

##### 明亮模式变量（`light.scss`）

```scss file:src/styles/element/light.scss
/* just override what you need */
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': #ff4c20,
    ),
  )
);
```

##### 暗黑模式变量（`dark.scss`）

```scss file:src/styles/element/dark.scss
/* just override what you need */
@forward 'element-plus/theme-chalk/src/dark/var.scss' with (
  $colors: (
    'primary': (
      'base': #67c23a,
    ),
  )
);
```

##### 变量汇总入口（`index.scss`）

```scss file:src/styles/element/index.scss
@use './light.scss' as *;
@use './dark.scss' as *;
```

##### 全局样式入口（引入暗黑模式 CSS 变量）

```scss file:src/styles/index.scss
@use 'element-plus/theme-chalk/src/dark/css-vars.scss';
```

> [!important]
> 在入口文件 `main.ts` 中引入 `src/styles/index.scss`，以加载变量定义和暗黑样式。

##### Vite 配置：启用 Sass 支持 & 自动注入变量

```ts file:vite.config.ts hl:14,21,25-32
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      // 自定义解析器
      resolvers: [
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        // 采用 SaSS 源文件的方式引入组件样式，以便通过 SCSS 变量覆盖实现主题定制
        ElementPlusResolver({ importStyle: 'sass' }),
      ],
    }),
    Components({
      resolvers: [
        // 自动注册 Element Plus 组件
        // 采用 SaSS 源文件的方式引入组件样式，以便通过 SCSS 变量覆盖实现主题定制
        ElementPlusResolver({ importStyle: 'sass' }),
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 自动注入变量，无需在每个文件中单独引入
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
})
```

#### UnoCSS 暗黑模式

我们使用的是 [[#Wind3 预设 (推荐)|Wind3 预设]]，该预设默认启用[基于类名的暗黑模式](https://unocss.nodejs.cn/presets/wind3#dark-mode)。只需在原子类前加上 `dark:` 前缀，即可定义暗黑样式：

```html
<div class="dark:bg-red:10" />
```

编译后将自动生成对应的 CSS：

```css
.dark .dark\:bg-red\:10 {
  background-color: rgb(248 113 113 / 0.1);
}
```

#### 动态切换明暗模式

使用 VueUse 提供的 [`useDark`](https://vueuse.org/core/useDark/) 和 [`useToggle`](https://vueuse.org/shared/useToggle/)，可轻松实现响应式的明暗主题切换：

```vue
<template>
  <div class="h-100px w-150px flex items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700">
    <el-button type="primary" @click="toggleDark()">
      <template #icon>
        <IEpMoon v-if="isDark" />
        <IEpSunny v-else />
      </template>
    </el-button>
  </div>
</template>

<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
```

#### 明暗模式切换动画效果

> [!quote] 推荐参考
> - [View Transition API 实现主题切换动画效果](https://www.bilibili.com/video/BV18x4y187op?vd_source=84272a2d7f72158b38778819be5bc6ad)
> - [B站客户端切换暗黑模式效果还原](https://www.bilibili.com/video/BV1iJ4m1T7CA?vd_source=84272a2d7f72158b38778819be5bc6ad)

下面示例使用原生 [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) 实现从鼠标点击位置扩散的动态切换过渡：

```vue hl:14-35
<template>
  <div class="h-100px w-150px flex items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700">
    <el-button type="primary" @click="toggleDark">
      <template #icon>
        <IEpMoon v-if="isDark" />
        <IEpSunny v-else />
      </template>
    </el-button>
  </div>
</template>

<script setup lang="ts">
const isDark = useDark()
const toggleDark = (event: MouseEvent) => {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    )
  })
}
</script>
```

配套样式（用于控制 View Transition 层级）

```scss hl:1-21
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}

.dark::view-transition-old(root) {
  z-index: 9999;
}

.dark::view-transition-new(root) {
  z-index: 1;
}
```

### Axios 二次封装

Axios 是一个基于 [promise](https://javascript.info/promise-basics) 的网络请求库，可在浏览器和 [[Node.js]] 环境中使用。它具备同构（[isomorphic](https://www.lullabot.com/articles/what-is-an-isomorphic-application)）特性，即同一套代码可以运行在浏览器和 `node.js` 中。在服务端它使用 [[Node.js]] 的 `http` 模块，在客户端 (浏览器) 则使用原生 `XMLHttpRequest` 实现。

核心特性：

- 支持在浏览器发送 [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 请求；
- 支持在 Node.js 中发送 [`http`](http://nodejs.org/api/http.html) 请求；
- 完全基于 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API；
- 支持请求和响应拦截；
- 请求和响应数据转换；
- 支持请求取消与超时设置；
- 查询参数支持嵌套结构序列化；
- 自动处理请求体格式，支持：
    - JSON（`application/json`）
    - 表单数据（`multipart/form-data`）
    - URL 编码（`application/x-www-form-urlencoded`）
- 可将 HTML 表单自动转换为 JSON 发送；
- 自动解析和转换 JSON 响应数据；
- 提供请求进度信息（包括传输速度与剩余时间）；
- 在 Node.js 中支持带宽限制；
- 兼容标准的 FormData 和 Blob（包括 Node.js）；
- 客户端支持防御 [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)（跨站请求伪造）攻击。

#### 安装

```bash
pnpm install axios
```

### ECharts 封装

- [ ] TODO

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

## 扩展 & 补充

### SCSS 模块引入方式

#### `@import`（旧语法）

##### 特点

- 直接引入 SCSS 文件，**所有变量、函数、混入全局可见**
- **易引发命名冲突，污染全局命名空间**
- 可重复引入同一文件，可能导致重复编译
- Sass 官方已不推荐使用

##### 示例

```scss
// _variables.scss
$primary-color: blue;

// main.scss
@import 'variables';

body {
  color: $primary-color; // 可直接使用
}
```

#### `@use`（推荐语法）

##### 特点

- 默认有命名空间，需加前缀访问变量（如 `variables.$primary-color`）
- 同一文件只会被引入一次，避免重复编译
- 支持私有变量（变量名前加 `_` 不会被导出）
- 更符合模块化设计，利于维护与复用

##### 示例

```scss
@use 'variables';

body {
  color: variables.$primary-color;
}
```

取消命名空间前缀：

```scss
@use 'variables' as *;

body {
  color: $primary-color;
}
```

### SCSS 与 CSS 变量

#### SCSS 变量（构建时变量）

##### 特点

- 编译时生效，仅在构建阶段有效
- 不支持运行时动态修改
- 支持嵌套作用域、运算与函数调用

##### 语法

```scss
$primary-color: #3498db;

.button {
  color: $primary-color;
}
```

##### 使用方式

- 写在 `.scss` 文件中，使用 `$变量名`
- 编译后生成 `.css` 文件供浏览器使用

#### CSS 变量（运行时变量）

##### 特点

- 浏览器原生支持，运行时生效
- 支持作用域继承（如作用于 `:root`、类名、元素）
- 可通过 JavaScript 动态修改
- 支持继承与覆盖，适合响应式与主题切换场景

##### 语法

```css
:root {
  --primary-color: #3498db;
}

.button {
  color: var(--primary-color);
}
```

##### 使用方式

- 定义：`--变量名: 值;`
- 使用：`var (--变量名)`

#### 最佳实践

- **需要响应式、主题切换等运行时行为** → 使用 **CSS 变量**
- **结构复杂、依赖计算和逻辑的样式体系** → 使用 **SCSS 变量**
- **推荐混合使用**：用 SCSS 统一管理变量，再输出为 CSS 变量供运行时使用

```scss
$primary-color: #3498db;

:root {
  --primary-color: #{$primary-color};
}
```

### unplugin-auto-import

> [!quote]
> [`unplugin-auto-import`](https://github.com/unplugin/unplugin-auto-import) 是基于 [`unplugin`](https://github.com/unplugin) 构建的插件，支持 Vite、Webpack、Rspack、Rollup、esbuild 等工具，实现 **API 自动按需导入**，并支持 TypeScript 类型提示。

✨ 特性亮点：

- 💡 自动导入常用函数和 API，无需手动 `import`
- 🧠 智能分析使用的函数并按需导入
- 🪄 支持 **Vue**、React、**Pinia**、**Vue Router** 等常见库
- 🧩 支持 Vue 模板语法中使用（需开启 `vueTemplate: true`）
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

#### 配置项说明

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
- [Vuetify](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/vuetify.ts) （建议优先使用其官方插件），支持 [v3 + vite](https://www.npmjs.com/package/vite-plugin-vuetify), [v3 + webpack](https://www.npmjs.com/package/webpack-plugin-vuetify), [v2 + webpack](https://npmjs.com/package/vuetify-loader)
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

#### 配置项说明

以下是 `unplugin-vue-components` 的默认配置及作用说明：

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

### 环境变量与模式

在前端工程中，环境变量常用于根据不同运行模式（如开发环境 `development` 或生产环境 `production`）控制代码行为，实现按环境区分的逻辑处理。

#### 内置常量

Vite 通过 `import.meta.env` 对象提供了一组内置常量，这些常量在开发时作为全局变量使用，在构建时会被静态替换，有助于实现更高效的 tree-shaking。这些常量在任意环境中均可使用：
![](https://img.xiaorang.fun/202505161900396.png)

- **`import.meta.env.MODE`**: 应用当前的[[#模式|运行模式]]。
- **`import.meta.env.BASE_URL`**: 应用部署时的基础路径，由 [`base`](https://cn.vite.dev/config/shared-options.html#base) 配置项决定。
- **`import.meta.env.PROD`**: 应用是否运行在生产环境（使用 `NODE_ENV='production'` 运行开发服务器或构建应用时使用 `NODE_ENV='production'` ）。
- **`import.meta.env.DEV`**: 应用是否运行在开发环境 (永远与 `import.meta.env.PROD` 相反)。
- **`import.meta.env.SSR`**: 应用是否运行在[服务端](https://cn.vite.dev/guide/ssr.html#conditional-logic)。

#### 自定义环境变量

Vite 会自动将 `.env` 文件中的环境变量注入至 `import.meta.env` 对象中。不过，为了防止意外将敏感变量暴露到客户端，**只有以 `VITE_` 前缀命名的变量**才会暴露给经过 Vite 处理的代码。该前缀可通过 [`envPrefix`](https://cn.vite.dev/config/shared-options.html#envprefix) 配置项进行自定义。

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
> 所有环境变量均以字符串形式注入。如上例所示，尽管 `VITE_SOME_KEY` 是一个数字，但它在解析后仍然会返回一个字符串。布尔类型的变量也同样如此。因此在使用时，请根据需要手动进行类型转换。

##### `.env` 文件

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

##### TypeScript 的智能提示

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

#### HTML 中的环境变量替换

Vite 支持在 HTML 文件中使用环境变量。你可以通过 `%CONST_NAME%` 的占位符语法插入 `import.meta.env` 中的任意变量：

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

如果某个变量在 `import.meta.env` 中不存在（如 `%NON_EXISTENT%`），该占位符将被忽略，不会进行替换；而在 JavaScript 中访问未定义的 `import.meta.env.NON_EXISTENT` 则会返回 `undefined`。

#### 模式

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

##### NODE_ENV 和模式的区别

需要注意，`NODE_ENV`（即 `process.env.NODE_ENV`）与 Vite 的 "模式"（`mode`）是两个不同的概念。下表展示了不同命令组合对二者的影响：

| 命令                                                   | NODE_ENV        | 模式（`mode`）      |
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
> `NODE_ENV=...` 可通过命令行参数或者在 `.env` 文件中指定。若在 `.env.[mode]` 中指定了 `NODE_ENV`，则可以使用模式来控制其值。尽管如此，`NODE_ENV` 与模式（`mode`）仍然是两个不同的概念。
>
> 使用命令行设置 `NODE_ENV=...` 的优势在于，它可以在 Vite 配置解析前生效，使你能在 `vite.config.ts` 中通过 `process.env.NODE_ENV` 读取该值，而无需等待 `.env` 文件加载。

### 反向代理

[`server.proxy`](https://cn.vite.dev/config/server-options.html#server-proxy) 选项用于为开发服务器配置自定义代理规则，常用于解决本地开发中的请求跨域问题。

- 类型：`Record<string, string | ProxyOptions>`，即一个以路径前缀为键、代理配置为值的 `{ key: options }` 对象；
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
