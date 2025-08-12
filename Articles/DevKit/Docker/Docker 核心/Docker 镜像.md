---
tags:
  - DevKit/Docker
create_time: 2025/06/30 22:26
update_time: 2025/07/02 16:04
priority: 10
---

## 列出本地镜像

使用 [`docker image ls`](https://docs.docker.com/reference/cli/docker/image/ls/)（简写为 `docker images`）命令可查看本地镜像：

```bash
docker image ls [OPTIONS] [REPOSITORY[:TAG]]
```

参数说明：
- `REPOSITORY[:TAG]`：可选，精确匹配镜像仓库和标签，仅显示符合条件的镜像。
- `OPTIONS`
	- `-a, --all`：显示所有镜像，包括构建过程中生成的中间镜像。
	- `--no-trunc`：输出完整（镜像 ID、摘要等）信息，默认会截断显示。
	- `-q, --quiet`：仅输出镜像 ID，适合脚本和管道操作。
	- `-f, --filter`：根据条件进行过滤，可多次指定。支持的过滤条件包括：
		- `dangling=true|false`：是否显示悬空镜像（无标签的临时镜像）。
		- `label=<key>=<value>`：按标签过滤。
		- `before=<image>`：显示创建时间早于指定镜像的所有镜像。
		- `since=<image>`：显示创建时间晚于指定镜像的所有镜像。
		- `reference=<pattern>`：按镜像名称模糊匹配，支持通配符 `*`。

如需查看更多选项说明，请使用：

```bash
docker image ls --help
```

示例：

```bash hl:1,3
➜  ~ docker image ls
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    940c619fbd41   5 months ago   20.4kB
➜  ~   
```

字段说明：
- **REPOSITORY**：镜像仓库名称
- **TAG**：镜像版本标签（如 `latest`、`8.0` 等）
- **IMAGE ID**：镜像唯一标识（前 12 位）
- **CREATED**：镜像创建时间
- **SIZE**：镜像大小

## 搜索镜像

使用 [`docker search`](https://docs.docker.com/reference/cli/docker/search/) 命令可在 [Docker Hub](https://hub.docker.com/) 上搜索公开镜像仓库：

```bash
docker search [OPTIONS] TERM
```

参数说明：
- `TERM`：必填，搜索关键字（匹配镜像名称、描述等）。
- `OPTIONS`：
	- `-f, --filter`：根据条件进行过滤，可多次指定。支持的过滤条件包括：
		- `is-official=true|false`：是否为官方镜像（由 Docker 官方维护）。
		- `is-automated=true|false`：是否为自动构建镜像（由构建服务自动推送）。
		- `stars=<n>`：仅显示收藏数大于等于 `n` 的镜像。
	- `--no-trunc`：输出完整（描述）信息，默认会截断显示。
	- `--limit`：限制返回的结果数量（默认上限为 25）。

如需查看更多选项说明，请使用：

```bash
docker search --help
```

示例：

```bash hl:1,3
➜  ~ docker search mysql
NAME                   DESCRIPTION                                     STARS     OFFICIAL
mysql                  MySQL is a widely used, open-source relation…   15838     [OK]
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
mysql/mysql-server     Optimized MySQL Server Docker images. Create…   1032
corpusops/mysql        https://github.com/corpusops/docker-images/     0
vulhub/mysql                                                           1
cbioportal/mysql       This repository hosts MySQL database images …   1
vitess/mysql           Lightweight image to run MySQL with Vitess      1
mysql/mysql-router     MySQL Router provides transparent routing be…   28
mysql/mysql-cluster    Experimental MySQL Cluster Docker images. Cr…   100
nasqueron/mysql                                                        1
mysql/mysql-operator   MySQL Operator for Kubernetes                   1
➜  ~      
```

字段说明：
- **NAME**：镜像名称
- **DESCRIPTION**：镜像描述信息
- **STARS**：镜像在 Docker Hub 上的收藏数量，越高表示越受欢迎
- **OFFICIAL**：是否为官方镜像（`[OK]` 表示官方发布）

> [!tip]
> 推荐优先选择官方镜像（带 `[OK]` 标识）进行开发部署，更安全、稳定、维护及时。

## 拉取镜像

使用 [`docker image pull`](https://docs.docker.com/reference/cli/docker/image/pull/#pull-from-a-different-registry)（或简写 `docker pull`）命令可从远程镜像仓库（如 Docker Hub 或私有 Registry）拉取镜像至本地：

```bash
docker image pull [OPTIONS] [REGISTRY]/[NAMESPACE]/NAME[:TAG|@DIGEST]
```

参数说明：
- `REGISTRY`：镜像仓库地址，如 `docker.io`、`docker.n8n.io`，若省略则默认使用官方仓库 `docker.io`。
- `NAMESPACE`：命名空间（通常为用户名或组织名），若省略则默认使用官方命名空间 `library`。
- `NAME`：镜像名称，如 `nginx`、`mysql` 等。
- `TAG`：镜像标签（版本号），如 `latest`、`1.25.3` 等，若省略则默认为 `latest`。
- `@DIGEST`：镜像摘要，如 `@sha256:...`，用于精确指定镜像的某个快照版本。
- `OPTIONS`：
    - `-a, --all-tags`：拉取指定镜像仓库中该镜像的所有标签版本。
    - `--platform`：指定目标平台，如 `linux/amd64`、`linux/arm64`。默认根据宿主机架构自动匹配。
    - `-q, --quiet`：仅输出镜像 ID，适合脚本或管道操作。

如需查看更多选项说明，请使用：

```bash
docker image pull --help
```

示例 1：`docker image pull nginx` 等价于 `docker image pull docker.io/library/nginx:latest`，表示从官方仓库 `docker.io` 的官方命名空间 `library` 拉取最新版本的 `nginx` 镜像。

```bash hl:1,13
➜  ~ docker image pull nginx
Using default tag: latest
latest: Pulling from library/nginx
ee95256df030: Pull complete
23e05839d684: Pull complete
ce7132063a56: Pull complete
9bbbd7ee45b7: Pull complete
6c8e51cf0087: Pull complete
48670a58a68f: Pull complete
3da95a905ed5: Pull complete
Digest: sha256:93230cd54060f497430c7a120e2347894846a81b6a5dd2110f7362c5423b4abc
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
➜  ~   
```

示例 2：`docker image pull docker.n8n.io/n8nio/n8n:1.81.0` 表示从私有仓库 `docker.n8n.io` 的 `n8nio/n8n` 镜像库中拉取版本为 `1.81.0` 的镜像。

```bash hl:1,16
➜  ~ docker image pull docker.n8n.io/n8nio/n8n:1.81.0
1.81.0: Pulling from n8nio/n8n
0416551166ae: Pull complete
4f4fb700ef54: Pull complete
f18232174bc9: Pull complete
49e21c1326cc: Pull complete
2a055f0c83be: Pull complete
7bc9526d2210: Pull complete
164726e21d3e: Pull complete
905fb610ce71: Pull complete
7b914aa10635: Pull complete
e76a19bcacac: Pull complete
96b30016c71a: Pull complete
Digest: sha256:b1e7ce157f8cde0f08a4bce4684f2814449e456a69d5395075172177f79bb07b
Status: Downloaded newer image for docker.n8n.io/n8nio/n8n:1.81.0
docker.n8n.io/n8nio/n8n:1.81.0
➜  ~   
```

> [!note]
> 对于私有仓库，首次拉取前需先执行 `docker login <registry>` 进行身份验证。

## 删除镜像

使用 [`docker image rm`](https://docs.docker.com/reference/cli/docker/image/rm/)（或简写 `docker rmi`）命令可从本地删除一个或多个镜像：

```bash
docker image rm [OPTIONS] IMAGE [IMAGE...]
```

参数说明：
- `IMAGE`：要删除的镜像标识。可指定**镜像名称**（如 `nginx:latest`）、**镜像 ID**（完整或前缀）或摘要（digest），支持同时删除多个镜像。
- `OPTIONS`：
	- `-f, --force`：强制删除指定镜像的标签，即使该镜像存在多个标签引用；但如果镜像仍被容器使用（无论是运行中还是已停止），即使使用 `-f` 也无法删除镜像本体。
	- `--no-prune`：默认情况下，如果镜像的父镜像未被其他镜像使用，将一并删除。使用此选项可保留这些未使用的父镜像，仅删除当前指定镜像。

如需查看更多选项说明，请使用：

```bash
docker image rm --help
```

示例 1：成功删除镜像及其标签。

```bash hl:1
➜  ~ docker image rm nginx:latest
Untagged: nginx:latest
Deleted: sha256:93230cd54060f497430c7a120e2347894846a81b6a5dd2110f7362c5423b4abc
➜  ~     
```

表示成功移除 `nginx:latest` 标签，并删除了对应的镜像层（即该镜像未被容器使用，且无其他标签引用）。

示例 2：镜像被容器使用，仅取消标签引用。

```bash
➜  ~ docker image rm -f nginx
Untagged: nginx:latest
➜  ~     
```

表示镜像仍被容器使用（如已有基于该镜像的容器存在），因此即使使用 `-f` 也只能移除标签，镜像本体仍保留在本地。

> [!tip]
> `-f` 仅**强制取消标签引用（untag）**，**不会删除仍被容器使用或被其他标签引用的镜像本体**。若想**彻底删除镜像，请先停止并删除所有使用该镜像的容器**。
