---
tags:
  - EnvironmentSetup
  - Frontend
  - DevKit
create_time: 2024-12-28T17:29:00
update_time: 2025/05/02 18:16
---

[nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) 是一个用于管理 Node.js 版本的工具，可以让用户在同一台机器上安装和切换多个 Node.js 版本，非常适合开发环境中需要兼容不同 Node.js 版本的场景。

## 下载 & 安装

针对 windows 用户，推荐使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)。选择最新版本的安装程序，如下所示：
![](https://img.xiaorang.fun/202502251800600.png)

双击运行安装程序，在安装过程中，可以选择 nvm 和 Node.js 软链接的安装路径。完成路径选择后，按照提示依次点击 → 下一步即可完成安装。如下所示：
![](https://img.xiaorang.fun/202502251800601.png)

安装完成之后，可以使用 `nvm version` 命令测试 nvm 是否安装成功。若输出版本号，则说明 nvm 已成功安装。

不要急着安装 Node.js，可以先使用如下命令配置 Node.js 和 npm 的镜像源地址。

```bash
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

或者直接前往 nvm 的安装目录，找到 settings.txt 文件，在其中手动配置镜像源地址。

## 常用命令

- `nvm list available` ：列出所有可安装的 Node.js 版本。
  ![](https://img.xiaorang.fun/202502251800602.png)
- `nvm install <version>` ：安装指定版本，如 `nvm install 18` 。
  ![](https://img.xiaorang.fun/202502251800603.png)
- `nvm use <version>` ：切换到指定版本，如 `nvm use 18` 。
  ![](https://img.xiaorang.fun/202502251800604.png)
- `nvm list` ：查看本地已安装的 node 版本，并高亮显示当前正在使用的 Node.js 版本。
  ![](https://img.xiaorang.fun/202502251800605.png)
- `nvm current` ：显示当前正在使用的 Node.js 版本。
  ![](https://img.xiaorang.fun/202502251800606.png)
- `nvm uninstall <version>` ：卸载指定版本，将删除该版本下安装的所有包，如 `nvm uninstall 18.20.4` 。
  ![](https://img.xiaorang.fun/202502251800607.png)

## npm 配置

### 全局模块路径和缓存路径配置

我们可以使用 `npm root -g` 或 `npm config ls` 命令来查看 npm 默认的全局模块路径。后者提供的信息更加详细，列出了所有配置选项及其当前值。

在修改 npm 默认配置之前，首先在 Node.js 安装目录（如：E:\devsoft\nodejs）下创建两个文件夹：node_global 用于存放全局模块，node_cache 用于存放全局缓存。

- 全局模块路径： `npm config set prefix "E:\devsoft\nodejs\node_global"` ；
- 全局缓存路径： `npm config set cache "E:\devsoft\nodejs\node_cache"` ；

最后，可以通过 `npm config ls` 命令查看修改后的 npm 配置，如下所示：
![](https://img.xiaorang.fun/202502251800608.png)

### 环境变量配置

1. 右键点击 "计算机" 或 "此电脑"，选择 "属性"。
2. 点击 "高级系统设置"。
3. 在弹出的 "系统属性" 窗口中，点击 "环境变量"。
4. 在 "系统变量" 区域，可以看见安装 nvm 时已帮我们新建的 `NVM_HOME` 和 `NVM_SYMLINK` 变量。
5. 配置 Path 系统变量。
	1. 在 "系统变量" 中找到 Path 变量，点击 "编辑"。
	2. 点击 "新建"，添加 `%NVM_SYMLINK%\node_global` ，然后尽量将其 "上移"。
	3. 最后一路点击 "确定" 进行保存配置。

### 镜像源配置

我们可以使用 `npm get registry` 命令来查看当前 npm 所使用的镜像源，该命令会返回当前配置的 npm 镜像源 URL。

由于某些原因，如果你发现镜像源访问速度较慢，或者需要切换到其他源，可以通过 `npm config set registry xxx` 命令来修改 npm 镜像源，如下所示：

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com/

# 使用华为云镜像
npm config set registry https://mirrors.huaweicloud.com/repository/npm/
```

![](https://img.xiaorang.fun/202502251802148.png)

![[nrm]]
