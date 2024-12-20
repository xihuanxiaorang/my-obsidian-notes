---
tags:
  - Tool
  - EnvironmentSetup
  - Frontend
  - DevTool
---

前期准备： [[Node.js]] & [[nvm]]

## 介绍

> [!quote]
> [Fast, disk space efficient package manager | pnpm](https://pnpm.io/)

`pnpm` 是一个高效、节省磁盘空间的 Node.js 包管理工具，具有以下特点：

+ 共享全局存储：通过符号链接机制共享依赖，减少磁盘占用。
+ 安装速度快：利用缓存机制，大幅提升安装效率。
+ 严格依赖管理：避免幽灵依赖，确保依赖一致性。
+ Monorepo 支持：内置工作区功能，适合大型项目的多包管理。

## 安装

使用 `npm install pnpm -g` 命令全局安装 pnpm，安装完成之后，可以使用 `pnpm -v` 命令测试 pnpm 是否安装成功。若输出版本号，则说明 pnpm 已成功安装。
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161120058.png)

## 配置

```bash
# 设置全局安装包的可执行文件(bin)目录
pnpm config set global-bin-dir "E:\devsoft\pnpm-store"

# 设置包元数据缓存的位置，用于提升安装速度
pnpm config set cache-dir "E:\devsoft\pnpm-store\pnpm-cache"

# 设置 pnpm-state.json 文件的存储目录，该文件目前仅供更新检查器使用
pnpm config set state-dir "E:\devsoft\pnpm-store\pnpm-state"

# 设置全局依赖的存储目录
pnpm config set global-dir "E:\devsoft\pnpm-store\global"

# 设置所有包的统一存储目录
pnpm config set store-dir "E:\devsoft\pnpm-store\pnpm-store"
```

配置完成后，pnpm 会生成一个全局配置文件，通常位于 `~/AppData/Local/pnpm/config/rc` （Windows）。你可以通过 `pnpm config list` 命令查看所有配置项。
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161120738.png)

通过上述配置，可以实现对 pnpm 全局依赖、缓存和状态文件的统一管理，提升维护效率，并便于快速定位和解决问题。

### 环境变量配置

 为确保全局安装的包可被正常使用，需要将 `global-bin-dir` 路径添加到系统环境变量中。

1. 右键点击 "计算机" 或 "此电脑"，选择 "属性"。
2. 点击 "高级系统设置"。
3. 在弹出的 "系统属性" 窗口中，点击 "环境变量"。
4. 配置 Path 系统变量。
    1. 在 "系统变量" 中找到 Path 变量，点击 "编辑"。
    2. 点击 "新建"，输入 pnpm 的全局可执行文件目录，如 `E:\devsoft\pnpm-store` ，然后尽量将其 "上移"。
    3. 最后一路点击 "确定" 进行保存配置。

## 常用命令

| **功能**  | **pnpm 命令**                     | **npm 命令**                     |
| ------- | ------------------------------- | ------------------------------ |
| 安装依赖    | `pnpm install`                  | `npm install`                  |
| 安装指定依赖  | `pnpm install <package>`        | `npm install <package>`        |
| 全局安装依赖  | `pnpm add -g <package>`         | `npm install -g <package>`     |
| 卸载依赖    | `pnpm remove <package>`         | `npm uninstall <package>`      |
| 全局卸载依赖  | `pnpm remove -g <package>`      | `npm uninstall -g <package>`   |
| 更新依赖    | `pnpm update <package>`         | `npm update <package>`         |
| 初始化项目   | `pnpm init`                     | `npm init`                     |
| 查看依赖树   | `pnpm list`                     | `npm list`                     |
| 查看全局依赖树 | `pnpm list -g`                  | `npm list -g`                  |
| 查看依赖信息  | `pnpm info <package>`           | `npm info <package>`           |
| 清理缓存    | `pnpm store prune`              | `npm cache clean --force`      |
| 运行脚本    | `pnpm run <script>`             | `npm run <script>`             |
| 脚本快捷方式  | `pnpm start` , `pnpm test`       | `npm start` , `npm test`        |
| 工作区支持   | `pnpm workspaces` （内置支持）         | `npm workspaces` （需启用）          |
| 全局配置查看  | `pnpm config list`              | `npm config list`              |
| 设置全局配置  | `pnpm config set <key> <value>` | `npm config set <key> <value>` |
| 查看缓存目录  | `pnpm store path`               | `npm config get cache`         |
| 重新构建依赖  | `pnpm rebuild`                  | `npm rebuild`                  |
