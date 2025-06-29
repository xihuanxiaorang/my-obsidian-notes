---
tags:
  - DevKit/内网穿透工具
update_time: 2025/06/29 23:23
create_time: 2025-06-28T23:39:00
priority: 1
---

> [!quote]
> - Github 仓库：[轻量、高性能、功能强大的内网穿透代理服务器](https://github.com/ehang-io/nps) 🚀
> - 项目文档：[https://ehang-io.github.io/nps/#/](https://ehang-io.github.io/nps/#/)

`nps` 是一款高性能、功能丰富的内网穿透代理服务器，支持 **TCP / UDP 流量转发**，适用于：

- 访问内网网站、本地支付接口调试
- SSH、远程桌面连接
- 内网 DNS 解析、HTTP / SOCKS5 代理
- P2P 直连等场景

内置 **Web 管理界面**，配置更直观，管理更便捷。

### 快速入门

#### Linux 服务端

##### 安装

- 下载[安装包](https://github.com/ehang-io/nps/releases/download/v0.26.10/linux_amd64_server.tar.gz)
- 上传至 `/opt` 目录并解压：

	```bash
	mkdir nps-server & tar -zxvf linux_amd64_server.tar.gz -C ./nps-server
	```

##### 启动 & 访问

- 启动服务：

	```bash
	sudo nps start
	```

- 访问控制台：`http://<服务器ip>:port`（默认端口 8080）
- 默认账号：`admin / 123`（**请务必修改密码！**）
  
![](https://img.xiaorang.fun/202502222239164.png)

> [!note]
> 若无法访问，请检查是否开放了 8080 端口（可在云厂商防火墙设置中放行）。

##### 服务控制

```bash
sudo nps stop      # 停止服务
sudo nps restart   # 重启服务
```

##### 添加客户端

在管理后台创建客户端后，会生成客户端连接命令：
![](https://img.xiaorang.fun/202502222239165.png)

客户端初始为"离线"，需在客户端设备上执行该命令才能完成连接。

#### Windows 客户端

##### 安装

1. 下载[安装包](https://github.com/ehang-io/nps/releases/download/v0.26.10/windows_amd64_client.tar.gz)
2. 解压并进入解压目录

##### 启动连接

1. 在 Web 控制台，点击客户端前的 **"+"** 复制连接命令
2. 以管理员身份在 CMD / Git Bash 执行该命令
   ![](https://img.xiaorang.fun/202502222239166.png)

> [!note]
> 使用 PowerShell 时，请用**引号括起服务器地址**。

##### 注册为系统服务（开机自启）

```bash
./npc install -server=<服务器IP>:<端口> -vkey=<密钥> -type=tcp  # 注册服务
./npc start                                                   # 启动服务
./npc stop                                                    # 停止服务
```

> [!warning]
> 若连接信息有变，需先卸载再重新注册：
> ```bash
> ./npc uninstall
> ```

### 使用指南

#### [域名解析映射](https://ehang-io.github.io/nps/#/example?id=域名解析)

**适用场景**：<u>小程序开发</u>、<u>微信公众号开发</u>、产品演示

> [!warning]
> 该模式使用 **HTTP 反向代理**，并非 DNS 服务器，可在 Web 端灵活配置。

##### 示例：将内网站点映射到自定义域名

环境信息：
- **公网域名**：`fun.xiaorang`
- **服务器 IP**：`117.72.106.71`
- **内网站点**：`127.0.0.1:8888`

**配置步骤**：
1. 域名解析：将 `*.fun.xiaorang` 解析至公网服务器 `117.72.106.71`
   ![](https://img.xiaorang.fun/202502222239167.png)
2. Web 管理端配置，进入客户端 → 域名管理 → 添加解析规则：
   - **域名**：`mp.fun.xiaorang`
   - **内网目标**：`127.0.0.1:8888`

	![](https://img.xiaorang.fun/202502222239168.png)

配置完成后，通过 `mp.fun.xiaorang` 访问，即可成功映射到内网服务！🎉🎉🎉
