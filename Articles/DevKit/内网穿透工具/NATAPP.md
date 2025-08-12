---
tags:
  - Tool
  - DevKit/内网穿透工具
update_time: 2025/06/29 23:36
create_time: 2025-06-28T23:38:00
priority: 10
---

> [!quote]
> [NATAPP - 内网穿透工具](https://natapp.cn/) 基于 Ngrok 的国内高速内网映射服务，支持 HTTP、TCP、HTTPS 等协议。

## 注册账号 & 开通隧道

- 登录 [natapp.cn](https://natapp.cn/)，在「我的隧道」中开通一个**免费隧道**；
- 免费隧道每次启动后分配的公网域名**可能变化**；
- 选择你希望映射的本地端口（如 8080）。

## 下载 & 解压客户端

- [点击下载客户端](https://cdn.natapp.cn/assets/downloads/clients/2_3_9/natapp_windows_amd64_2_3_9.zip?version=20230407)
- 解压至任意目录（如 `D:\natapp`）

## 配置客户端（使用本地配置文件）

- 下载示例配置：[config.ini](https://natapp.cn/article/config_ini)
- 将配置文件 `config.ini` 放在 natapp 可执行文件同目录下；
- 修改配置文件中的 `authtoken` 为你在「我的隧道」中看到的 token

## 启动客户端

在终端中运行：

```bash
natapp.exe
```

启动成功后，终端将输出类似如下内容：

```bash
Tunnel Status: online
Forwarding: http://abc123.natappfree.cc -> 127.0.0.1:8080
```

即可通过 `http://abc123.natappfree.cc` 访问你本地的 8080 服务。

> [!note]
> - 免费隧道不支持自定义域名；
> - 若需**固定域名、HTTPS 支持、多个隧道**，可升级至付费套餐；
> - 请勿将敏感或生产服务暴露于公网，注意安全控制。
