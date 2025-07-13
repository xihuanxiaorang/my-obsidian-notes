---
tags:
  - DevKit/Docker
create_time: 2025/06/26 19:20
update_time: 2025/07/13 19:10
priority: 20
---

**MySQL** 是全球最受欢迎的开源**关系型数据库管理系统**（RDBMS），凭借出色的性能、可靠性与易用性，广泛应用于各类 Web 应用场景。

从个人项目、小型网站到电商平台和大型信息系统，MySQL 始终是主流的数据库解决方案。包括 **Facebook**、**Twitter**、**YouTube**、**Yahoo!** 等知名网站都使用 MySQL 构建其数据架构，充分证明其在高并发、大规模环境下的稳定性与可扩展性。

## 查看可用的 MySQL 版本

> 📦 Docker Hub 镜像仓库：[https://hub.docker.com/_/mysql](https://hub.docker.com/_/mysql)

使用以下命令列出可用的 MySQL 镜像：

```bash
docker search mysql
```

输出示例：

```bash hl:1,3
➜  ~ docker search mysql
NAME                   DESCRIPTION                                     STARS     OFFICIAL
mysql                  MySQL is a widely used, open-source relation…   15837     [OK]
bitnami/mysql          Bitnami container image for MySQL               137
circleci/mysql         MySQL is a widely used, open-source relation…   31
bitnamicharts/mysql    Bitnami Helm chart for MySQL                    0
cimg/mysql                                                             3
ubuntu/mysql           MySQL open source fast, stable, multi-thread…   68
google/mysql           MySQL server for Google Compute Engine          26
linuxserver/mysql      A Mysql container, brought to you by LinuxSe…   44
elestio/mysql          Mysql, verified and packaged by Elestio         1
docksal/mysql          MySQL service images for Docksal - https://d…   0
alpine/mysql           mysql client                                    3
eclipse/mysql          Mysql 5.7, curl, rsync                          2
datajoint/mysql        MySQL image pre-configured to work smoothly …   2
ilios/mysql            Mysql configured for running Ilios              1
ddev/mysql             ARM64 base images for ddev-dbserver-mysql-8.…   1
mirantis/mysql                                                         0
corpusops/mysql        https://github.com/corpusops/docker-images/     0
mysql/mysql-server     Optimized MySQL Server Docker images. Create…   1032
vulhub/mysql                                                           1
cbioportal/mysql       This repository hosts MySQL database images …   1
vitess/mysql           Lightweight image to run MySQL with Vitess      1
mysql/mysql-router     MySQL Router provides transparent routing be…   28
mysql/mysql-cluster    Experimental MySQL Cluster Docker images. Cr…   100
nasqueron/mysql                                                        1
mysql/mysql-operator   MySQL Operator for Kubernetes                   1
➜  ~    
```

- **NAME**：镜像名称
- **DESCRIPTION**：镜像简介
- **STARS**：社区用户评分，越高表示越受欢迎
- **OFFICIAL**：是否为官方镜像（`[OK]` 表示官方发布）

> [!tip]
> 建议使用官方 `mysql` 镜像（带 `[OK]` 标记）进行开发部署。

## 拉取 MySQL 镜像

拉取最新官方镜像（默认标签为 `latest`，可省略）：

```bash
docker pull mysql
```

输出示例：拉取指定版本（推荐明确版本号避免未来升级导致兼容问题）

```bash hl:1,16
➜  ~ docker pull mysql：8.0.29	
8.0.29: Pulling from library/mysql
4e93c6fd777f: Pull complete 
d48f3c15cb80: Pull complete 
327840d38cb2: Pull complete 
94c3d7b2c9ae: Pull complete 
e12b159b2a12: Pull complete 
cbf214d981a6: Pull complete 
e54b73e95ef3: Pull complete 
7d1cc1ea1b3d: Pull complete 
f6cfbf240ed7: Pull complete 
e077469d560d: Pull complete 
642077275f5f: Pull complete 
Digest: sha256:152cf187a3efc56afb0b3877b4d21e231d1d6eb828ca9221056590b0ac834c75
Status: Downloaded newer image for mysql:8.0.29
docker.io/library/mysql:8.0.29
➜  ~    
```

> [!tip]
> 可在 [Docker Hub](https://hub.docker.com/_/mysql/tags) 查看所有可用版本标签。

## 查看本地镜像

```bash
docker images
```

输出示例：

```bash hl:1,3
➜  ~ docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
mysql        8.0.29    152cf187a3ef   2 years ago   609MB
➜  ~ 
```

- **REPOSITORY**：镜像仓库名
- **TAG**：版本标签（如 latest、8.0）
- **IMAGE ID**：镜像 ID
- **CREATED**：镜像创建时间
- **SIZE**：镜像大小

## 准备工作

### 创建挂载目录

为 MySQL 容器准备专用目录，用于挂载配置文件、数据文件以及日志文件：

```bash
sudo mkdir -p /mydata/mysql8029/{conf,data,log}
```

- `conf`：用于挂载自定义配置文件（`.cnf`），实现参数覆盖或功能扩展；
- `data`：用于挂载数据库数据目录，实现数据持久化；
- `log`：用于挂载日志目录，便于记录错误日志、慢查询日志等；

> [!tip]
> 建议将所有相关目录集中在统一路径下，便于统一备份、版本控制与迁移操作。

### 提取默认配置文件（可选）

若需参考官方默认配置以进行定制，可先启动一个临时容器并提取其配置文件：

```bash
docker run -d \
	--name mysql-temp \
	--restart unless-stopped \
	-e MYSQL_ROOT_PASSWORD=123456 \
	-p 3306:3306 \
	mysql:8.0.29
```

将默认配置文件复制到宿主机指定目录：

```bash
sudo docker cp mysql-temp:/etc/my.cnf /mydata/mysql8029/conf/
```

然后删除临时容器：

```bash
docker rm -f mysql-temp
```

> [!important] MySQL 配置文件加载机制
> 容器启动时，MySQL 会加载默认配置文件（路径依镜像不同），并可能包含如下语句：
> ```ini
> !includedir /etc/mysql/conf.d/
> ```
> 它表示：**将 `/etc/mysql/conf.d/` 目录下的所有 `.cnf` 文件一并加载**，且这些文件中的配置项**会覆盖默认配置中的同名项**。
>
> ✨**推荐做法**：挂载自定义配置文件到至 `/etc/mysql/conf.d/`，以实现灵活、非侵入式的定制配置，而非直接覆盖主配置文件。

## 启动 MySQL 容器

使用以下命令启动一个**后台运行**的 MySQL 容器，支持**系统重启自动启动**，并挂载本地的**数据、配置以及日志目录**：

```bash
docker run -d \
  --restart always \
	--name mysql8029 \
	-p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -v /mydata/mysql8029/data:/var/lib/mysql \
  -v /mydata/mysql8029/log:/var/log/mysql \
  -v /mydata/mysql8029/conf:/etc/mysql/conf.d \
  mysql:8.0.29
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
		docker stop mysql8029
		docker logs mysql8029
		docker exec -it mysql8029 /bin/bash
		```

	- 名称需唯一，仅支持字母、数字、短横线（`-`），不能包含空格或特殊字符。
- `-p 3306:3306`：**端口映射**
	- 语法格式：`-p <宿主机端口>:<容器端口>`。
	- 将**容器内部的 3306 端口**映射到**宿主机（物理机或主系统）的 3306 端口**，允许你从宿主机或其他主机访问数据库服务。
	- 映射后可通过如下方式连接数据库：

		```bash
		主机地址：localhost 或 127.0.0.1
		端口：3306
		用户名：root
		密码：123456
		```

	- 若仅限本地访问，可改用 `-p 127.0.0.1:3306:3306`，避免暴露端口到公网。
- `-e MYSQL_ROOT_PASSWORD=123456`：**设置 root 用户密码**
	- 通过设置环境变量的方式，**为容器中的 MySQL 数据库设置 root 超级用户的初始登录密码**。
	- `-e`：用于传递环境变量（`--env` 的简写）；
	- `MYSQL_ROOT_PASSWORD`：该变量是 **官方 MySQL 镜像所必须提供的配置项**，缺失将导致容器启动失败。
	- 建议生产环境使用强密码（如 `MySQL_8@2025`）。
- `-v`：**挂载本地目录实现数据持久化**
	- `/mydata/mysql8029/data:/var/lib/mysql`：挂载数据目录，确保数据库数据持久化，不会因容器删除而丢失。
	- `/mydata/mysql8029/log:/var/log/mysql`：挂载日志目录，便于日志持久化与查看（如开启 slow log、general log 等日志功能时非常重要）。
	- `/mydata/mysql8029/conf:/etc/mysql/conf.d`：挂载配置目录，支持添加自定义 `.cnf` 文件；

## 验证容器是否启动成功

运行以下命令查看正在运行的容器：

```bash
docker ps
```

输出示例：

```bash hl:1,3
➜  ~ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                                         NAMES
4f9a5bac9bcd   mysql:8.0.29   "docker-entrypoint.s…"   5 seconds ago   Up 5 seconds   0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp   mysql8029
➜  ~     
```

- **CONTAINER ID**：容器的唯一标识符（通常显示前 12 位）。
- **IMAGE**：容器使用的镜像名称（如 `mysql`）。
- **COMMAND**：容器启动时执行的默认命令。
- **CREATED**：容器的创建时间。
- **STATUS**：容器的当前运行状态（如 `Up` 表示正在运行）。
- **PORTS**：端口映射详情（例如将容器的 3306 端口映射到宿主机的 3306）。
- **NAMES**：容器的自定义名称（此例为 `mysql8029`）。

## 测试连接

参数配置完成后，点击 "测试连接" 按钮，验证是否成功连接数据库。若连接成功，将弹出提示，说明配置无误，MySQL 服务已正常运行。
![](https://img.xiaorang.fun/202507102323657.png)

至此，Docker 版 MySQL 服务安装成功！🎉🎉🎉
