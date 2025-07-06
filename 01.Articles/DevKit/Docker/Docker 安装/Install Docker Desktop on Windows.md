---
tags:
  - DevKit/Docker
create_time: 2025/06/28 22:21
update_time: 2025/07/06 22:40
priority: 2
---

前期准备：『 [[WSL2]] 』

## 安装 Docker Desktop

> 👉 官方指南：
> - [Install Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
> - [WSL 上的 Docker 容器入门 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers)

Docker Desktop 是 Windows 上的官方图形化 Docker 工具，支持 WSL2 后端。安装后你可以：

- 在 Linux 子系统中运行 Docker 容器；
- 使用 VSCode 调试容器；
- 使用浏览器（如 Microsoft Edge）直接访问容器服务；

前往 [Docker Desktop 官网](https://docs.docker.com/docker-for-windows/wsl/#download) 下载并安装，根据引导完成安装与初始化配置。

### 自定义安装目录（可选）

如需自定义安装路径，推荐在 **PowerShell** 中使用以下命令：

```bash
Start-Process -Wait -FilePath "Docker Desktop Installer.exe" -ArgumentList 'install', '--installation-dir=E:\devsoft\Docker'
```

参数说明：
- `-Wait`：等待安装完成后再继续执行；
- `-FilePath`：安装程序路径，建议使用绝对路径；
- `-ArgumentList`：传递安装参数，多个参数用英文逗号分隔。

如果使用 **CMD**，可执行：

```bash
start /w "" "Docker Desktop Installer.exe" install --installation-dir=E:\devsoft\Docker
```

参数说明：
- `start /w`：启动安装程序并等待其执行完毕；
- `""`：窗口标题占位符，**必须存在**；
- `"Docker Desktop Installer.exe"`：安装程序文件名，可用绝对路径；
- `install`：表示执行安装操作；
- `--installation-dir=E:\devsoft\Docker`：指定安装目录（默认为 `C:\Program Files\Docker`）。

> [!tip]
> 请以 **管理员身份** 运行终端，避免权限问题导致安装失败。

## 启用 WSL2 后端支持

依次进入："设置" → "常规" → 勾选 "使用基于 WSL2 的引擎"
![](https://img.xiaorang.fun/202506302253829.png)

## 启用 WSL 分发版集成

依次进入："设置" → "资源" → "WSL 集成 "，勾选你要启用 Docker 的 WSL2 分发版（如 Ubuntu）。
![](https://img.xiaorang.fun/202506302253831.png)

## 验证 Docker 是否成功安装

打开已启用 Docker 的 WSL2 分发版（如 Ubuntu），执行：

```bash
docker --version
```

![](https://img.xiaorang.fun/202502252159306.png)

运行以下命令测试 Docker 是否可正常运行：

```bash
docker run hello-world
```

![](https://img.xiaorang.fun/202502252159307.png)

## 更改镜像存储路径（可选）

Docker Desktop 默认在以下路径保存镜像和容器数据：

```text
C:\Users\<用户名>\AppData\Local\Docker\wsl
```

其中包含两个 `.vhdx` 虚拟磁盘文件：
- `docker-desktop`
- `docker-desktop-data`

![](https://img.xiaorang.fun/202506302253832.png)

如需迁移至其他磁盘（如 D 盘），，可在设置 → Resources → Advanced → Disk Image Location 中更改路径，例如：

```text
E:\devsoft\Docker\DockerDesktopWSL
```

![](https://img.xiaorang.fun/202506302253833.png)

点击 **Apply & Restart** 应用更改并重启 Docker。

## 配置镜像加速器（可选）

为提升镜像拉取速度，建议配置国内加速源：

1. 依次进入："设置" → "Docker 引擎"
2. 添加 `registry-mirrors` 字段：

	```json hl:9-12
	{
	  "builder": {
	    "gc": {
	      "defaultKeepStorage": "20GB",
	      "enabled": true
	    }
	  },
	  "experimental": false,
	  "registry-mirrors": [
	    "https://docker.1ms.run",
	    "https://docker.xuanyuan.me"
	  ]
	}
	```

	![](https://img.xiaorang.fun/202507062240015.png)

3. 点击 **Apply & Restart** 应用更改并重启 Docker。
