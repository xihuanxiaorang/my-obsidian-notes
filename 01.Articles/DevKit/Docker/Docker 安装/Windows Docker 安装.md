---
tags:
  - DevKit/Docker
create_time: 2025-06-28T22:21:00
update_time: 2025/06/28 22:51
priority: 1
---

前期准备：『 [[WSL2]] 』

### 安装 Docker Desktop

> 👉 官方指南：[WSL 上的 Docker 容器入门 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers)

借助 **Docker Desktop for Windows** 对 WSL2 的支持，你可以：

- 在 Linux 环境中开发和运行容器；
- 使用 Visual Studio Code 进行容器调试；
- 通过 Windows 的浏览器（如 Microsoft Edge）直接访问容器服务。

前往 [Docker Desktop 官网](https://docs.docker.com/docker-for-windows/wsl/#download) 下载并安装，根据引导完成安装与初始化配置。

### 启用 WSL2 后端支持

依次打开："设置" → "常规" → 勾选 "使用基于 WSL2 的引擎"
![](https://img.xiaorang.fun/202502252159304.png)

### 启用 WSL 分发版的 Docker 集成

依次打开："设置" → "资源" → "WSL 集成 "，勾选你希望启用 Docker 集成的 WSL2 分发版（如 Ubuntu）。
![](https://img.xiaorang.fun/202502252159305.png)

### 验证 Docker 安装是否成功

打开已启用 Docker 的 WSL2 分发版（如 Ubuntu），执行以下命令查看版本信息：

```bash
docker --version
```

![](https://img.xiaorang.fun/202502252159306.png)

运行以下命令测试 Docker 是否可正常运行：

```bash
docker run hello-world
```

![](https://img.xiaorang.fun/202502252159307.png)

### 更改镜像存储位置（可选）

Docker Desktop 默认在以下路径保存容器镜像数据：

```text
C:\Users\<用户名>\AppData\Local\Docker\wsl
```

其中包含两个 `.vhdx` 文件：
- `docker-desktop`
- `docker-desktop-data`

![](https://img.xiaorang.fun/202502252159309.png)

如果希望将镜像存储迁移至其他磁盘（如 D 盘），可点击 **Browse** 选择新路径，例如：

```text
D:\devsoft\WSL\DockerDesktopWSL
```

![](https://img.xiaorang.fun/202502252159310.png)

点击 **Apply & Restart** 重启 Docker Desktop 以应用修改。

### 配置镜像加速器（可选）

为了加快镜像拉取速度，建议配置国内镜像加速源：

1. 依次打开："设置" → "Docker 引擎"
2. 在 JSON 中添加 `registry-mirrors` 字段：

	```json hl:9-14
	 {
		 "builder": {
			 "gc": {
				 "defaultKeepStorage": "20GB",
				 "enabled": true
			 }
		 },
		 "experimental": false,
		 "registry-mirrors": [
			 "http://hub-mirror.c.163.com",
			 "https://docker.mirrors.ustc.edu.cn",
			 "https://registry.docker-cn.com", 
			 "https://mirror.ccs.tencentyun.com"
		 ]
	 }
	 ```

	![](https://img.xiaorang.fun/202502252159308.png)

3. 点击 **Apply & Restart** 重启 Docker Desktop 以使配置生效。
