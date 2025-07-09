---
tags:
  - DevKit/Docker
create_time: 2025/07/04 22:48
update_time: 2025/07/09 23:42
priority: 12
---

## 什么是数据卷？

数据卷是由 Docker 管理的一个持久化存储区域，可挂载至一个或多个容器中，用于实现数据的持久化存储、容器间的数据共享以及容器与宿主机间数据的实时同步。

## 为什么需要数据卷？

在未使用数据卷前，数据存储存在如下问题：

- **数据与容器强耦合**：数据写在容器内部，容器销毁时数据随之丢失。
- **维护困难**：要修改服务配置或数据文件，必须进入容器内部操作，效率低。
- **无法复用**：容器之间无法共享数据；
- **升级成本高**：容器升级需迁移数据，过程繁琐。

## 核心特性

- ✅**持久化存储**：卷内数据独立于容器生命周期，即使容器被删除，卷内数据也不会丢失；
- 🔄**跨容器共享**：多个容器可挂载同一个数据卷，实现数据共享与协作；
- ⚡**实时同步**：容器或宿主机对卷中数据的修改会双向同步，即时生效；
- 📦**镜像解耦**：卷中的数据不会被打包进镜像，避免污染镜像内容；
- 🛠️**便于备份/迁移**：卷可独立备份、迁移；
- 🔧 **自动管理**：容器创建和销毁时会自动完成卷的挂载和解绑，用户无需手动干预；
- 🚀 **性能优越**：卷存储于宿主机本地文件系统，读写性能优于容器文件系统。

## 分类

### 具名卷

具名卷（Named Volume）是指具有显式名称的数据卷。适合用于长期存储、跨容器共享、独立管理等场景，便于识别、维护和备份。

具名卷的创建方式包括：
- [[#创建数据卷|手动创建]]：通过 `docker volume create <name>` 命令显式创建；
- [[#具名卷挂载|自动创建]]：使用 `docker run -v <name>:<container-path>` 命令启动容器时，若指定的卷不存在则会自动创建并挂载该具名卷。

### 匿名卷

匿名卷（Anonymous Volume）是指没有显式指定名称的卷，**由 Docker 自动生成唯一名称**，适用于快速试验、一次性任务或临时数据持久化等场景。由于卷名不可预测，**默认不会复用或共享**，更适合短生命周期的数据使用。

匿名卷的创建方式包括：
- [[#创建数据卷|手动创建]]：通过 `docker volume create` 命令创建但不指定名称，Docker 会自动生成卷名，使用时再通过卷 ID 挂载（不常用）。
- [[#匿名卷挂载|自动创建]]：使用 `docker run -v <container-path>` 命令启动容器时，若未指定源路径则会自动创建一个匿名卷并挂载；

若希望多个容器**共享同一个匿名卷**，可通过该匿名卷的随机 ID 手动挂载。例如：

```bash
docker run -v 0ee603d8d542:/usr/share/nginx/html nginx
```

> [!note]
> 若使用 `--rm` 参数启动容器，则会在容器退出时自动销毁与其关联的匿名卷。

## 常用命令

### 创建数据卷

使用 [`docker volume create`](https://docs.docker.com/reference/cli/docker/volume/create/) 命令可**手动创建一个数据卷**，用于后续容器挂载与数据持久化管理。

```bash
docker volume create [OPTIONS] [VOLUME]
```

- 若指定了 `VOLUME` 参数，则创建具名卷；
- 若未指定名称，则创建匿名卷，Docker 会自动生成唯一名称。

示例 1：创建一个具名卷

```bash hl:1
➜  ~ docker volume create nginx_html
nginx_html
➜  ~                                                                                                                    
```

示例 2：创建一个匿名卷

```bash hl:1
➜  ~ docker volume create
553a6640684c8ca2db31d62714aa602a698a0d7ccd438b8c3899d1417f4459de
➜  ~      
```

返回值即为卷名。

### 查看数据卷详情

使用 [`docker volume inspect`](https://docs.docker.com/reference/cli/docker/volume/inspect/) 命令可**查看一个或多个数据卷的详细信息**，包括其名称、挂载路径、驱动类型、创建时间、关联容器等。

```bash
docker volume inspect [OPTIONS] VOLUME [VOLUME...]
```

示例 1：查看具名卷 `nginx_html` 的详细信息。

```bash hl:1,7
➜  ~ docker volume inspect nginx_html
[
    {
        "CreatedAt": "2025-07-08T11:25:55Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/nginx_html/_data",
        "Name": "nginx_html",
        "Options": null,
        "Scope": "local"
    }
]
➜  ~  
```

示例 2：查看匿名卷的详细信息。

```bash hl:1,9
➜  ~ docker volume inspect 553a6640684c8ca2db31d62714aa602a698a0d7ccd438b8c3899d1417f4459de
[
    {
        "CreatedAt": "2025-07-08T11:26:08Z",
        "Driver": "local",
        "Labels": {
            "com.docker.volume.anonymous": ""
        },
        "Mountpoint": "/var/lib/docker/volumes/553a6640684c8ca2db31d62714aa602a698a0d7ccd438b8c3899d1417f4459de/_data",
        "Name": "553a6640684c8ca2db31d62714aa602a698a0d7ccd438b8c3899d1417f4459de",
        "Options": null,
        "Scope": "local"
    }
]
➜  ~  
```

> [!tip] 数据卷的默认存储位置
> - Linux/macOS（原生 Docker）：`/var/lib/docker/volumes/`。
> - Docker Desktop（Windows/macOS）：`\\wsl$\docker-desktop\mnt\docker-desktop-disk\data\docker\volumes`，可通过资源管理器访问查看。

### 列出所有数据卷

使用 [`docker volume ls`](https://docs.docker.com/reference/cli/docker/volume/ls/) 命令可**查看本地所有数据卷**，包括匿名卷和具名卷。

```bash
docker volume ls [OPTIONS]
```

参数说明：
- `-q, --quiet`：仅显示卷名，便于脚本处理；
- `-f, --filter`：按条件过滤输出结果（如名称、驱动等），支持多种过滤器。

如需查看更多选项说明，请使用：

```bash
docker volume ls --help
```

示例 1：列出所有数据卷（默认展示驱动和名称）

```bash hl:1
➜  ~ docker volume ls
DRIVER    VOLUME NAME
local     553a6640684c8ca2db31d62714aa602a698a0d7ccd438b8c3899d1417f4459de
local     nginx_html
➜  ~     
```

示例 2：仅显示数据卷名称（静默模式）

```bash hl:1
➜  ~ docker volume ls -q
553a6640684c8ca2db31d62714aa602a698a0d7ccd438b8c3899d1417f4459de
nginx_html
➜  ~    
```

示例 3：根据名称过滤（支持前缀匹配）

```bash hl:1
➜  ~ docker volume ls -f name=nginx
DRIVER    VOLUME NAME
local     nginx_html
➜  ~    
```

### 删除数据卷

使用 [`docker volume rm`](https://docs.docker.com/reference/cli/docker/volume/rm/) 命令可**删除一个或多个未被使用的数据卷**，以释放宿主机的磁盘空间。

```bash
docker volume rm [OPTIONS] VOLUME [VOLUME...]
```

> [!warning]
> 该命令**只能删除未被挂载的卷**。若目标卷仍被某个容器使用，将会返回错误提示。

示例 1：删除一个具名卷

```bash
➜  ~ docker volume rm nginx_html
nginx_html
➜  ~
```

示例 2：删除多个数据卷

```bash
➜  ~ docker volume rm nginx_html 553a6640684c8ca2db31d62714aa602a698a0d7ccd438b8c3899d1417f4459de
nginx_html
553a6640684c8ca2db31d62714aa602a698a0d7ccd438b8c3899d1417f4459de
➜  ~
```

示例 3：尝试删除正在被使用的卷（删除失败）

```bash hl:1
➜  ~ docker volume rm nginx_html
Error response from daemon: remove nginx_html: volume is in use - [13cb2e5d31696cafa913836804c1dd61ceb50f360fee5106c99b3e0467a791c0]
➜  ~      
```

### 清理未使用的数据卷

使用 [`docker volume prune`](https://docs.docker.com/reference/cli/docker/volume/prune/) 命令可**一次性删除所有未被使用的本地数据卷**，以释放宿主机的磁盘空间。

```bash
docker volume prune [OPTIONS]
```

该命令会扫描并移除所有未被任何容器挂载的卷，不会影响正在使用中的卷。

> [!warning]
> 删除操作不可恢复，请确保卷中数据不再需要再执行此命令！

参数说明：
- `-a, --all`：删除所有未被使用的卷，包括具名卷（默认仅清理匿名卷）;
- `--filter`：指定过滤条件，仅删除满足条件的卷（如 `label=<标签>`）；
- `-f, --force`：跳过确认提示，直接执行清理操作。

示例 1：交互式清理未被使用的匿名卷

```bash hl:1
➜  ~ docker volume prune
WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
553a6640684c8ca2db31d62714aa602a698a0d7ccd438b8c3899d1417f4459de

Total reclaimed space: 0B
➜  ~     
```

示例 2：跳过确认提示，清理所有匿名卷

```bash hl:1
➜  ~ docker volume prune -f
Deleted Volumes:
d87103655ff1b0230fe7498bb90eeb522886c75ad2c2788bcf85838c1ed4bba9

Total reclaimed space: 0B
➜  ~     
```

示例 3：清理所有未被使用的数据卷（包括具名卷）

```bash hl:1
➜  ~ docker volume prune -a
WARNING! This will remove all local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
redis_data
64c33550767df6018cbe6af48dcb392f49bca0740956dcb05c588b18cb74f79b

Total reclaimed space: 0B
➜  ~    
```

## 三种挂载方式

容器默认将数据存储在临时的可写层中，这意味着当容器删除时，其内部数据也将一并删除。为实现数据持久化，或在容器与宿主机、容器与容器之间共享数据，可通过挂载机制将容器内的目录映射至宿主机文件系统。

### 匿名卷挂载

```bash
docker run -d --name my-nginx -p 80:80 -v /usr/share/nginx/html nginx
```

- 未指定源路径时会自动创建一个匿名卷，卷名随机生成，用户不可控；
- 该匿名卷将挂载至容器内的 `/usr/share/nginx/html` 目录；
- 匿名卷默认不共享，如需共享可通过其卷 ID 手动挂载至其他容器。

### 具名卷挂载

```bash
docker run -d --name my-nginx -p 80:80 -v nginx_html:/usr/share/nginx/html nginx
```

- 显式指定卷名称为 `nginx_html`，若该卷尚不存在则会自动创建；
- 将该具名卷挂载至容器内的 `/usr/share/nginx/html` 目录；
- 卷与容器生命周期解耦，容器删除后数据仍会保留；
- 可被其他容器复用，便于数据共享与统一管理。

### 绑定挂载

绑定挂载可将宿主机上指定路径的文件或目录直接挂载至容器内，适用于本地开发调试、配置加载、日志持久化等场景。

```bash
docker run -d --name my-nginx -p 80:80 -v /data/nginx/html:/usr/share/nginx/html nginx
```

- 将宿主机的 `/data/nginx/html` 目录挂载至容器内的 `/usr/share/nginx/html` 目录；
- 容器或宿主机对该目录中数据的修改会双向同步，即时生效；
- 默认以读写模式（`rw`）挂载，若需只读挂载，可在路径后添加 `:ro`，如：`-v /path:/path:ro`。
- 宿主机与容器路径需为绝对路径，即以 `/` 开头；
- 宿主机和容器内目录若不存在则会自动创建；

## 数据覆盖问题

当将数据卷挂载至容器中某个已有内容的目录时，可能会出现原始数据被"遮蔽"的情况：

- 若挂载的是非空卷，容器目录中的原始内容将被完全"遮蔽"（并未被删除），无法访问；
- 若挂载的是空卷，容器目录中的原始内容将在首次挂载时被复制到卷中，仅执行一次；

此行为类似于在 Linux 中将 U 盘挂载到已有内容的 `/mnt` 目录，U 盘的内容会临时覆盖原有文件视图，直到卸载为止。

> [!note]
> 对于容器，无法通过移除挂载以再次显示被遮蔽的文件。最好的选择是重新创建一个未挂载该卷的容器。
