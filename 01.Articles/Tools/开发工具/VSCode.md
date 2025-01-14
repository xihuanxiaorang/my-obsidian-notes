---
tags:
  - Tool
  - DevTool
create_time: 2024-12-31 19:00
update_time: 2025/01/14 17:17
---

## 下载 & 安装

[Visual Studio Code](https://code.visualstudio.com/)

## 推荐插件

### Live Server

[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 是 Visual Studio Code (VSCode) 的一款插件，用于快速启动本地 HTTP 服务器，帮助开发者实时预览 HTML、CSS 和 JavaScript 文件的修改效果，而无需手动刷新浏览器。

它的核心功能是**自动刷新**，每次保存代码时页面会自动更新，极大地提高了前端开发效率。

#### 主要功能

1. **快速启动本地服务器：**
    在 VSCode 中一键启动 HTTP 服务器，自动生成可访问的地址（如 `http://localhost:5500`），方便调试网页内容。
2. **实时预览和热更新：**
    修改 HTML、CSS 或 JavaScript 文件后，保存即可看到浏览器中实时反映的效果，无需手动刷新。
3. **支持动态内容：**
    能加载由 JavaScript 动态生成的内容，确保页面内容始终与代码同步。
4. **跨平台支持：**
    兼容 Windows、macOS 和 Linux，适配不同操作系统的开发环境。
5. **处理本地和网络资源：**
    支持本地文件和外部资源加载，可作为简单的代理服务器调试内容。

#### 安装

- 点击左侧 **扩展（Extensions）** 图标，或按 `Ctrl + Shift + X` 打开扩展视图。
- 点击 **安装（Install）** 按钮完成安装。
- 搜索 **"Live Server"**，找到由 **Ritwick Dey** 开发的插件。

#### 使用

- **打开项目文件夹：**
    在 VSCode 中打开包含 HTML 文件的项目文件夹。
- **启动 Live Server：**
    - **右键启动：** 右键 `index.html` 文件，选择 "**Open with Live Server**"。
    - **点击按钮：** 在编辑器右下角点击 **"Go Live"** 按钮。
- **浏览器预览：**
    - 浏览器会自动打开默认地址（如 `http://localhost:5500`），实时加载项目文件。
    - 修改代码并保存时，页面会自动刷新以显示最新内容。

#### 注意事项

1. 确保在 VSCode 中打开的是项目文件夹，而不是单个文件，否则 Live Server 无法正常工作。
2. 确保文件使用标准的 HTML 结构（如 `<!DOCTYPE html>` 开头），否则可能无法实现自动刷新。

---

**Live Server** 是前端开发中的高效工具，特别适合静态网页和动态内容的开发。它通过自动刷新和实时预览功能简化了调试流程，提高了开发效率。如果您从事前端开发工作，强烈推荐安装使用。

## 小技巧

### 让光标移动更加丝滑流畅 | 视觉体验优化

1. 打开设置界面。
2. 在搜索框中输入 **"cursor animation"**。
3. 设置 **Editor: Cursor Smooth Caret Animation** 为 **on**。
4. 设置 **Editor: Cursor Blinking** 为 **smooth**。

![](https://img.xiaorang.fun/202501121155802.png)
