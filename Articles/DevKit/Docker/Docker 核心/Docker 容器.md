---
tags:
  - DevKit/Docker
create_time: 2025/07/02 12:21
update_time: 2025/07/09 23:41
priority: 11
---

## 列出容器

使用 [`docker container ls`](https://docs.docker.com/reference/cli/docker/container/ls/)（或简写 `docker ps`）命令可**查看本地正在运行的容器**：

```bash
docker container ls [OPTIONS]
```

参数说明：
- `-a, --all`：显示所有容器，包括非运行状态的容器（已退出、已创建未启动、已挂起等）。
- `-q, --quiet`：仅输出容器 ID，适合脚本和管道操作。
- `-f, --filter`：根据条件进行过滤，可多次指定。支持的过滤条件包括：
    - `status=running|exited|paused|created|dead`：根据容器状态筛选。
    - `name=<pattern>`：根据容器名称匹配，支持通配符 `*`。
    - `id=<container_id>`：根据容器 ID 前缀匹配。
    - `ancestor=<image>`：筛选基于指定镜像创建的容器（支持镜像名或 ID）。
    - `label=<key>=<value>`：根据容器标签筛选，可用于多条件组合。
- `--no-trunc`：输出完整（容器 ID、命令等）信息，默认会截断显示。
- `-n, --last <N>`：仅显示最近创建的 `N` 个容器。
- `-s, --size`：显示容器使用的磁盘空间（文件系统占用大小）。

如需查看更多选项说明，请使用：

```bash
docker container ls --help
```

示例 1：列出当前正在运行的容器。

```bash hl:1,3
➜  ~ docker container ls
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                                         NAMES
b25bba8de5c4   redis     "docker-entrypoint.s…"   54 seconds ago   Up 53 seconds   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp   redis
➜  ~  
```

- **CONTAINER ID**：容器的唯一标识符（默认显示前 12 位）。
- **IMAGE**：容器基于的镜像名称（如 `redis`）。
- **COMMAND**：容器启动时执行的默认命令。
- **CREATED**：容器的创建时间。
- **STATUS**：容器当前运行状态（如 `Up` 表示正在运行，`Exited` 表示已退出，`Created` 已创建但未运行）
- **PORTS**：端口映射信息（如将容器的 `6379` 端口映射到宿主机的 `6379`）。
- **NAMES**：容器的名称（如未指定会自动生成）。

示例 2：列出所有容器（包括已退出的）。

```bash hl:1,3
➜  ~ docker container ls -a
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                     PORTS                                         NAMES
9a08f8a39dbc   mysql     "docker-entrypoint.s…"   45 seconds ago   Exited (0) 8 seconds ago                                                 mysql
b25bba8de5c4   redis     "docker-entrypoint.s…"   5 minutes ago    Up 5 minutes               0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp   redis
➜  ~      
```

## 运行容器

使用 [`docker container run`](https://docs.docker.com/reference/cli/docker/container/run/)（或简写 `docker run`）命令可以**基于指定镜像创建并启动一个新容器**：

> [!tip]
> 若指定镜像本地不存在则会自动[[Docker 镜像#拉取镜像|拉取镜像]]。

```bash
docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

参数说明：
- `OPTIONS`
	- `-p, --publish`：**端口映射**
		- 格式：`-p [宿主机IP:]<宿主机端口>:<容器端口>`。
		- 示例：`-p 127.0.0.1:80:8080` 表示将**容器的 `8080` 端口**映射到**宿主机（物理机或主系统）`127.0.0.1` 的 `80` 端口**，仅本机可访问。
		- 若未指定 IP，端口将绑定至所有网络接口（即 `0.0.0.0`），端口将对外完全开放。
	- `--restart`：**容器重启策略**
		- `no`（默认）：容器退出后不自动重启。
		- `on-failure[:max-retries]`：仅在容器异常退出（退出码非 `0`）时自动重启，可通过 `max-retries` 限制最大重启次数。Docker 自身重启不会触发此策略。
		- `always`：无论退出原因，容器始终自动重启。即使手动停止，也会在 Docker 重启后恢复运行。
		- `unless-stopped`：与 `always` 类似，但容器若被手动停止，则不会随 Docker 重启而恢复运行。
	- `--name <name>`：**指定容器名称**
	  - 默认使用自动生成的随机名称。
	  - 使用自定义名称便于管理和操作，如：`docker stop my-redis`。
	  - 名称需唯一，仅支持字母、数字和短横线（`-`），不能包含空格或特殊字符。
	- `-e, --env <key>=<value>`：**设置环境变量**
		- 可多次指定，用于向容器传递运行时所需的配置信息。
	- `-v, --volume <源路径>:<容器路径>`：**挂载数据卷或绑定宿主机目录**
		- 根据 `<源路径>` 格式，支持两种挂载方式：
			- **绑定挂载（Bind Mount）**：若为宿主机上的绝对路径（如 `/data/www`），则将该目录挂载至容器中；
			- **数据卷挂载（Volume Mount）**：若为卷名（如 `mydata`），则挂载具名或匿名数据卷。
				- 若挂载的是非空卷，容器目录中的原始内容将被完全"遮蔽"（并未被删除），无法访问；
				- 若挂载的是空卷，容器目录中的原始内容会在首次挂载时被复制到卷中，仅执行一次；
		- 可实现数据的**持久化存储**（避免因容器删除后导致数据丢失）、**读写共享**与**跨容器复用**。
		- 挂载点（容器内路径）必须为绝对路径，即以 `/` 开头。
		- 若容器路径不存在会自动创建；绑定挂载时，宿主机路径不存在也会自动创建（但不包含文件）。
		- 默认以读写模式（`rw`）挂载，若需只读挂载，可在路径后添加 `:ro`，如：`-v /path:/path:ro`。
	- `-d, --detach`：**后台运行容器**
		- **让容器在后台运行，不阻塞当前终端**。
		- 执行后会返回容器 ID，而非实时日志。若需查看实时日志，可使用 `docker container logs` 命令, 详情见[[#查看日志]]。
		- 即使关闭终端或断开 SSH 连接，容器仍保持运行，**除非显式使用 `docker stop` 或 `docker rm` 明确停止或删除容器**。
	- `--rm`：**容器退出后自动删除**
		- 适用于**一次性任务或临时容器**，避免产生无用残留。
		- 容器运行期间不会被删除，仅在正常退出后自动清理。
- `COMMAND [ARG...]`：**容器启动时执行的命令及其参数**
	- 可用于覆盖镜像中由 Dockerfile 所定义的默认命令（即 `CMD` 指令）。
	- 该命令将作为容器的主进程运行，决定容器的生命周期。
	- 可用于指定启动服务、执行脚本、进入交互式 Shell 等。
	- 如未指定，将执行镜像默认的 `CMD`；若镜像未定义 `CMD` 且运行时未提供命令，则容器将启动失败。

如需查看更多选项说明，请使用：

```bash
docker container run --help
```

示例 1：运行 MySQL 容器。

```bash
docker run -d \
  --restart always \
	--name mysql \
	-p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -v /data/mysql/data:/var/lib/mysql \
  -v /data/mysql/conf/my.cnf:/etc/my.cnf \
  -v /data/mysql/conf/conf.d:/etc/mysql/conf.d \
  mysql
```

- `-e MYSQL_ROOT_PASSWORD=123456` 为数据库的 `root` 超级用户设置初始登录密码。
- `-v /data/mysql/data:/var/lib/mysql`：挂载数据目录，实现数据持久化存储，避免因容器删除后导致数据丢失。
- `-v /data/mysql/conf/my.cnf:/etc/my.cnf`：挂载主配置文件，用于自定义数据库参数。
- `-v /data/mysql/conf/conf.d:/etc/mysql/conf.d`：挂载配置目录，支持加载多个 `.cnf` 文件，便于模块化配置。

示例 2：运行 Redis 容器。

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

- `-v /data/redis/data:/data`：挂载数据目录，实现数据持久化存储，避免因容器删除后导致数据丢失。
- `-v /data/redis/conf/redis.conf:/etc/redis/redis.conf`：挂载配置文件，支持自定义参数（如访问密码、监听地址等），便于灵活配置。
- `redis-server /etc/redis/redis.conf`：容器启动时执行 `redis-server` 命令，并加载指定配置文件作为启动参数。该命令作为容器的主进程（PID 1）运行，确保容器持续保持运行状态。

## 进入容器

使用 [`docker container exec`](https://docs.docker.com/reference/cli/docker/container/exec/)（或简写 `docker exec`）命令，可**在运行的容器中执行指定命令**。

> [!note]
> 若容器未运行，则执行失败。

```bash
docker container exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

参数说明：
- `OPTIONS`：
	- `-i, --interactive`：**保持标准输入开启**
		- 使容器的标准输入保持打开状态，允许向容器实时发送输入。
		- 常与 `-t` 搭配使用（`-it`），以实现交互式终端会话。
		- 单独使用时适合用于管道输入组合操作，如多个容器串联处理文本流。
	- `-t, --tty`：**分配伪终端**
		- 为容器分配一个伪终端（TTY），模拟交互式终端环境，允许程序启用诸如输入回显、颜色高亮、密码隐藏等终端功能。
		- 常与 `-i` 搭配使用（`-it`），用于运行需要交互的程序。
- `COMMAND [ARG...]`：**在容器中执行的命令及其参数**，
	- 指定需要在容器内运行的命令，如 `/bin/sh`、`ps -ef`、`redis-cli` 等。
	- 命令运行完成后退出，不影响容器本身的运行状态。

如需查看更多选项说明，请使用：

```bash
docker container exec --help
```

示例：

```bash hl:1,9
➜  ~ docker container exec -it redis /bin/sh
# redis-cli
127.0.0.1:6379> AUTH 123456
OK
127.0.0.1:6379> keys *
1) "name"
127.0.0.1:6379> exit
# exit
➜  ~ docker container ps
CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS          PORTS                                         NAMES
b25bba8de5c4   redis     "docker-entrypoint.s…"   44 hours ago   Up 43 seconds   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp   redis
➜  ~
```

## 停止容器

使用 [`docker container stop`](https://docs.docker.com/reference/cli/docker/container/stop/)（或简写 `docker stop`）命令，可**优雅地终止运行中的容器**。

```bash
docker container stop [OPTIONS] CONTAINER [CONTAINER...]
```

参数说明：
- `-t, --time <seconds>`：**设置强制终止前的等待时间（默认：10 秒）**
	- 向容器主进程发送 `SIGTERM` 信号，等待指定秒数以完成清理退出。
	- 若超时容器仍未退出，则发送 `SIGKILL` 强制终止。
	- 可通过设置较大超时时间，保障如数据库等服务有充分时间完成优雅退出。

如需查看更多选项说明，请使用：

```bash
docker container stop --help
```

示例：

```bash hl:1
➜  ~ docker container stop redis
redis
➜  ~ docker container ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
➜  ~      
```

## 启动容器

使用 [`docker container start`](https://docs.docker.com/reference/cli/docker/container/start/)（或简写 `docker start`）命令，可**启动一个已停止的容器**。

```bash
docker container start [OPTIONS] CONTAINER [CONTAINER...]
```

示例：

```bash hl:1
➜  ~ docker container start redis
redis
➜  ~ docker container ps
CONTAINER ID   IMAGE     COMMAND                  CREATED      STATUS         PORTS                                         NAMES
b25bba8de5c4   redis     "docker-entrypoint.s…"   2 days ago   Up 9 seconds   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp   redis
➜  ~     
```

## 删除容器

使用 [`docker container rm`](https://docs.docker.com/reference/cli/docker/container/rm/)（或简写 `docker rm`）命令，可**删除一个或多个已停止的容器**。

```bash
docker container rm [OPTIONS] CONTAINER [CONTAINER...]
```

参数说明：
- `-f, --force`：**强制删除容器**
	- **可用于删除运行中的容器**。
	- 等同于发送 `SIGKILL` 信号终止容器后再删除。
- `-v, --volumes`：**同时删除挂载的匿名数据卷**
	- 默认不会删除与容器关联的数据卷。
	- 指定该参数可在删除容器时一并清理数据卷，防止遗留无用数据。

如需查看更多选项说明，请使用：

```bash
docker container rm --help
```

示例：

```bash hl:4,6
➜  ~ docker container ps
CONTAINER ID   IMAGE     COMMAND                  CREATED      STATUS         PORTS                                         NAMES
b25bba8de5c4   redis     "docker-entrypoint.s…"   2 days ago   Up 9 minutes   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp   redis
➜  ~ docker container rm redis
Error response from daemon: cannot remove container "redis": container is running: stop the container before removing or force remove
➜  ~ docker container rm -f redis
redis
➜  ~
```

## 查看日志

使用 [`docker container logs`](https://docs.docker.com/reference/cli/docker/container/logs/)（或简写 `docker logs`）命令，可**查看容器运行过程中的输出日志**（包括标准输出和错误输出），用于调试或监控服务运行状态。

```bash
docker container logs [OPTIONS] CONTAINER
```

参数说明：
- `-f, --follow`：**实时追踪日志输出**
	- 类似 `tail -f`，持续输出新日志，适合实时查看服务运行情况。
- `--since <时间>`：**仅显示指定时间之后的日志**
	- 支持时间格式如 `2024-01-01T13:23:30`、`10m`（10 分钟前）、`1h`（1 小时前）等。
- `--tail <行数>`：**仅显示最近 N 行日志**
	- 默认值为 `all`，表示输出全部日志。
- `-t, --timestamps`：**显示时间戳**
	- 在每条日志前添加对应的时间戳，便于排查定位问题。

如需查看更多选项说明，请使用：

```bash
docker container logs --help
```

示例：

```bash hl:1
➜  ~ docker container logs -f redis
Starting Redis Server
1:C 04 Jul 2025 11:11:59.188 * oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 04 Jul 2025 11:11:59.188 * Redis version=8.0.2, bits=64, commit=00000000, modified=1, pid=1, just started
1:C 04 Jul 2025 11:11:59.188 * Configuration loaded
1:M 04 Jul 2025 11:11:59.188 * monotonic clock: POSIX clock_gettime
1:M 04 Jul 2025 11:11:59.189 * Running mode=standalone, port=6379.
1:M 04 Jul 2025 11:11:59.189 * <bf> RedisBloom version 8.0.1 (Git=unknown)
1:M 04 Jul 2025 11:11:59.189 * <bf> Registering configuration options: [
1:M 04 Jul 2025 11:11:59.189 * <bf>     { bf-error-rate       :      0.01 }
1:M 04 Jul 2025 11:11:59.189 * <bf>     { bf-initial-size     :       100 }
1:M 04 Jul 2025 11:11:59.189 * <bf>     { bf-expansion-factor :         2 }
1:M 04 Jul 2025 11:11:59.189 * <bf>     { cf-bucket-size      :         2 }
1:M 04 Jul 2025 11:11:59.189 * <bf>     { cf-initial-size     :      1024 }
1:M 04 Jul 2025 11:11:59.189 * <bf>     { cf-max-iterations   :        20 }
1:M 04 Jul 2025 11:11:59.189 * <bf>     { cf-expansion-factor :         1 }
1:M 04 Jul 2025 11:11:59.189 * <bf>     { cf-max-expansions   :        32 }
1:M 04 Jul 2025 11:11:59.189 * <bf> ]
1:M 04 Jul 2025 11:11:59.189 * Module 'bf' loaded from /usr/local/lib/redis/modules//redisbloom.so
1:M 04 Jul 2025 11:11:59.190 * <search> Redis version found by RedisSearch : 8.0.2 - oss
1:M 04 Jul 2025 11:11:59.190 * <search> RediSearch version 8.0.1 (Git=5688fcc)
1:M 04 Jul 2025 11:11:59.190 * <search> Low level api version 1 initialized successfully
1:M 04 Jul 2025 11:11:59.190 * <search> gc: ON, prefix min length: 2, min word length to stem: 4, prefix max expansions: 200, query timeout (ms): 500, timeout policy: return, cursor read size: 1000, cursor max idle (ms): 300000, max doctable size: 1000000, max number of search results:  1000000,
1:M 04 Jul 2025 11:11:59.190 * <search> Initialized thread pools!
1:M 04 Jul 2025 11:11:59.190 * <search> Disabled workers threadpool of size 0
1:M 04 Jul 2025 11:11:59.190 * <search> Subscribe to config changes
1:M 04 Jul 2025 11:11:59.190 * <search> Enabled role change notification
1:M 04 Jul 2025 11:11:59.191 * <search> Cluster configuration: AUTO partitions, type: 0, coordinator timeout: 0ms
1:M 04 Jul 2025 11:11:59.191 * <search> Register write commands
1:M 04 Jul 2025 11:11:59.191 * Module 'search' loaded from /usr/local/lib/redis/modules//redisearch.so
1:M 04 Jul 2025 11:11:59.191 * <timeseries> RedisTimeSeries version 80001, git_sha=577bfa8b5909e7ee572f0b651399be8303dc6641
1:M 04 Jul 2025 11:11:59.191 * <timeseries> Redis version found by RedisTimeSeries : 8.0.2 - oss
1:M 04 Jul 2025 11:11:59.191 * <timeseries> Registering configuration options: [
1:M 04 Jul 2025 11:11:59.191 * <timeseries>     { ts-compaction-policy   :              }
1:M 04 Jul 2025 11:11:59.191 * <timeseries>     { ts-num-threads         :            3 }
1:M 04 Jul 2025 11:11:59.191 * <timeseries>     { ts-retention-policy    :            0 }
1:M 04 Jul 2025 11:11:59.191 * <timeseries>     { ts-duplicate-policy    :        block }
1:M 04 Jul 2025 11:11:59.191 * <timeseries>     { ts-chunk-size-bytes    :         4096 }
1:M 04 Jul 2025 11:11:59.191 * <timeseries>     { ts-encoding            :   compressed }
1:M 04 Jul 2025 11:11:59.191 * <timeseries>     { ts-ignore-max-time-diff:            0 }
1:M 04 Jul 2025 11:11:59.191 * <timeseries>     { ts-ignore-max-val-diff :     0.000000 }
1:M 04 Jul 2025 11:11:59.191 * <timeseries> ]
1:M 04 Jul 2025 11:11:59.191 * <timeseries> Detected redis oss
1:M 04 Jul 2025 11:11:59.191 * Module 'timeseries' loaded from /usr/local/lib/redis/modules//redistimeseries.so
1:M 04 Jul 2025 11:11:59.192 * <ReJSON> Created new data type 'ReJSON-RL'
1:M 04 Jul 2025 11:11:59.192 * <ReJSON> version: 80001 git sha: unknown branch: unknown
1:M 04 Jul 2025 11:11:59.192 * <ReJSON> Exported RedisJSON_V1 API
1:M 04 Jul 2025 11:11:59.192 * <ReJSON> Exported RedisJSON_V2 API
1:M 04 Jul 2025 11:11:59.192 * <ReJSON> Exported RedisJSON_V3 API
1:M 04 Jul 2025 11:11:59.192 * <ReJSON> Exported RedisJSON_V4 API
1:M 04 Jul 2025 11:11:59.192 * <ReJSON> Exported RedisJSON_V5 API
1:M 04 Jul 2025 11:11:59.192 * <ReJSON> Enabled diskless replication
1:M 04 Jul 2025 11:11:59.192 * <ReJSON> Initialized shared string cache, thread safe: false.
1:M 04 Jul 2025 11:11:59.192 * Module 'ReJSON' loaded from /usr/local/lib/redis/modules//rejson.so
1:M 04 Jul 2025 11:11:59.192 * <search> Acquired RedisJSON_V5 API
1:M 04 Jul 2025 11:11:59.192 * Server initialized
1:M 04 Jul 2025 11:11:59.192 * <search> Loading event starts
1:M 04 Jul 2025 11:11:59.193 * <search> Enabled workers threadpool of size 4
1:M 04 Jul 2025 11:11:59.193 * Loading RDB produced by version 8.0.2
1:M 04 Jul 2025 11:11:59.193 * RDB age 23572 seconds
1:M 04 Jul 2025 11:11:59.193 * RDB memory usage when created 0.99 Mb
1:M 04 Jul 2025 11:11:59.193 * Done loading RDB, keys loaded: 1, keys expired: 0.
1:M 04 Jul 2025 11:11:59.193 * <search> Disabled workers threadpool of size 4
1:M 04 Jul 2025 11:11:59.193 * <search> Loading event ends
1:M 04 Jul 2025 11:11:59.193 * DB loaded from disk: 0.000 seconds
1:M 04 Jul 2025 11:11:59.193 * Ready to accept connections tcp
```
