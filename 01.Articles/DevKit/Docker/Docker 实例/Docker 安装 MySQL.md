---
tags:
  - DevKit/Docker
create_time: 2025-06-26 19:20
update_time: 2025/06/28 23:25
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

输出示例：

```bash hl:1,15
➜  ~ docker pull mysql
Using default tag: latest
latest: Pulling from library/mysql
4657dc0fd6ee: Pull complete
7af7a034b8b9: Pull complete
10cecf14f09b: Pull complete
d20478bf3bbf: Pull complete
028720beb240: Pull complete
ead6a62c24e9: Pull complete
bfba8db0f2bd: Pull complete
87129af36c90: Pull complete
ed0a8990cecb: Pull complete
7a26ee8a4dfe: Pull complete
Digest: sha256:9a084cc73e7186283c564875e08d8af2c0e5c925333ad0a713f02fb1d826f78a
Status: Downloaded newer image for mysql:latest
docker.io/library/mysql:latest
➜  ~    
```

如需拉取指定版本（推荐明确版本号避免未来升级导致兼容问题）：

```bash
docker pull mysql:8.0.29
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
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
mysql        latest    9a084cc73e71   2 months ago   1.17GB
➜  ~ 
```

- **REPOSITORY**：镜像仓库名
- **TAG**：版本标签（如 latest、8.0）
- **IMAGE ID**：镜像 ID
- **CREATED**：镜像创建时间
- **SIZE**：镜像大小

## 准备工作

### 创建专用目录

创建 MySQL 专用目录，用于挂载配置文件与数据文件：

```bash
sudo mkdir -p /data/mysql/{conf,data}
```

> [!tip]
> 建议将数据与配置集中管理，便于备份、迁移和版本控制。

### 启动临时容器提取默认配置

运行临时容器，从中提取官方默认配置文件：

```bash
docker run -d \
	--name mysql-temp \
	--restart unless-stopped \
	-e MYSQL_ROOT_PASSWORD=123456 \
	-p 3306:3306 \
	mysql
```

各参数说明详见[[#^f912d3|参数说明]]

### 复制配置文件至宿主机

从容器中拷贝配置文件至宿主机指定目录：

```bash
sudo docker cp mysql-temp:/etc/my.cnf /data/mysql/conf/
sudo docker cp mysql-temp:/etc/mysql/conf.d /data/mysql/conf/
```

### 删除临时容器

配置文件提取完成后，删除该临时容器：

```bash
docker rm -f mysql-temp
```

## 启动 MySQL 容器

使用以下命令启动一个**后台运行**的 MySQL 容器，支持**系统重启自动启动**，并**挂载本地数据与配置文件**：

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

参数说明： ^f912d3
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
		docker stop mysql
		docker logs mysql
		docker exec -it mysql /bin/bash
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
	- `/data/mysql/data:/var/lib/mysql`：数据目录挂载，确保数据库数据不会因容器删除而丢失。
	- `/data/mysql/conf/my.cnf:/etc/my.cnf`：主配置文件挂载，支持自定义配置。
	- `/data/mysql/conf/conf.d:/etc/mysql/conf.d`：配置目录挂载，可额外添加 `.cnf` 子配置文件。

输出示例：

```bash hl:1-9
➜  ~ docker run -d \
  --restart always \
	--name mysql \
	-p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -v /data/mysql/data:/var/lib/mysql \
  -v /data/mysql/conf/my.cnf:/etc/my.cnf \
  -v /data/mysql/conf/conf.d:/etc/mysql/conf.d \
  mysql
b86ff6ddca782a981982e6bd0b3b89e2eaf29fe90406ca6c8f8124065140f4a9
➜  ~                                                                                                      
```

## 验证容器是否启动成功

运行以下命令查看正在运行的容器：

```bash
docker ps
```

输出示例：

```bash hl:1,3
➜  ~ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                                         NAMES
b86ff6ddca78   mysql     "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp   mysql
➜  ~     
```

- **CONTAINER ID**：容器的唯一标识符（通常显示前 12 位）。
- **IMAGE**：容器使用的镜像名称（如 `mysql`）。
- **COMMAND**：容器启动时执行的默认命令。
- **CREATED**：容器的创建时间。
- **STATUS**：容器的当前运行状态（如 `Up` 表示正在运行）。
- **PORTS**：端口映射详情（例如将容器的 3306 端口映射到宿主机的 3306）。
- **NAMES**：容器的自定义名称（此例为 `mysql`）。

> [!tip]
> 如果未看到任何输出，说明没有正在运行的容器。可以使用 `docker ps -a` 命令查看所有容器，包括已停止的。

## 测试连接

参数配置完成后，点击 "测试连接" 按钮，验证是否成功连接数据库。若连接成功，将弹出提示，说明配置无误，MySQL 服务已正常运行。
![](https://img.xiaorang.fun/202506262331996.png)

至此，Docker 版 MySQL 服务安装成功！🎉🎉🎉
