---
tags:
  - DevKit/Docker
create_time: 2025/06/30 22:26
update_time: 2025/06/30 23:38
priority: 10
---

## 列出本地镜像

使用 [`docker image ls`](https://docs.docker.com/reference/cli/docker/image/ls/)（或简写 `docker images`）命令可查看本地所有镜像：

```bash
docker image ls [OPTIONS] [REPOSITORY[:TAG]]
```

参数说明：
- `REPOSITORY[:TAG]`：可选，精准匹配镜像名称及标签，仅显示符合条件的镜像。
- `OPTIONS`
	- `-a` 或 `--all`：显示所有镜像，包括构建过程中的中间层镜像。
	- `--no-trunc`：输出完整（镜像 ID、摘要等）信息，默认会截断镜像 ID 等字段。
	- `-q` 或 `--quiet`：仅输出镜像 ID，适合脚本和管道操作。
	- `-f` 或 `--filter`：根据条件过滤镜像，可多次指定。支持过滤条件包括：
		- `dangling=true|false`：是否显示悬空镜像（无标签的临时镜像）。
		- `label=<key>=<value>`：按镜像标签过滤。
		- `before=<image>`：显示创建时间早于指定镜像的所有镜像。
		- `since=<image>`：显示创建时间晚于指定镜像的所有镜像。
		- `reference=<pattern>`：按镜像名称模糊匹配，支持通配符 `*`。

如需查看更多选项，请使用：

```bash
docker image ls --help
```

输出示例：

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
