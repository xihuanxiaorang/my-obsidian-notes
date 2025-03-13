---
tags:
  - Tool
create_time: 2025-03-07 18:14
update_time: 2025/03/13 19:02
refrence_url:
  - https://curl.se/docs/tutorial.html
  - https://www.ruanyifeng.com/blog/2019/09/curl-reference.html
---

## 简介

[curl](https://curl.se/) 是一个强大且灵活的网络请求工具，提供了命令行工具 `curl` 和一个名为 `libcurl` 的库，适用于多种编程语言（如 C、Python、PHP）。

🚀🚀🚀**特点**：

- **跨平台支持**：可在 Windows、macOS 和 Linux 运行。
- **支持多种协议**：涵盖 HTTP、HTTPS、FTP、SFTP、LDAP、SMB 等。
- **功能强大**：支持 API 调试、数据上传下载、代理配置等。
- **广泛应用**：在 DevOps、自动化测试、服务器运维等领域发挥重要作用。

## 安装

Windows 10（自 1803 版）和 Windows 11 已预装 curl，可使用以下命令检查版本：

```bash
curl --version
```

如需更新或重新安装，可从 [curl 官网](https://curl.se/)下载最新版本。

## 基本用法

> [!quote]
> [JSONPlaceholder - Free Fake REST API](https://jsonplaceholder.typicode.com) 是一个用于测试和原型设计的免费 REST API，提供虚拟的 JSON 数据，适用于前后端开发。

### 发送 GET 请求

```bash
curl -X GET https://jsonplaceholder.typicode.com/posts/1
```

该命令使用 `curl` 发送 `GET` 请求，获取 ID 为 `1` 的帖子数据。执行后，服务器返回 JSON 格式的响应，如下所示：
![](https://img.xiaorang.fun/202503081858934.png)

说明：
- `-X`（或 `--request`）参数用于指定 HTTP 请求方法。
- `curl` 默认使用 `GET` 请求，因此 `-X GET` 可省略，但 `POST`、`PUT`、`DELETE` 等请求需显式指定。

### 发送 POST 请求

```bash
curl -X POST https://jsonplaceholder.typicode.com/posts -H "Content-Type: application/json" -d '{"title":"foo", "body":"bar", "userId":1}'
```

该命令向服务器发送 `POST` 请求，创建一条新的帖子数据。执行后，服务器返回新创建的资源信息：
![](https://img.xiaorang.fun/202503081858936.png)

说明：
- `-X`（或 `--request`）参数用于指定 HTTP 请求方法，如 `-X POST` 发送 POST 请求。
- `-H`（或 `--header`）参数用于添加 HTTP 请求头，如 `-H "Content-Type: application/json"` 声明请求体格式为 JSON。
- `-d`（或 `--data`）用于发送请求体数据，通常用于 POST 和 PUT 请求。

## 进阶用法

### 下载文件

```bash
curl -O http://www.example.com/index.html
```

该命令从 `http://www.example.com/index.html` 下载文件，并保留原文件名 `index.html` 存储到当前目录。
![](https://img.xiaorang.fun/202503081858938.png)

说明：
- `-O`（或 `--remote-name`）会使用服务器上的原始文件名保存文件。
- 若需自定义文件名，可使用 `-o` 参数，例如：

	```bash
	curl -o mypage.html http://www.example.com/index.html
	```

	![](https://img.xiaorang.fun/202503091756795.png)

### 断点续传

```bash
curl -C - -O https://download.microsoft.com/download/4/6/8/4681f3b2-f327-4d3d-8617-264b20685be0/SSMS-Setup-ENU.exe
```

该命令用于从 Microsoft 官方网站下载 SQL Server Management Studio (SSMS) 安装程序，并启用断点续传。如果下载过程中断开（通过关闭无线/有线网络，模拟网络不稳定的情况），执行相同命令后，curl 将从中断处继续下载，而不是重新下载整个文件。

![](https://img.xiaorang.fun/202503091837814.png)

说明：
- `-C -`（或 `--continue-at -`）表示启用断点续传功能，`curl` 会自动检测已下载的部分并从中断位置继续下载。
- `-O` 表示使用服务器提供的原始文件名 `SSMS-Setup-ENU.exe` 保存下载文件。
