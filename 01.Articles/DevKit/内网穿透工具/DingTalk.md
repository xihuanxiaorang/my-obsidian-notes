---
tags:
  - DevKit/内网穿透工具
create_time: 2025/06/28 23:36
update_time: 2025/07/04 23:02
priority: 999
---

> [!quote]
> 官方文档（已废弃）：[内网穿透（测试版） - 开放平台](https://open.dingtalk.com/document/resourcedownload/http-intranet-penetration)

## 内网穿透示意图

![](https://img.xiaorang.fun/202506292332336.png)

## 安装与启动

下载客户端：

```bash
git clone https://github.com/open-dingtalk/dingtalk-pierced-client.git
```

启动客户端：

```bash
ding.exe -config=ding.cfg -subdomain=abcde 8080
```

- `-subdomain`：自定义的二级域名前缀，最终映射为 `abcde.vaiwan.com`
- `8080`：本地待代理的服务端口，如你本地服务运行在 `http://localhost:8080`

## 访问地址

启动成功后，将自动生成公网地址：

```bash
http://abcde.vaiwan.com
```

可通过该地址访问你的本地服务，例如：

```bash
http://abcde.vaiwan.com/index.html
```

## 注意事项

1. 访问地址中 **不需要带端口号**，即 `http://abcde.vaiwan.com/`，**不是** `http://abcde.vaiwan.com:8080/`
2. `subdomain` 名称可能已被他人占用，建议使用公司名称或团队拼音，如 `alibaba`、`dingteam` 等，避免冲突
3. 可通过简单的 HTTP 服务验证穿透效果，例如：

	```bash
	# 启动本地 HTTP 服务
	npx http-server .
	# 访问 http://abcde.vaiwan.com/index.html 测试是否映射成功
	```
