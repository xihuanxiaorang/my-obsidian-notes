---
tags:
  - DevKit/Docker
create_time: 2025/07/11 22:02
update_time: 2025/07/16 22:44
priority: 13
---

Dockerfile 是一个**文本文件**，它包含了一系列**指令（Instruction）**，每一条指令构建一层（Layer），因此每一条指令的内容，就是描述该层应当如何构建。

Dockerfile 是一个用于构建 Docker 镜像的**文本文件**，其中包含了一系列**指令（Instructions）**。每条指令定义了镜像构建过程中的一个步骤，对应生成镜像的一层（Layer）。这些层按顺序叠加，最终形成一个可运行的镜像。Docker 引擎会逐条读取并执行这些指令，自动完成镜像的构建流程。

##  格式

1. 以 `#` 开头的行视为注释，在执行 Dockerfile 指令之前会移除注释行。
2. 指令不区分大小写。但是，通常建议使用大写字母，以便更容易地将它们与参数区分开来。
3. 指令从上往下依次执行。
4. 必须以 `FROM` 指令开始，除注释之外。

## 常用指令

### FROM - 指定基础镜像

所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制。而 `FROM` 就是用于**指定基础镜像**，并**初始化一个新的构建阶段**。一个有效的 Dockerfile 必须以 `FROM` 指令开头（除非在它之前使用 `ARG`）。

在 [Docker Hub](https://hub.docker.com/search?q=&type=image&image_filter=official) 上有非常多的高质量的官方镜像，有可以直接拿来使用的服务类的镜像，如 [`nginx`](https://hub.docker.com/_/nginx/)、[`redis`](https://hub.docker.com/_/redis/)、[`mongo`](https://hub.docker.com/_/mongo/)、[`mysql`](https://hub.docker.com/_/mysql/)、[`httpd`](https://hub.docker.com/_/httpd/)、[`php`](https://hub.docker.com/_/php/)、[`tomcat`](https://hub.docker.com/_/tomcat/) 等；也有一些方便开发、构建、运行各种语言应用的镜像，如 [`node`](https://hub.docker.com/_/node)、[`openjdk`](https://hub.docker.com/_/openjdk/)、[`python`](https://hub.docker.com/_/python/)、[`ruby`](https://hub.docker.com/_/ruby/)、[`golang`](https://hub.docker.com/_/golang/) 等。可以在其中寻找一个最符合我们最终目标的镜像为基础镜像进行定制。

如果没有找到对应服务的镜像，官方镜像中还提供了一些更为基础的操作系统镜像，如 [`ubuntu`](https://hub.docker.com/_/ubuntu/)、[`debian`](https://hub.docker.com/_/debian/)、[`centos`](https://hub.docker.com/_/centos/)、[`fedora`](https://hub.docker.com/_/fedora/)、[`alpine`](https://hub.docker.com/_/alpine/) 等，这些操作系统的软件库为我们提供了更广阔的扩展空间。

#### 基本格式

```bash
FROM [--platform=<平台>] <镜像>[:<标签>] [AS <名称>]
```

OR

```bash
FROM [--platform=<平台>] <镜像>[@<摘要>] [AS <名称>]
```

参数说明：
- `<镜像>`：要使用的基础镜像名称，可以来自 Docker Hub 或私有镜像仓库。
- `--platform=<平台>`（可选）：指定镜像的平台（如 `linux/amd64`、`linux/arm64` 或 `windows/amd64`），用于跨平台构建。
- `:<标签>`（可选）：指定镜像的标签（如 `ubuntu:20.04`），省略时默认使用 `latest`。
- `@<摘要>`（可选）：以内容摘要（digest）形式精确指定镜像版本。
- `AS <名称>`（可选）：为该构建阶段命名，便于在后续阶段引用（如多阶段构建）。

### RUN - 执行命令并构建层

### CMD - 容器启动时默认执行的命令
