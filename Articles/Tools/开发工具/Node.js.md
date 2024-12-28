---
tags:
  - Tool
  - EnvironmentSetup
  - Frontend
  - DevTool
create_time: 2024-12-28T17:21:00
update_time: 2024/12/28 17:22
---

> [!quote]
> [Node.js — 在任何地方运行 JavaScript](https://nodejs.org/zh-cn)

Node.js® 是一个免费、开源、跨平台的 JavaScript 运行时环境, 它让开发人员能够创建服务器 Web 应用、命令行工具和脚本。

## 下载 & 安装

访问 [Node.js — 下载 Node.js®](https://nodejs.org/zh-cn/download/prebuilt-installer) 页面，选择预构建安装程序，点击下载 Node.js，如下所示：
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161108155.png)

以管理员身份打开终端，输入 msiexec /package "Node.js 安装程序的下载路径" 命令，如： `msiexec /package ~\Downloads\node-v22.12.0-x64.msi` 。
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161108242.png)

回车之后会弹出 Node. js 的安装程序弹框，开始进行安装，安装过程非常简单，只需要一直点击 ➡️ 下一步即可。在安装过程中，可以选择默认设置或自定义安装路径，如 E:\devsoft\nodejs。
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161108625.png)

> [!bug]- 😥安装失败的情况!
> 如果通过双击运行下载的 Node. js 安装程序进行安装，在最后一步可能会出现安装失败的情况，并弹出如下所示的错误弹框：
> ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161111762.png)

安装完成之后，在终端中输入以下命令来验证 Node.js 是否安装成功：

```bash
# 查看 node 版本
node -v

# 查看 npm 版本
npm -v
```

如果显示版本号，则表示安装成功！

## 全局模块路径和缓存路径配置

我们可以使用 `npm root -g` 或 `npm config ls` 命令来查看 npm 默认的全局模块路径。后者提供的信息更加详细，列出了所有配置选项及其当前值。

在修改 npm 默认配置之前，首先在 Node.js 安装目录（如：E:\devsoft\nodejs）下创建两个文件夹：node_global 用于存放全局模块，node_cache 用于存放全局缓存。

+ 全局模块路径： `npm config set prefix "E:\devsoft\nodejs\node_global"` ；
+ 全局缓存路径： `npm config set cache "E:\devsoft\nodejs\node_cache"` ；

最后，可以通过 `npm config ls` 命令查看修改后的 npm 配置，如下所示：
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161109127.png)

## 环境变量配置

1. 右键点击 "计算机" 或 "此电脑"，选择 "属性"。
2. 点击 "高级系统设置"。
3. 在弹出的 "系统属性" 窗口中，点击 "环境变量"。
4. 在 "系统变量" 区域，点击 "新建"。
    1. 新建 <u>NODE_HOME</u> 系统变量，变量值为 Node.js 的安装路径，如 `E:\devsoft\nodejs` 。
5. 配置 Path 系统变量。
    1. 在 "系统变量" 中找到 Path 变量，点击 "编辑"。
    2. 点击 "新建"，添加 `<u>%NODE_HOME%</u>` 和 `<u>%NODE_HOME%\node_global</u>` ，然后尽量将其 "上移"。
    3. 最后一路点击 "确定" 进行保存配置。

## 镜像源配置

我们可以使用 `npm get registry` 命令来查看当前 npm 所使用的镜像源，该命令会返回当前配置的 npm 镜像源 URL。

由于某些原因，如果你发现镜像源访问速度较慢，或者需要切换到其他源，可以通过 `npm config set registry xxx` 命令来修改 npm 镜像源，如下所示：

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com/

# 使用华为云镜像
npm config set registry https://mirrors.huaweicloud.com/repository/npm/
```

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161109219.png)

![[nrm]]
