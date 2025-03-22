---
tags:
  - DevKit
create_time: 2025-03-22 12:17
update_time: 2025/03/22 18:02
---

## 前期准备

### 下载

前往 [nginx 官方下载页](https://nginx.org/en/download.html)，获取最新稳定版本。
![](https://img.xiaorang.fun/202503221224076.png)

### 编译环境

nginx 依赖 **GCC、PCRE、Zlib、OpenSSL** 进行编译。

```bash
# 安装 GCC（nginx 由 C 语言编写）
yum install -y gcc gcc-c++

# 安装 PCRE（用于正则解析）
yum install -y pcre pcre-devel

# 安装 Zlib（支持 HTTP Gzip 压缩）
yum install -y zlib zlib-devel

# 安装 OpenSSL（支持 HTTPS）
yum install -y openssl openssl-devel
```

依赖安装完成后，即可进行源码编译安装。

## 安装

### 上传源码包

将 `nginx-1.26.3.tar.gz` 压缩包上传至服务器 `/usr/local` 目录（可使用 [MobaXterm](https://mobaxterm.mobatek.net/)）。
![](https://img.xiaorang.fun/202503221259199.png)

### 解压源码包

```bash
tar -zxvf nginx-1.26.3.tar.gz
```

![](https://img.xiaorang.fun/202503221308039.png)

### 配置编译选项

`./configure` 负责检查依赖并生成 `Makefile`，可根据需求调整编译参数，为后续 `make` 编译做准备。

**常见参数**：可使用 `./configure --help` 查看全部选项，以下是常用的：

```bash
./configure \
--prefix=/usr/local/nginx \   # 指定安装目录
--with-http_ssl_module \      # 启用 HTTPS（需 OpenSSL）
--with-http_gzip_static_module \  # 支持 Gzip 静态压缩
--with-stream \               # 支持 TCP/UDP 代理
--with-http_v2_module         # 启用 HTTP/2
```

若仅需默认配置，直接运行：

```bash
./configure
```

![](https://img.xiaorang.fun/202503221312406.png)

### 编译 & 安装

```bash
make && make install
```

- `make`：根据 `./configure` 生成的 `Makefile` 进行源码编译。
- `make install`：将编译后的文件安装至 `--prefix` 指定的目录（默认 `/usr/local/nginx`）。

🔍检查是否安装成功：

```bash
/usr/local/nginx/sbin/nginx -v
```

若输出 nginx 版本号，则安装成功。
![](https://img.xiaorang.fun/202503221657818.png)

## 启动 & 关闭

### 启动

```bash
/usr/local/nginx/sbin/nginx
```

默认后台运行，监听 `80` 端口。

### 关闭

- **立即终止（可能会中断请求）**

	```bash
	/usr/local/nginx/sbin/nginx -s stop
	```

- **优雅停止（处理完当前请求后退出）**

	```bash
	/usr/local/nginx/sbin/nginx -s quit
	```

### 重启

- **平滑重启（不影响当前连接）**

	```bash
	/usr/local/nginx/sbin/nginx -s reload
	```

- **强制重启（先停止再启动）**

	```bash
	/usr/local/nginx/sbin/nginx -s stop && /usr/local/nginx/sbin/nginx
	```

### 检查运行状态

**方式一：查看进程**

```bash
ps -ef | grep nginx
```

**master** 进程 + **worker** 进程表示 nginx 正常运行。
![](https://img.xiaorang.fun/202503221745774.png)

**方式二：查看端口监听**

```bash
netstat -tulnp | grep nginx
```

默认监听 `80`（HTTP）和 `443`（HTTPS）。
![](https://img.xiaorang.fun/202503221745775.png)

**方式三：测试本地访问**

```bash
curl -I http://localhost
```

若返回 `200 OK`，说明 nginx 运行正常。
![](https://img.xiaorang.fun/202503221745776.png)

## 防火墙配置（CentOS 6）

### 检查防火墙状态

```bash
service iptables status
```

- **若输出规则列表**，说明 `iptables` 已启用。
- **若显示 `iptables: Firewall is not running.`**，说明防火墙未启动，可使用 `service iptables start` 启动。

### 开放 nginx 端口

```bash
iptables -I INPUT -p tcp --dport 80 -j ACCEPT
iptables -I INPUT -p tcp --dport 443 -j ACCEPT
```

**若 nginx 使用非默认端口（如 `8080`），需手动添加：

```bash
iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
```

### 保存防火墙规则（防止重启丢失）

```bash
service iptables save
service iptables restart
```

![](https://img.xiaorang.fun/202503221802964.png)

### 查看防火墙规则

```bash
iptables -L -n --line-numbers
```

若 `INPUT` 规则中包含 `ACCEPT`，则端口已开放。
![](https://img.xiaorang.fun/202503221802965.png)

### 关闭防火墙（不推荐）

```bash
service iptables stop
chkconfig iptables off  # 禁止开机启动
```

> [!warning]
> 关闭防火墙可能导致安全风险，建议仅在受控环境下执行。
