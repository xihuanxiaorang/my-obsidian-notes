---
tags:
  - DevKit/Docker
create_time: 2025-06-27T19:08:00
update_time: 2025/06/28 23:25
priority: 21
---

[Redis](https://redis.io/) 是全球最快的数据平台。它为缓存、向量搜索和 NoSQL 数据库提供云和本地解决方案，可以无缝集成到任何技术栈中——使数字客户能够轻松构建、扩展和部署我们世界中使用的快速应用程序。

## 查看可用的 Redis 版本

> 📦 Docker Hub 镜像仓库：[https://hub.docker.com/_/redis](https://hub.docker.com/_/redis)

使用以下命令列出可用的 Redis 镜像：

```bash
docker search redis
```

输出示例：

```bash hl:1,3
➜  ~ docker search redis
NAME                              DESCRIPTION                                     STARS     OFFICIAL
redis                             Redis is the world’s fastest data platform f…   13336     [OK]
redis/redis-stack-server          redis-stack-server installs a Redis server w…   96
redis/redis-stack                 redis-stack installs a Redis server with add…   153
redis/redisinsight                Redis Insight - our best official GUI for Re…   33
bitnami/redis                     Bitnami container image for Redis               340
redis/rdi-api                                                                     0
redis/rdi-monitor                                                                 0
redis/rdi-operator                                                                0
redis/rdi-collector-api                                                           0
redislabs/redis                   Clustered in-memory database engine compatib…   44
redis/rdi-collector-initializer    Init container for RDI Collector               0
redis/rdi-processor                                                               1
circleci/redis                    CircleCI images for Redis                       17
redis/rdi-cli                                                                     0
bitnamicharts/redis               Bitnami Helm chart for Redis(R)                 25
cimg/redis                                                                        2
redis/redis-di-cli                                                                0
ubuntu/redis                      Redis, an open source key-value store. Long-…   23
dtagdevsec/redis                  T-Pot Redis                                     0
elestio/redis                     Redis, verified and packaged by Elestio         1
redis/debezium-server                                                             0
mcp/redis                         Access to Redis database operations.            8
redis/kube-webhook-certgen                                                        0
chainguard/redis                  Build, ship and run secure software with Cha…   1
redis/reloader                                                                    0
➜  ~   
```

- **NAME**：镜像名称
- **DESCRIPTION**：镜像简介
- **STARS**：社区用户评分，越高表示越受欢迎
- **OFFICIAL**：是否为官方镜像（`[OK]` 表示官方发布）

> [!tip]
> 建议使用官方 `redis` 镜像（带 `[OK]` 标记）进行开发部署。

## 拉取 Redis 镜像

拉取最新官方镜像（默认标签为 `latest`，可省略）：

```bash
docker pull redis
```

输出示例：

```bash hl:1,12
➜  ~ docker pull redis
Using default tag: latest
latest: Pulling from library/redis
b222156a9022: Pull complete
11c0ea983116: Pull complete
dad67da3f26b: Pull complete
b90a44fe26dc: Pull complete
093c29d9fea9: Pull complete
4bce6440352d: Pull complete
4f4fb700ef54: Pull complete
Digest: sha256:1b835e5a8d5db58e8b718850bf43a68ef5a576fc68301fd08a789b20b4eecb61
Status: Downloaded newer image for redis:latest
docker.io/library/redis:latest
➜  ~      
```

如需拉取指定版本（推荐明确版本号避免未来升级导致兼容问题）：

```bash
docker pull redis:7.0.15
```

> [!tip]
> 可在 [Docker Hub](https://hub.docker.com/_/redis/tags) 查看所有可用版本标签。

## 查看本地镜像

```bash
docker images
```

输出示例：

```bash hl:1,3
➜  ~ docker images
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
redis        latest    1b835e5a8d5d   4 weeks ago    188MB
➜  ~                
```

- **REPOSITORY**：镜像仓库名
- **TAG**：版本标签（如 latest、8.0）
- **IMAGE ID**：镜像 ID
- **CREATED**：镜像创建时间
- **SIZE**：镜像大小

## 准备工作

### 创建专用目录

创建 Redis 专用目录，用于挂载配置文件与数据文件：

```bash
sudo mkdir -p /data/redis/{conf,data}
```

> [!tip]
> 建议将数据与配置集中管理，便于备份、迁移和版本控制。

### 创建配置文件

```bash
sudo vim /data/redis/conf/redis.conf
```

```text file:/data/redis/conf/redis.conf
bind 0.0.0.0
daemonize no
protected-mode yes
requirepass 123456
```

- `bind 0.0.0.0`：允许任意 IP 连接 Redis（默认仅监听本地 `127.0.0.1`）。
- `daemonize no`：禁用守护进程模式。**容器中必须设为 `no`，否则 Redis 将转入后台，容器会因主进程退出而停止**。
- `protected-mode yes`：启用保护模式。未设置密码或未绑定本地地址时，将拒绝远程连接。
- `requirepass 123456`：设置访问密码，客户端需通过 `AUTH` 命令验证身份。

> [!note]
> 若开放 Redis 端口至公网，**务必设置强密码、限制 IP、启用防火墙等安全防护措施**，防止未授权访问与远程攻击。

## 启动 Redis 容器

使用以下命令启动一个**后台运行**的 Redis 容器，支持**系统重启自动启动**，并**挂载本地数据与配置文件** 实现持久化：

```bash
docker run -d \
  --restart always \
	--name redis \
	-p 6379:6379 \
	-v /data/redis/conf/redis.conf:/etc/redis/redis.conf \
	-v /data/redis/data:/data \
  redis \
  redis-server /etc/redis/redis.conf
```

参数说明：
- `-d`：**后台运行容器**
	- 启用 **"detached 模式"**，容器在**后台运行**，终端不被阻塞。
	- 执行后会返回容器 ID，而非实时日志。
	- 即使关闭终端或断开 SSH 连接，容器也会继续运行，**除非你使用 `docker stop` 或 `docker rm` 明确停止或删除它**。
	- 常用于运行长期驻留的服务，如数据库、Web 服务等。
- `--restart`：**自动重启策略**
	- `no`（默认）：不自动重启，主机重启后容器保持停止。
	- `on-failure`：仅在异常退出时重启（可指定最大重启次数，如 `on-failure:3`）。
	- `always`：无论退出原因均重启，适合守护型服务。
	- `unless-stopped`：容器将在 Docker 启动时自动重启，除非之前手动停止。
- `--name`：**给容器命名**
	- 指定自定义名称，便于管理和引用，例如：

		```bash
		docker stop redis
		docker logs redis
		docker exec -it redis redis-cli
		```

	- 名称需唯一，仅支持字母、数字、短横线（`-`），不能包含空格或特殊字符。
- `-p 6379:6379`：**端口映射**
	- 语法格式：`-p <宿主机端口>:<容器端口>`。
	- 将**容器内部的 6379 端口**映射到**宿主机（物理机或主系统）的 6379 端口**，允许你从宿主机或其他主机访问 Redis 服务。
- `-v`：**挂载本地目录实现数据持久化**
	- `/data/redis/data:/data`：挂载数据目录，**持久化存储键值数据**，防止容器删除后数据丢失。
	- `/data/redis/conf/redis.conf:/etc/redis/redis.conf`：挂载配置文件，**支持自定义参数（如访问密码、监听地址等）**，满足灵活配置需求。
- `redis-server /etc/redis/redis.conf`：**启动命令**
	- 指定 Redis 启动时加载自定义配置文件，替代默认内置配置。

## 验证容器是否启动成功

运行以下命令查看正在运行的容器：

```bash
docker ps
```

输出示例：

```bash hl:1,3
➜  ~ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED             STATUS             PORTS                                         NAMES
f0c22226fe72   redis     "docker-entrypoint.s…"   6 minutes ago       Up 6 minutes       0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp   redis
➜  ~    
```

- **CONTAINER ID**：容器的唯一标识符（通常显示前 12 位）。
- **IMAGE**：容器使用的镜像名称（如 `redis`）。
- **COMMAND**：容器启动时执行的默认命令。
- **CREATED**：容器的创建时间。
- **STATUS**：容器的当前运行状态（如 `Up` 表示正在运行）。
- **PORTS**：端口映射详情（例如将容器的 6379 端口映射到宿主机的 6379）。
- **NAMES**：容器的自定义名称（此例为 `redis`）。

> [!tip]
> 如果未看到任何输出，说明没有正在运行的容器。可以使用 `docker ps -a` 命令查看所有容器，包括已停止的。

## 测试连接

```bash hl:1-5
➜  ~ docker exec -it redis redis-cli
127.0.0.1:6379> keys *
(error) NOAUTH Authentication required.
127.0.0.1:6379> auth 123456
OK
127.0.0.1:6379> keys *
1) "name"
127.0.0.1:6379> get name
"xiaorang"
127.0.0.1:6379> exit
➜  ~      
```

至此，Docker 版 Redis 服务安装成功！🎉🎉🎉
