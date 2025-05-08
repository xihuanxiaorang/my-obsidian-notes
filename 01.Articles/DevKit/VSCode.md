---
tags:
  - DevKit
create_time: 2024-12-31 19:00
update_time: 2025/05/04 18:37
---

> [!quote]
> [Visual Studio Code](https://code.visualstudio.com/)

## 推荐插件

### Live Server

[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 是 Visual Studio Code (VSCode) 的一款插件，用于快速启动本地 HTTP 服务器，帮助开发者实时预览 HTML、CSS 和 JavaScript 文件的修改效果，而无需手动刷新浏览器。它支持**自动刷新**，每次保存文件都会自动在浏览器中更新内容，极大提升前端开发效率。

#### 核心功能

1. **一键启动本地服务器**：快速生成访问地址（如 [http://localhost:5500](http://localhost:5500)）预览网页。
2. **自动刷新页面**：保存文件后浏览器自动更新，无需手动刷新。
3. **支持动态渲染**：可预览由 JavaScript 动态生成的内容。
4. **跨平台支持**：兼容 Windows、macOS 与 Linux。
5. **本地/远程资源调试**：支持本地文件与网络资源加载。

#### 安装方式

- 打开左侧 **扩展面板**（快捷键 `Ctrl + Shift + X`）。
- 搜索 **"Live Server"**，找到作者为 **Ritwick Dey** 的插件并安装。

#### 使用方式

- 打开包含 `index.html` 的文件夹。
- 启动方式：
    - 右键 HTML 文件 → 选择 **"Open with Live Server"**。
    - 或点击右下角状态栏的 **"Go Live"** 按钮。
- 浏览器自动打开页面，并在你保存文件时**自动刷新**。

#### 注意事项

- 请打开整个项目文件夹，而非单独文件。
- 确保 HTML 文件使用了标准结构（如包含 `<!DOCTYPE html>`）。

## 设置优化

### 快速恢复默认设置

- 打开设置界面。
- 在搜索框输入 `@modified`，快速定位所有**已修改**的配置项。
- 点击左侧齿轮图标，选择 **"重置此设置"**，或手动在 `settings.json` 中删除对应配置项。

![](https://img.xiaorang.fun/202505031231421.png)

### 光标动画优化（提升视觉体验）

- 打开设置界面，搜索 `cursor`。
- 修改以下两项：
    - `Editor: Cursor Blinking` → `smooth`
    - `Editor: Cursor Smooth Caret Animation` → `on`

![](https://img.xiaorang.fun/202505031236880.png)

### 字体推荐：Fira Code

[Fira Code](https://github.com/tonsky/FiraCode) 是一款免费开源的等宽字体，专为程序员设计，支持 **编程连字（ligatures）** —— 可将 `!==`、`>=` 等符号组合显示为更具可读性的符号，让代码视觉更整洁、结构更清晰。

- 前往 [GitHub Releases](https://github.com/tonsky/FiraCode/releases) 下载字体文件并安装；
- 打开 VS Code 设置，搜索 `Font Family`；
- 设置字体为：

	```
	Fira Code, Consolas, 'Courier New', monospace
	```

- 启用连字（Ligatures）功能：
	- 在设置中搜索 `Font Ligatures` 并启用；
	- 或在 `settings.json` 中添加以下配置：

		```json
		{
		  "editor.fontLigatures": true
		}
		```

![](https://img.xiaorang.fun/202505031240442.png)

### 移动主侧栏至右侧

右键单击活动栏并选择**向右移动主侧栏**。
![](https://img.xiaorang.fun/202505041835560.png)
