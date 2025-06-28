---
tags:
  - DevKit/内网穿透工具
update_time: 2025/06/28 23:42
create_time: 2025-06-28T23:39:00
priority: 1
---

> [!quote]
> - Github 仓库地址： [一款轻量级、高性能、功能强大的内网穿透代理服务器](https://github.com/ehang-io/nps) 🚀
> - 项目文档地址： [https://ehang-io.github.io/nps/#/](https://ehang-io.github.io/nps/#/)
> - 参考资料
> 	- [超轻量级NPS内网穿透自带后台设置界面，超好用FRP可以下台了](https://www.bilibili.com/video/BV11t411K7Cg?vd_source=84272a2d7f72158b38778819be5bc6ad)
> 	- [一键实现内网穿透：NPS内网穿透工具的完整使用指南](https://www.bilibili.com/video/BV1Ed4y1f7jZ?vd_source=84272a2d7f72158b38778819be5bc6ad)

nps 是一款高性能、功能丰富的内网穿透代理服务器，支持 **TCP / UDP 流量转发**，可用于：

- 访问内网网站、本地支付接口调试
- SSH 远程访问、远程桌面
- 内网 DNS 解析、HTTP / SOCKS5 代理
- P2P 直连等

并提供 **Web 管理端**，简化配置与管理。

### 快速入门

#### Linux 服务器端

##### 安装

- 下载[安装包](https://github.com/ehang-io/nps/releases/download/v0.26.10/linux_amd64_server.tar.gz)
- 上传至 `/opt` 目录
- 解压：

	```bash
	mkdir nps-server & tar -zxvf linux_amd64_server.tar.gz -C ./nps-server
	```

##### 启动 & 访问

- 启动服务：

	```bash
	sudo nps start
	```

- 访问控制台：`http://<服务器ip>:port`（默认端口 8080）
- 默认账号：`admin / 123`（请务必修改密码！）
  ![](https://img.xiaorang.fun/202502222239164.png)

> [!note]
> 若无法访问，请检查端口是否开放。若未开放，可前往云厂商控制台 → 防火墙 → 开放 8080 端口。

##### 停止 & 重启

```bash
sudo nps stop      # 停止服务
sudo nps restart   # 重启服务
```

##### 添加客户端

在管理后台创建客户端后，会生成客户端连接命令，如下图所示：
![](https://img.xiaorang.fun/202502222239165.png)

此时，客户端仍为 "离线" 状态，需在客户端设备上执行生成的连接命令以完成接入。

#### Windows 客户端

##### 安装

1. 下载[安装包](https://github.com/ehang-io/nps/releases/download/v0.26.10/windows_amd64_client.tar.gz)
2. 解压并进入解压目录

##### 启动

1. 在 Web 管理端，点击客户端前的 **"+"** 号，复制启动命令
2. 以管理员身份在 CMD 或 Git Bash 中执行启动命令安装
   ![](https://img.xiaorang.fun/202502222239166.png)

> [!note]
> 若使用 Windows PowerShell，请用**引号括起 IP**。

##### 注册为系统服务（开机自启）

1. **注册服务**（以管理员身份运行 CMD / Git Bash）：

	```bash
	./npc install -server=<服务器IP>:<端口> -vkey=<密钥> -type=tcp
	```

2. 启动服务：

	```bash
	./npc start
	```

3. 停止服务：

	```bash
	./npc stop
	```

> [!warning]
> 若更改连接信息，需先卸载再重新注册：
> ```bash
> ./npc uninstall
> ```

### 使用

#### [域名解析](https://ehang-io.github.io/nps/#/example?id=域名解析)

**适用场景**：<u>小程序开发</u>、<u>微信公众号开发</u>、产品演示

> [!warning]
> 该模式使用 **HTTP 反向代理**，并非 DNS 服务器，可在 Web 端灵活配置。

##### 示例：内网站点映射到自定义域名

环境信息：
- **域名**：`fun.xiaorang`
- **公网服务器**：`117.72.106.71`
- **内网开发站点**：`127.0.0.1:8888`
- **目标**：通过 `mp.fun.xiaorang` 访问 `127.0.0.1:8888`

**配置步骤**：
1. 解析 `*.fun.xiaorang` 到公网服务器 `117.72.106.71`
   ![](https://img.xiaorang.fun/202502222239167.png)
2. 在 Web 管理端 → 进入客户端 → 域名管理 → 添加解析规则：
   - **域名**：`mp.fun.xiaorang`
   - **内网目标**：`127.0.0.1:8888`

	![](https://img.xiaorang.fun/202502222239168.png)

访问 `mp.fun.xiaorang` 即可成功映射至 `127.0.0.1:8888`！🎉🎉🎉
