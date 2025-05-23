---
tags:
  - DevKit
create_time: 2024-12-28T17:30:00
update_time: 2025/03/19 11:14
---

> [!quote]
> 官方文档教程：[旧版 WSL 的手动安装步骤 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual)

## Step 1 - 启用适用于 Linux 的 Windows 子系统

在 Windows 上安装任何 Linux 发行版之前，必须先启用 " 适用于 Linux 的 Windows 子系统 " 可选功能。

以管理员身份运行 `PowerShell`（" 开始 " 菜单 → "PowerShell" → 单击右键 → " 以管理员身份运行 "），输入以下命令：

```shell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

![](https://img.xiaorang.fun/202502252159282.png)

## Step 2 - 启用虚拟机功能

安装 WSL2 之前，必须启用虚拟机平台可选功能。

> [!important]
> 您的计算机需要具备**虚拟化**功能才能使用此功能。如何开启呢？**进入主板 BIOS 界面** → **启用虚拟化选项**，如果是近几年新买的电脑，该选项默认是打开的。对于该选项每个电脑主板型号不同，设置的方法也不同。所以最好的方法是根据自己的主板型号，去度娘或者谷歌搜索一下开启虚拟化的方法。

以管理员身份运行 `PowerShell`，输入以下命令：

```shell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

![](https://img.xiaorang.fun/202502252159283.png)

执行完成之后务必记得重启一下电脑！！！

## Step 3 - 下载 Linux 内核更新包

Linux 内核更新包安装最新版本的 WSL2 Linux 内核，用于在 Windows 操作系统镜像中运行 WSL。

[WSL2 Linux kernel update package for x64 machines](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

下载完成之后双击运行即可！

## Step 4 - 设置 WSL2 为默认版本

以管理员身份运行 `PowerShell`，输入以下命令：将 WSL2 设置为安装新 Linux 发行版时的默认版本

```shell
wsl --set-default-version 2
```

![](https://img.xiaorang.fun/202502252159284.png)

## Step 5 - 安装 Linux 发行版

[WSL 的基本命令 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands)

1. 以管理员身份运行 `PowerShell`，输入 `wsl` 命令进入默认的 Linux 发行版
   ![](https://img.xiaorang.fun/202502252159285.png)
   如上图所示，可以看到此时并没有安装任何 Linux 发行版！提示可以使用 `wsl --list --online` 命令列出可用的 Linux 发行版并使用 `wsl --install <Distro>` 命令安装指定的 Linux 发行版。
2. 使用 `wsl --list --online` 命令列出可用的 Linux 发行版
   ![](https://img.xiaorang.fun/202502252159286.png)
   如上图所示，已列出可用的 Linux 发行版，提示可以使用 `wsl --install <Distro>` 命令安装指定的 Linux 发行版。
3. 使用 `wsl --install Ubuntu-22.04` 命令安装 Ubuntu 22.04 版本
   ![](https://img.xiaorang.fun/202502252159287.png)
   耐心等待安装完成即可...，安装完成之后，首次启动新安装的 Linux 发行版时，会要求你等待一两分钟，让文件解压缩并存储到电脑上，不过以后所有的启动过程都将不会超过一秒钟。如果是首次进入的话，则需要为你的新 Linux 发行版创建一个**用户账户**和**密码**。
4. 使用 `wsl --list --verbose` 命令列出已安装的 Linux 发行版
   ![](https://img.xiaorang.fun/202502252159288.png)
5. 使用 `wsl --status` 命令检查 WSL 状态
   ![](https://img.xiaorang.fun/202502252159289.png)

## Step 6 - 迁移到非系统盘（可选）

虚拟机（Ubuntu20.04）默认安装在 C 盘 `C:\Users\liulei\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu22.04LTS_79rhkp1fndgsc`，大量占用系统盘的空间，所以决定迁移到其他盘中。
![](https://img.xiaorang.fun/202502252159290.png)

1. 使用 `wsl --shutdown` 终止所有正在运行的发行版和 WSL2 轻量级实用工具虚拟机
   ![](https://img.xiaorang.fun/202502252159291.png)
2. 使用 `wsl --export <Distribution Name> <FileName>` 命令对需要迁移的分发或虚拟机进行导出，其中 `<Distribution Name>` 为目标 Linux 发行版的名称，`<FileName>` 为文件导出路径，例如：`wsl --export Ubuntu-22.04 D:\wsl-Ubuntu-20.04.tar `
   ![](https://img.xiaorang.fun/202502252159292.png)
3. 使用 `wsl --unregister <DistributionName>` 命令注销并卸载 Linux 发行版，其中 `<Distribution Name>` 为目标 Linux 发行版的名称，例如：`wsl --unregister Ubuntu-22.04`

   > [!caution]
   >
   > 取消注册后，与该分发版关联的所有数据、设置和软件将**永久**丢失。

   ![](https://img.xiaorang.fun/202502252159293.png)
   最后再手动删除 C 盘中的该文件夹 `C:\Users\liulei\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu22.04LTS_79rhkp1fndgsc`！
4. 使用 `wsl --import <Distribution Name> <InstallLocation> <FileName> --version 2` 将指定 tar 文件导入为新的发行版并安装在指定路径，其中 `<Distribution Name>` 为目标 Linux 发行版的名称，`InstallLocation` 为安装路径，`<FileName>` 为 tar 文件路径，例如：`wsl --import Ubuntu-22.04 D:\devsoft\WSL\Ubuntu-22.04 D:\wsl-Ubuntu-20.04.tar  --version 2`
   ![](https://img.xiaorang.fun/202502252159295.png)
5. 使用 `wsl` 命令进入默认的 Linux 发行版
   ![](https://img.xiaorang.fun/202502252159296.png)
6. 使用 `wsl --list --verbose` 列出已安装的 Linux 发行版
   ![](https://img.xiaorang.fun/202502252159297.png)
7. 使用 `wsl --status` 命令检查 WSL 状态
   ![](https://img.xiaorang.fun/202502252159298.png)
8. 删除 tar 文件
   ![](https://img.xiaorang.fun/202502252159299.png)

## Step 7 - 更换镜像源

1. 使用 `wsl` 命令进入默认的 Linux 发行版
2. 使用 `cd /etc/apt` 命令进入 `apt` 目录
3. 使用 `cp sources.list sources.list.bak` 命令备份原来的配置文件
4. 使用 `vim sources.list` 命令打开配置文件
5. 使用 `:` → `%s/security.ubuntu/mirrors.aliyun/g` 全局替换 `security.ubuntu`
   ![](https://img.xiaorang.fun/202502252159300.png)
6. 使用 `:` → `%s/archive.ubuntu/mirrors.aliyun/g` 全局替换 `archive.ubuntu`
   ![](https://img.xiaorang.fun/202502252159301.png)
7. 最后使用 `:wq` 命令进行保存并退出
8. 使用 `apt-get update` 命令更新软件列表
   ![](https://img.xiaorang.fun/202502252159302.png)
9. 使用 `apt-get upgrade` 命令更新软件
   ![](https://img.xiaorang.fun/202502252159303.png)

## Step 8 - 安装 Docker Desktop

[WSL 上的 Docker 容器入门 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers)

借助 Docker Desktop for Windows 中支持的 WSL2 后端，可以在基于 Linux 的开发环境中工作并生成基于 Linux 的容器，同时使用 Visual Studio Code 进行代码编辑和调试，并在 Windows 上的 Microsoft Edge 浏览器中运行容器。

具体步骤如下所示：

1. 下载 [Docker Desktop](https://docs.docker.com/docker-for-windows/wsl/#download) 并按照安装说明进行操作
2. 确保在 " 设置 " → " 常规 " 中选中 " 使用基于 WSL2 的引擎 "
   ![](https://img.xiaorang.fun/202502252159304.png)
3. 通过转到 " 设置 " → " 资源 " → "WSL 集成 "，从要启用 Docker 集成的已安装 WSL2 发行版中进行选择
   ![](https://img.xiaorang.fun/202502252159305.png)
4. 若要确认已安装 Docker，请打开 WSL 发行版（例如 Ubuntu），并通过输入 `docker --version` 来显示版本和内部版本号
   ![](https://img.xiaorang.fun/202502252159306.png)
5. 通过使用 `docker run hello-world` 运行简单的内置 Docker 映像，测试安装是否正常工作
   ![](https://img.xiaorang.fun/202502252159307.png)
6. 通过转到 " 设置 " → "Docker 引擎 "，增加 `registry-mirrors` 键值配置国内镜像源，如下所示：

	```shell
	"registry-mirrors": [
	       "http://hub-mirror.c.163.com",
	       "https://docker.mirrors.ustc.edu.cn",
	       "https://registry.docker-cn.com", 
	       "https://mirror.ccs.tencentyun.com"
	   ]
	```

	![](https://img.xiaorang.fun/202502252159308.png)最后点击 "Apply & restart" 按钮并重新启动 Docker Desktop 即可！
7. 迁移到非系统盘 Docker Desktop 通过 WSL2 启动，会自动创建 2 个子系统，分别对应 2 个 vhdx 硬盘映像文件，默认安装在 C 盘 `C:\Users\liulei\AppData\Local\Docker\wsl`
   ![](https://img.xiaorang.fun/202502252159309.png)点击 `Browse` 按钮更换镜像默认存储位置，例如：`D:\devsoft\WSL\DockerDesktopWSL`
   ![](https://img.xiaorang.fun/202502252159310.png)最后点击 "Apply & restart" 按钮并重新启动 Docker Desktop 即可！

## Step 9 - 使用 oh-my-posh 进行终端美化

[Home | Oh My Posh](https://ohmyposh.dev/)

1. 使用 `curl -s https://ohmyposh.dev/install.sh | bash -s` 命令安装 `oh-my-posh` 安装过程中可能会出现如下错误信息：在安装 `oh-my-posh` 时必须先安装 `unzip` 模块
   ![](https://img.xiaorang.fun/202502252159311.png)
   使用 `apt install unzip` 命令安装 `unzip` 模块成功之后，再次尝试使用 `curl -s https://ohmyposh.dev/install.sh | bash -s` 命令安装 `oh-my-posh`。
   ![](https://img.xiaorang.fun/202502252159312.png)
2. 使用 `oh-my-posh font install` 命令安装 [Nerd Fonts](https://www.nerdfonts.com/) 字体，官方推荐安装 [Meslo LGM NF](https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/Meslo.zip) 字体，不过可以根据自己的喜爱选择其他的字体，如 `DejaVuSansMono` 字体！！！
   ![](https://img.xiaorang.fun/202502252159313.png)
   使用⬇️箭头选中 `Meslo` 字体，回车开始安装...如下所示，使用官方这种安装方式会一直卡住不动，因此不是很推荐！
   ![](https://img.xiaorang.fun/202502252159314.png)
   进入 [Releases · ryanoasis/nerd-fonts (github.com)](https://github.com/ryanoasis/nerd-fonts/releases) 页面，选择下载 `Meslo.tar.xz` 包，复制下载链接
   ![](https://img.xiaorang.fun/202502252159315.png)使用 `wget https://slink.ltd/https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/Meslo.tar.xz ` 命令开始下载...
   ![](https://img.xiaorang.fun/202502252159316.png)
   下载完成之后需要使用 `xz -d Meslo.tar.xz` 命令和 `mkdir Meslo & tar -xvf Meslo.tar -C /usr/share/fonts/Meslo` 命令进行两次解压。
   ![](https://img.xiaorang.fun/202502252159317.png)
   使用 `cd /usr/share/fonts/Meslo` 命令 `Meslo` 目录，执行 `mkfontscale` 和 `mkfontdir` 命令，期间遇到错误时根据提示使用 `apt install xfonts-utils` 命令安装 `xfonts-utils` 模块
   ![](https://img.xiaorang.fun/202502252159318.png)
   最后使用 `fc-cache -fv` 命令刷新系统字体缓存，期间遇到错误时根据提示使用 `apt install fontconfig` 命令安装 `fontconfig` 模块
   ![](https://img.xiaorang.fun/202502252159319.png)
3. 配置 Windows Terminal 中的 `Ubuntu-22.04` 使用刚才安装的 `Meslo` 字体，可以参考上篇文章 [[Windows Terminal]]；
4. 配置 Windows Terminal 中的 `Ubuntu-22.04` 应用 `oh-my-posh`；如果你不知道自己目前使用的是哪个 shell，可以使用 `oh-my-posh get shell` 命令进行查看，如下所示：
   ![](https://img.xiaorang.fun/202502252159320.png)
   将以下内容添加到 `~/.bashrc` 文件中：`eval "$(/usr/local/bin/oh-my-posh init bash --config ~/.cache/oh-my-posh/themes/aliens.omp.json)"`，其中的 `aliens` 为选择的主题，可以查看 [Themes | Oh My Posh](https://ohmyposh.dev/docs/themes) 总共有哪些主题，根据自己的喜爱进行更换，最后使用 `exec bash` 命令使配置生效！
   ![](https://img.xiaorang.fun/202502252159321.png)

至此，Windows11 安装 WLS2 就圆满完成啦！🎉🎉🎉
