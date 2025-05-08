---
tags:
  - Frontend/Vue
  - Frontend/TypeScript
  - Project/后台管理系统
create_time: 2025-05-02 18:56
update_time: 2025/05/08 22:11
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

- [ ] TODO

### UnoCSS 集成

[**UnoCSS**](https://github.com/unocss/unocss) 是一个极简、性能极致的原子化 CSS 引擎，灵感来自 [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) 和 [Windi CSS](https://github.com/windicss/windicss)。它通过"按需生成（on-demand generation）"策略，仅构建页面中实际用到的样式，极大地减少了最终 CSS 的体积，并提供高度的可定制性和灵活的扩展机制。

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

```ts hl:4,8
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
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

```js hl:7,51
import js from '@eslint/js' // 官方 JS 推荐规则插件（包含基础语法校验）
import pluginVue from 'eslint-plugin-vue' // Vue 3 支持插件，提供适配 Vue 文件的规则集
import { defineConfig } from 'eslint/config' // 用于类型安全地定义 ESLint 配置（Flat 模式专用）
import globals from 'globals' // 浏览器 & Node 全局变量定义
import tseslint from 'typescript-eslint' // TypeScript ESLint 支持插件，含推荐规则与专用解析器
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended' // Prettier 推荐规则集
import unocss from '@unocss/eslint-config/flat' // UnoCSS 官方 ESLint Flat 模式规则集（包含原子类顺序和 attributify 属性顺序校验等）

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
  // 引入 UnoCSS ESLint 插件（默认启用 order/order-attributify）
  unocss,
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
      // 关闭 Vue 组件名必须为多词的限制（适用于如 Home.vue、Login.vue 等常见页面组件命名）
      'vue/multi-word-component-names': 'off',
    },
  },
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
- **状态类**：`hover:bg-blue-400`、`dark:text-white`
- **响应式类**：`md:px-4`、`lg:text-xl`

它是 UnoCSS 的重要构建块，开箱即用，适合追求快速开发和简洁 CSS 的项目。

> [!warning]
> `@unocss/preset-uno` **已被标记为废弃（deprecated）**，官方推荐改用功能更强、结构更现代的 [`@unocss/preset-wind3`](https://unocss.dev/presets/wind3)。
> 但它仍在 `unocss` 主包中内置，旧项目仍可兼容使用。

###### 安装 (可选)

```bash
pnpm add -D @unocss/preset-uno
```

> [!tip]
> 实际上**无需单独安装**，它已内置在 `unocss` 主包中，直接导入即可：
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
> `@unocss/preset-wind3` 已内置在 `unocss` 包中，无需额外安装依赖，直接导入即可：
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

`@unocss/preset-attributify` 预设支持以 HTML 属性形式书写原子类，提升可读性与结构清晰度，非常适合组件化开发与动态样式绑定。

###### 安装 (可选)

```bash
pnpm add -D @unocss/preset-attributify
```

> [!tip]
> `@unocss/preset-attributify` 已内置在 `unocss` 包中，无需额外安装依赖，直接导入即可：
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

想象一下，使用传统 Tailwind CSS 工具类写一个按钮时，HTML 结构可能如下所示：

```html
<button
  class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600"
>
  Button
</button>
```

当类名越来越多时，这种写法将变得冗长、难以维护，阅读体验也较差。

借助 **Attributify 模式**，你可以将原子类以属性形式组织，语义更清晰：

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

例如 `text-sm text-white` 可以合并写成 `text="sm white"`，无需重复前缀，大幅简化样式结构，提升可读性与维护性。

#### 转换器 (Transformers)

UnoCSS 提供多种转换器，可增强原子类在真实工程中的表达力与灵活性。

##### 指令转换器

`@unocss/transformer-directives` 是一个**指令式语法转换器**，支持在 CSS 或 `<style>` 标签中使用类似 Tailwind 的 `@apply`、`@screen`、`theme()` 等指令，极大提升了样式编写的直观性与复用性。

###### 安装

```bash
pnpm add -D @unocss/transformer-directives
```

###### 配置 `uno.config.ts`

```ts hl:2,6
import { defineConfig, presetWind3, presetAttributify } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

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

### Normalize.css 集成

[**Normalize.css**](https://necolas.github.io/normalize.css/) 是一种现代的 CSS 重置替代方案，旨在使浏览器渲染所有元素更加一致，符合现代标准。与传统的 CSS 重置不同，Normalize.css 保留了有用的默认样式，仅对存在差异的部分进行规范化。

它的主要特点包括：

- **保留有用的默认样式**：不像许多 CSS 重置那样完全移除所有默认样式，Normalize.css 保留了有用的默认值，避免了不必要的重复定义。
- **规范化多种元素的样式**：为广泛的 HTML 元素提供一致的样式，确保在不同浏览器中呈现一致的外观。
- **修复浏览器的 bug 和常见的不一致性**：解决了各个浏览器之间存在的已知问题和差异，提高了跨浏览器的兼容性。
- **通过细微的修改提升可用性**：对某些元素进行微调，改善用户体验。
- **使用详细的注释解释代码的作用**：每一部分代码都有清晰的注释，帮助开发者理解其目的和效果。

通过引入 Normalize.css，可以为项目建立一个一致的基础样式，减少浏览器之间的差异，提高开发效率。

#### 安装

```bash
pnpm install normalize.css
```

#### 引入方式

在项目入口文件 `main.ts` 中引入：

```ts
import 'normalize.css/normalize.css'
```

### SCSS 全局变量

> [!quote]
> [css. preprocessorOptions[extension]. additionalData \| 共享选项 \| Vite 官方中文文档](https://cn.vite.dev/config/shared-options.html#css-preprocessoroptions)

该选项允许为每个样式文件中自动注入 SCSS 变量、函数或混入等内容。

> [!note]
> 若注入的是实际样式内容而非变量，可能会在构建产物中**重复出现**，应避免。

> [!info]- 前置知识
> ![[SCSS 与 CSS 变量对比：特性、用法与最佳实践]]
>
> ![[SCSS 模块引入方式对比：@import 与 @use]]

#### 创建全局变量文件 `variables.scss`

```scss hl:1-3
$sidebarWidth: 210px;
$navbarHeight: 50px;
$tagsViewHeight: 34px;
```

#### 配置 Vite 自动注入变量

```ts hl:14-21
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
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

```scss hl:1-5
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
      <div class="navbar">头部导航栏</div>
      <div class="tags-view">标签栏</div>
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
      @apply w-[var(--sidebar-width)] bg-red;
    }
    .main-wrapper {
      @apply flex flex-col flex-1;
      .header-container {
        .navbar {
          @apply h-[var(--navbar-height)] bg-yellow;
        }
        .tags-view {
          @apply h-[var(--tags-view-height)] bg-blue;
        }
      }
      .content-container {
        @apply h-[calc(100vh-var(--navbar-height)-var(--tags-view-height))] bg-cyan;
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
| **原子类兼容性** | UnoCSS 支持 `w-[var(--xxx)]` 形式，完美结合动态样式         |
| **样式分离清晰** | 样式、变量、逻辑职责明确，便于维护和多人协作开发                       |

> [!warning] 注意事项
> - 不建议在 `additionalData` 中注入样式内容（如 class 等），否则会导致**重复渲染和样式污染**。
> - CSS 原生变量建议写在 `:root` 或页面级容器中，确保作用域清晰。
> - **UnoCSS 不支持 SCSS 编译期变量**（如 `$xx`），必须转为 `var(--xx)` 后配合原子类使用。

## 推荐插件

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [ESLint Chinese Rules](https://marketplace.visualstudio.com/items/?itemName=maggie.eslint-rules-zh-plugin)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Vue - Official](https://marketplace.visualstudio.com/items/?itemName=Vue.volar)
- [UnoCSS](https://marketplace.visualstudio.com/items/?itemName=antfu.unocss)

在项目根目录下创建 `.vscode/extensions.json` 文件，内容如下所示：

```json hl:2-8
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "maggie.eslint-rules-zh-plugin",
    "esbenp.prettier-vscode",
    "editorconfig.editorconfig"
  ]
}
```

这样团队其他小伙伴在拉取代码使用 VSCode 打开之后，在扩展中输入 `@recommended` 就会推荐安装这些插件。
