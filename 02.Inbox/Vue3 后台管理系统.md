---
tags:
  - Frontend/Vue
  - Frontend/TypeScript
  - Project/后台管理系统
create_time: 2025-05-02 18:56
update_time: 2025/05/28 12:11
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

首先您需要安装 [[Vite#unplugin-vue-components|unplugin-vue-components]] 和 [[Vite#unplugin-auto-import|unplugin-auto-import]] 这两款插件：

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

![[Vite#报错信息]]

![[Vite#方案一：直接禁用 `no-undef` 规则（推荐）]]

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

借助 [[Vite#unplugin-icons|unplugin-icons]] 配合 [[Vite#unplugin-auto-import|unplugin-auto-import]] 与 [[Vite#unplugin-vue-components|unplugin-vue-components]] 插件，可实现 [Iconify](https://iconify.design/) 图标的自动导入与组件注册。

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

在项目入口文件 `main.ts` 中引入：

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

借助 [[Vite#unplugin-auto-import|unplugin-auto-import]] 插件可实现自动导入 VueUse 中的常用函数（如 `useStorage`、`useTitle` 等）。

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

借助 VueUse 提供的 [`useColorMode`](https://vueuse.org/core/useColorMode/) 和 [`usePreferredDark`](https://vueuse.org/core/usePreferredDark/)，可以轻松实现响应系统主题、支持手动切换的明暗模式：

```vue hl:13-14,17-22,25,27-31
<template>
  <el-icon class="cursor-pointer" @click="toggle">
    <template v-if="mode === 'dark'">
      <i-ep-moon />
    </template>
    <template v-else-if="mode === 'light'">
      <i-ep-sunny />
    </template>
  </el-icon>
</template>

<script setup lang="ts">
const mode = useColorMode()
const isSystemDark = usePreferredDark()

// 若当前模式与系统主题一致，则回退为自动模式（'auto'），以便后续继续跟随系统
const maybeResetMode = () => {
  const matchesSystem = mode.value === (isSystemDark.value ? 'dark' : 'light')
  if (matchesSystem) {
    mode.value = 'auto'
  }
}

// 当系统主题变化时，尝试回退为自动模式
watch(isSystemDark, maybeResetMode)

const toggle = async () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
  await nextTick()
  maybeResetMode()
}
</script>
```

#### 主题切换动画

> [!quote] 推荐参考
> - [View Transition API 实现主题切换动画效果](https://www.bilibili.com/video/BV18x4y187op?vd_source=84272a2d7f72158b38778819be5bc6ad)
> - [B站客户端切换暗黑模式效果还原](https://www.bilibili.com/video/BV1iJ4m1T7CA?vd_source=84272a2d7f72158b38778819be5bc6ad)

通过原生 [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) 可以为主题切换添加点击扩散动画，让体验更自然：

```vue hl:27-52
<template>
  <el-icon class="cursor-pointer" @click="toggle">
    <template v-if="mode === 'dark'">
      <i-ep-moon />
    </template>
    <template v-else-if="mode === 'light'">
      <i-ep-sunny />
    </template>
  </el-icon>
</template>

<script setup lang="ts">
const mode = useColorMode()
const isSystemDark = usePreferredDark()

// 若当前模式与系统主题一致，则回退为自动模式（'auto'），以便后续继续跟随系统
const maybeResetMode = () => {
  const matchesSystem = mode.value === (isSystemDark.value ? 'dark' : 'light')
  if (matchesSystem) {
    mode.value = 'auto'
  }
}

// 当系统主题变化时，尝试回退为自动模式
watch(isSystemDark, maybeResetMode)

const toggle = (event: MouseEvent) => {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(async () => {
    // 手动切换主题，暂时中断系统跟随
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    await nextTick()
    // 如果当前主题切换后与系统一致，则恢复为自动模式
    maybeResetMode()
  })
  transition.ready.then(() => {
    const isDark = mode.value === 'dark'
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    )
  })
}
</script>
```

配套样式（确保 View Transition 动画正常叠加并支持暗黑模式反转时的过渡层优先级）：

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

### 自定义环境变量

> [!quote]
> [[Vite#环境变量与模式]]

#### 定义 `.env` 文件

Vite 会自动加载环境目录中的 `.env` 文件，并将所有以 `VITE_` 开头的变量注入到 `import.meta.env` 中。

```text file:.env hl:2,5
# 应用名称
VITE_APP_TITLE = "Vue3 Admin"

# 应用端口
VITE_APP_PORT = 3000
```

> [!note]
> **`.env` 文件中所有值默认以字符串形式注入**。若需使用布尔或数字类型，请手动转换。

#### 类型提示支持

为获得 TypeScript 智能提示，可扩展 `ImportMetaEnv` 接口。

```ts file:vite-env.d.ts hl:3-6,8-12,14-16
/// <reference types="vite/client" />

interface ViteTypeOptions {
  // 启用严格模式，禁止访问未声明的环境变量
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_PORT: number
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

#### 使用环境变量

##### 动态替换页面标题

在 HTML 中使用 `%VITE_APP_TITLE%` 占位符动态替换页面标题。

```html file:index.html hl:7
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>%VITE_APP_TITLE%</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

##### 设置开发服务器端口

```ts file:vite.config.ts hl:5,8,14
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './env')
  return {
    // 环境目录
    envDir: './env',
    // 开发环境服务器配置
    server: {
      // 服务器主机名（允许通过局域网访问）
      host: '0.0.0.0',
      // 服务器端口
      port: +env.VITE_APP_PORT,
      // 启动后自动打开浏览器
      open: true,
      // 启用跨域请求支持（CORS）
      cors: true,
      // 启用热模块替换（Hot Module Replacement）
      hmr: true,
    },
  }
})
```

### Axios 二次封装

Axios 是一个基于 [promise](https://javascript.info/promise-basics) 的网络请求库，适用于浏览器和 [[Node.js]] 环境，具备同构（[isomorphic](https://www.lullabot.com/articles/what-is-an-isomorphic-application)）特性，即相同代码可运行于前后端。在服务端基于 `http` 模块，在客户端则使用原生 `XMLHttpRequest`。

核心特性：

- 支持浏览器端发送 [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 请求；
- 支持 Node.js 中发送 [`http`](http://nodejs.org/api/http.html) 请求；
- 基于原生 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)；
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

#### 添加环境变量

```text file:.env hl:2
# 请求超时时间（单位：ms）
VITE_APP_API_TIMEOUT = 10000
```

```text file:.env.development hl:2,5,8
# 代理前缀
VITE_APP_BASE_API = "/api"

# 接口地址
VITE_APP_API_URL = "http://localhost:8080"

# 请求超时时间（单位：ms），为 0 表示不超时
VITE_APP_API_TIMEOUT = 0
```

```ts file:vite-env.d.ts hl:11-14
/// <reference types="vite/client" />

interface ViteTypeOptions {
  // 启用严格模式，禁止访问未声明的环境变量
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_PORT: number
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_API_TIMEOUT: number
  // 更多环境变量...
}


interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

#### Axios 基础封装

##### 统一响应结构体

```ts file:request.ts
interface Result<T = any> {
  /**
   * 响应码
   */
  code: string
  /**
   * 响应消息
   */
  message: string
  /**
   * 响应数据
   */
  data: T
}
```

##### 错误处理映射表

```ts file:request.ts
const ERROR_HANDLERS: {
  /**
   * 业务错误处理器集合
   * @key string - 业务错误码（对应 ResultCode 枚举值）
   * @value () => void - 对应的错误处理函数
   * @property default - 未匹配错误码时的默认处理器
   */
  business: Record<string, () => void> & { default: () => void }
  /**
   * HTTP 错误消息映射
   * @key number - HTTP 状态码（如 400、500）
   * @value string - 对应的友好错误提示
   * @property default - 未匹配状态码时的默认提示
   */
  http: Record<number, string> & { default: string }
} = {
  business: {
    [ResultCode.TOKEN_INVALID]: () => handleTokenExpired(),
    default: () => ElMessage.error('未知业务错误'),
  },
  http: {
    400: '请求参数错误',
    401: '会话已过期，请重新登录',
    403: '权限不足，请联系管理员',
    404: '资源不存在，请联系管理员',
    500: '服务器内部错误，请联系管理员',
    default: '未知错误，请联系管理员',
  },
}
```

##### 会话过期处理

```ts file:request.ts
const handleTokenExpired = () => {
  ElMessageBox.confirm('会话已过期，是否重新登录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => location.reload())
}
```

##### Http 封装类

###### 核心实现

```ts file:request.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ACCESS_TOKEN } from './constants'
import ResultCode from '@/enums/ResultCode'

/*******************************Http 请求封装*********************************/
class Http {
  /**
   * Axios 实例对象，封装所有请求的基础配置
   */
  private readonly axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      /**
       * API 基础路径（从环境变量获取）
       * @default import.meta.env.VITE_APP_BASE_API
       */
      baseURL: import.meta.env.VITE_APP_BASE_API,
      /**
       * 请求超时时间（单位：毫秒）
       * @default Number(import.meta.env.VITE_APP_API_TIMEOUT)
       */
      timeout: Number(import.meta.env.VITE_APP_API_TIMEOUT),
      /**
       * 默认请求头配置
       * @property Content-Type - 默认使用 JSON 格式
       */
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    })
    // 设置请求和响应拦截器
    this.setupInterceptors()
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors() {
    // 添加请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => {
        // 对请求错误做些什么
        return Promise.reject(error)
      },
    )

    // 添加响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<Result>) => this.handleSuccessResponse(response),
      (error) => this.handleErrorResponse(error),
    )
  }

  /**
   * 处理成功响应（状态码 2xx）
   * @param response - 原始响应对象
   * @returns 业务数据 或 二进制响应对象
   * @throws 当业务码非成功时抛出错误
   */
  private handleSuccessResponse(response: AxiosResponse<Result>) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (this.isBinaryResponse(response)) {
      return response
    }

    const { code, message, data } = response.data
    if (code === ResultCode.SUCCESS) {
      return data
    }

    this.handleBusinessError(code)
    return Promise.reject(new Error(message || '请求失败'))
  }

  /**
   * 处理失败响应（状态码非 2xx 或网络错误、取消请求等）
   * @param error - 错误对象
   * @returns 始终返回 rejected 状态的 Promise
   */
  private handleErrorResponse(error: any) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('请求被取消'))
    }

    if (!error.response) {
      if (!navigator.onLine) {
        ElMessage.error('网络已断开，请检查您的网络连接')
        return Promise.reject(new Error('网络断开'))
      }

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        ElMessage.error('请求超时，请稍后重试')
        return Promise.reject(new Error('请求超时'))
      }

      ElMessage.error('网络异常，请检查您的连接')
      return Promise.reject(new Error('网络异常'))
    }

    this.handleHttpError(error.response?.status)
    return Promise.reject(error)
  }

  this.handleHttpError(error.response?.status)
return Promise.reject(error)
}

/**
   * 判断是否为二进制类型的响应（如文件下载）
   *
   * 用于跳过业务状态码解析，直接返回响应体。
   * 通常 responseType 为 'blob' 或 'arraybuffer' 时，
   * 表示服务端返回的是文件流（如导出 Excel、下载 PDF 等）。
   *
   * @param response - Axios 响应对象
   * @returns 是否为二进制响应类型
   */
private isBinaryResponse(response: AxiosResponse) {
  return response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer'
}

/**
   * 处理业务错误码
   * @param code - 后端定义的错误码
   */
private handleBusinessError(code: string) {
  const handler = ERROR_HANDLERS.business[code] || ERROR_HANDLERS.business.default
  handler()
}

/**
   * 处理 HTTP 状态码错误
   * @param status - HTTP 状态码（如 401、500 等）
   */
private handleHttpError(status: number) {
  const message = ERROR_HANDLERS.http[status] ?? ERROR_HANDLERS.http.default
  ElMessage.error(message)
}

/**
   * 发起通用请求
   * @template T - 响应数据类型
   * @param config - Axios 请求配置
   * @returns Promise<T> - 返回处理后的业务数据 Promise
   *
   * @example
   * request<{ list: [] }>({ url: '/api/list' })
   */
request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return this.axiosInstance.request(config)
}

/**
   * GET 请求快捷方法
   * @template T - 响应数据类型
   * @param url - 请求地址
   * @param params - 查询参数（拼接到 URL）
   * @param config - 额外请求配置（可选）
   */
get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig) => {
  return this.request<T>({
    ...config,
    url,
    method: 'GET',
    params,
  })
}
/**
   * POST 请求方法
   * @param url 请求地址
   * @param data 请求参数
   * @param config 请求配置
   * @returns Promise<T>
   */
post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return this.request<T>({
    ...config,
    method: 'POST',
    url,
    data,
  })
}
/**
   * PUT 请求方法
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置项
   * @returns Promise<T>
   */
put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return this.request<T>({
    ...config,
    method: 'PUT',
    url,
    data,
  })
}
/**
   * DELETE 请求方法
   * @param url 请求地址
   * @param config 配置项
   * @returns Promise<T>
   */
delete = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return this.request<T>({
    ...config,
    method: 'DELETE',
    url,
  })
}
}
```

###### 导出请求实例

```ts file:request.ts
const http = new Http()
export const { request, get, post, put, delete: del } = http
export default http
```

#### API 模块封装

##### 用户模块

```ts file:api/modules/system/user/index.ts hl:10-12
import { get } from '@/utils/request'
import type { UserInfo } from './types'

const USER_BASE_URL = '/system/user'

/**
 * 获取当前登录用户信息
 * @returns {Promise<UserInfo>} 当前登录用户信息
 */
export const getUserInfo = (): Promise<UserInfo> => {
  return get<UserInfo>(`${USER_BASE_URL}/me`)
}
```

##### 登录用户类型定义

```ts file:api/modules/system/user/types.ts
/**
 * 当前登录用户信息
 */
export type UserInfo = {
  /**
   * 用户ID
   */
  userId: number
  /**
   * 用户名
   */
  username: string
  /**
   * 昵称
   */
  nickname: string
  /**
   * 头像URL
   */
  avatar: string
  /**
   * 角色集合
   */
  roles: string[]
  /**
   * 权限集合
   */
  permissions: string[]
}
```

##### 模块统一导出

```ts file:api/index.ts
export * as userApi from './modules/system/user'
```

```ts file:api/types.ts
export * from './modules/system/user/types'
```

#### 反向代理解决跨域问题

出于安全考虑，浏览器采用**同源策略**：只有协议、域名和端口完全一致的请求才被视为同源，非同源请求将无法访问响应内容。

开发环境中，可通过 [[Vite#反向代理]] 配置实现跨域转发；生产环境则通常使用 `nginx` 配置反向代理，以解决跨域问题。

```ts file:vite.config.ts hl:10-21
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './env')
  return {
    // 开发环境服务器配置
    server: {
      // 代理配置对象，用于开发服务器请求转发
      proxy: {
        // 将请求路径以 VITE_APP_BASE_API 开头的请求，代理到后端 API 地址
        [env.VITE_APP_BASE_API]: {
          // 目标服务器地址，需要代理到的后端 API 地址
          target: env.VITE_APP_API_URL,
          // 是否修改请求源，设置为 true 以正确传递跨域 Cookie
          changeOrigin: true,
          // 重写路径，将请求路径的前缀替换为空
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), ''),
        },
      },
    },
  }
})
```

#### 使用示例：获取当前登录用户信息

结合 VueUse 的 [`useAsyncState()`](https://vueuse.org/core/useAsyncState/) 实现异步请求与加载状态管理：

```vue hl:3-7,12,14
<template>
  <div class="mb-4 flex gap-4">
    <div v-loading="isLoading" class="box">
      <el-avatar :src="userInfo?.avatar">
        <SvgIcon icon-name="user" />
      </el-avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userApi } from '@/api'

const { isLoading, state: userInfo } = useAsyncState(userApi.getUserInfo, null)
</script>

<style lang="scss" scoped>
.box {
  @apply h-100px w-150px flex items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700;
}
</style>
```

### ECharts 封装

- [ ] TODO

### 国际化支持

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
