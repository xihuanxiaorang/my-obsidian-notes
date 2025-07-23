---
tags:
  - DevKit
  - EnvironmentSetup
create_time: 2024/12/16 16:06
update_time: 2025/07/21 22:40
refrence_url:
  - https://www.bilibili.com/video/BV1tW42197za?vd_source=84272a2d7f72158b38778819be5bc6ad
---

> [!quote]
> 官方文档教程：[旧版 WSL 的手动安装步骤 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual)

## Step 1 - 启用适用于 Linux 的 Windows 子系统

在 Windows 上安装任何 Linux 分发版之前，必须先启用 "**适用于 Linux 的 Windows 子系统**" 可选功能。

以管理员身份运行 `PowerShell`（" 开始 " 菜单 → "PowerShell" → 单击右键 → " 以管理员身份运行 "），输入以下命令：

```shell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

![](https://img.xiaorang.fun/202502252159282.png)

## Step 2 - 启用虚拟机功能

安装 WSL2 之前，必须启用 "**虚拟机平台（Virtual Machine Platform）**" 可选功能。

> [!important]
> 您的计算机需要具备**虚拟化**功能才能使用此功能。如何开启呢？**进入主板 BIOS 界面** → **启用虚拟化选项**，如果是近几年新买的电脑，该选项默认是打开的。对于该选项每个电脑主板型号不同，设置的方法也不同。所以最好的方法是根据自己的主板型号，去度娘或者谷歌搜索一下开启虚拟化的方法。

以管理员身份运行 `PowerShell`，输入以下命令：

```shell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

![](https://img.xiaorang.fun/202502252159283.png)

执行完成之后务必记得重启一下电脑！！！

## Step 3 - 下载 Linux 内核更新包

Linux 内核更新包安装最新版本的 [WSL 2 Linux 内核](https://github.com/microsoft/WSL2-Linux-Kernel)，以便在 Windows 操作系统映像中运行 WSL。要从 Microsoft Store [运行](https://learn.microsoft.com/zh-cn/windows/wsl/compare-versions#wsl-in-the-microsoft-store) WSL，并使用更频繁发布的更新，请使用 `wsl --update`。

![](https://img.xiaorang.fun/202506252201615.png)

## Step 4 - 设置 WSL2 为默认版本

以管理员身份运行 `PowerShell`，输入以下命令：将 WSL2 设置为安装新 Linux 分发版时的默认版本

```shell
wsl --set-default-version 2
```

![](https://img.xiaorang.fun/202502252159284.png)

## Step 5 - 安装 Linux 分发版

> [WSL 的基本命令 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands)

以管理员身份运行 `PowerShell`，输入以下命令进入默认的 Linux 分发版：

```bash
wsl
```

![](https://img.xiaorang.fun/202502252159285.png)

如上图所示，可以看到此时并没有安装任何 Linux 分发版！提示可以使用 `wsl --list --online` 命令列出可用的 Linux 分发版并使用 `wsl --install <Distro>` 命令安装指定的 Linux 分发版。

### 列出可用的 Linux 分发版

运行以下命令：

```bash
wsl --list --online
```

![](https://img.xiaorang.fun/202502252159286.png)

如上图所示，已列出可用的 Linux 分发版，提示可以使用 `wsl --install <Distro>` 命令安装指定的 Linux 分发版。

### 安装指定 Linux 分发版

例如，安装 Ubuntu 22.04：

```bash
wsl --install Ubuntu-22.04
```

![](https://img.xiaorang.fun/202502252159287.png)

耐心等待安装完成即可…，安装完成之后，首次启动新安装的 Linux 分发版时，控制台窗口将打开，系统将要求你等待一到两分钟，以便文件取消压缩并存储在电脑上。不过以后所有的启动过程都将不会超过一秒钟。如果是首次进入的话，则需要**为新的 Linux 分发版创建用户账户和密码**。

### 已安装的 Linux 分发版

```bash
wsl --list --verbose
```

![](https://img.xiaorang.fun/202502252159288.png)

该命令会显示当前系统中所有安装的 WSL 分发版及其运行状态、版本号（WSL 1 或 2）。

### 检查 WSL 状态

```bash
wsl --status
```

![](https://img.xiaorang.fun/202502252159289.png)

使用该命令可查看默认分发和内核版本信息。

## Step 6 - 更换镜像源

为加快软件包的下载速度，可以将默认的 Ubuntu 软件源替换为阿里云镜像源。

1. **进入默认的 Linux 发行版**：在 Windows PowerShell 中运行 `wsl` 命令
2. **切换到 `apt` 配置目录**：`cd /etc/apt`
3. **备份原始源文件**：`sudo cp sources.list sources.list.bak`
4. **编辑源配置文件**：`sudo vim sources.list`
5. **替换软件源地址**：
	1. 使用 `:` → `%s/security.ubuntu/mirrors.aliyun/g` 全局替换 `security.ubuntu`
	   ![](https://img.xiaorang.fun/202502252159300.png)
	2. 使用 `:` → `%s/archive.ubuntu/mirrors.aliyun/g` 全局替换 `archive.ubuntu`
	   ![](https://img.xiaorang.fun/202502252159301.png)
6. **保存并退出**：`:wq`
7. **更新软件包索引**：`sudo apt-get update`
   ![](https://img.xiaorang.fun/202502252159302.png)
8. **升级已安装的软件包**：`sudo apt-get upgrade`
   ![](https://img.xiaorang.fun/202502252159303.png)

## Step 7 - 使用 Oh My Zsh 美化终端

[Oh My Zsh](https://github.com/ohmyzsh/ohmyzsh/wiki) 是一个开源的、由社区驱动的框架，用于管理和增强你的 [Zsh](https://www.zsh.org/) 配置，提供丰富的主题和插件，极大提升终端使用体验。

### Zsh

#### 安装 Zsh

在使用 Oh My Zsh 之前，需先确保已安装 Zsh。以 Ubuntu 为例，执行以下命令安装：

```bash
sudo apt install zsh -y
```

安装完成后，验证版本：

```bash
zsh --version
```

期望输出：

```bash
zsh 5.0.8（或更高版本）
```

#### 设置 Zsh 为默认 Shell

运行以下命令将 Zsh 设置为默认登录 Shell：

```bash
sudo chsh -s $(which zsh)
```

> [!note]
> - 若 Zsh 不在 `/etc/shells` 中或当前用户无权限执行 `chsh`，则需使用其他方式设置默认 Shell。
> - 也可直接运行 `chsh`，然后手动输入 `/bin/zsh` 设置。

设置后请 **注销并重新登录** 或重新打开终端使设置生效。

#### 验证是否生效

1. 查看当前默认 Shell 路径：

	```bash
	echo $SHELL
	```

	期望输出：`/bin/zsh`（或类似路径）
2. 查看版本确认：

	```bash
	$SHELL --version
	```

	期望输出：`zsh 5.8`（或更新版本）

#### 配置常用别名

在 `~/.zshrc` 中添加如下别名配置：

```bash file:.zshrc
alias ll="ls -alF"
alias rm="rm -i"
```

添加后执行以下命令使配置立即生效：

```bash
source ~/.zshrc
```

### Oh My Zsh

#### 安装 Oh My Zsh

在安装 Zsh 后，执行以下命令即可安装 Oh My Zsh：

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

该命令会自动执行以下操作：

1. 克隆 Oh My Zsh 仓库至 `~/.oh-my-zsh`；
2. 如存在 `.zshrc` 文件，会备份为 `.zshrc.pre-oh-my-zsh`；
3. 创建新的 `.zshrc`，设置默认主题和插件（如 `git`）；
4. 自动将默认 shell 设置为 `zsh`（若当前不是）。

![](https://img.xiaorang.fun/202506261311761.png)

> [!tip] 安装前建议
> 如果你首次进入 zsh，出现 `zsh-newuser-install` 提示，建议先按 `0` 创建一个空的 `.zshrc`，避免后续干扰 Oh My Zsh 的安装流程（安装脚本仍会自动备份原 `.zshrc`）。

#### 确认是否安装成功

安装完成后，执行以下命令确认：

```bash
echo $ZSH
```

若输出为 `~/.oh-my-zsh` 路径，说明安装成功。

#### 插件安装

1. **语法高亮插件**：

	```bash
	git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/plugins/zsh-syntax-highlighting
	```

2. **命令建议插件**：

	```bash
	git clone https://github.com/zsh-users/zsh-autosuggestions.git ~/.oh-my-zsh/plugins/zsh-autosuggestions
	```

3. **启用插件（修改 `.zshrc` 中插件列表）**：

	```bash
	sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/g' ~/.zshrc
	```
