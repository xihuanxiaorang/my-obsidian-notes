---
tags:
  - DevKit/Docker
create_time: 2025/07/05 22:03
update_time: 2025/07/06 22:03
priority: 1
---

## 前提条件

### 支持的操作系统版本

Docker Engine 仅支持以下 64 位 Ubuntu 版本：

- Ubuntu 24.10（Oracular）
- Ubuntu 24.04 LTS（Noble）
- Ubuntu 22.04 LTS（Jammy）

查看当前系统版本：

```bash
lsb_release -a
```

示例输出：

```bash hl:1,4-6
~# lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 22.04.3 LTS
Release:        22.04
Codename:       jammy
~#
```

支持的系统架构包括：
- `x86_64`（即 amd64）
- `armhf`
- `arm64`
- `s390x`
- `ppc64le`（或 `ppc64el`）

> [!note]
> 基于 Ubuntu 的衍生发行版（如 Linux Mint）虽可能可用，但不在官方支持范围内。

### 卸载旧版本

在安装 Docker Engine 前，建议先移除系统中可能存在的**冲突软件包**。例如：

- `docker.io`
- `docker-compose`
- `docker-compose-v2`
- `docker-doc`
- `podman-docker`

此外，Docker Engine 已内置 `containerd` 和 `runc` （打包在 `containerd.io` 中）。若系统中已安装它们的独立版本，也应一并卸载以避免冲突。

可使用以下命令批量卸载上述可能冲突的软件包：

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

若未安装上述软件包，`apt-get` 会提示无可卸载项。

> [!note]
> 卸载 Docker 并不会自动清除 `/var/lib/docker/` 目录中的镜像、容器、数据卷和网络数据。如需彻底清理并重新安装，请参考下方「 [[#卸载 Docker Engine]] 」部分。

## 安装方式

Docker Engine 提供多种安装方式，根据实际需求选择适合的安装方式：

- [Docker Desktop for Linux](https://docs.docker.com/desktop/setup/install/linux/)：包含 Docker Engine 的一体化桌面应用，是最简单、最快速的入门方式。
- ✅通过官方 `apt` 软件源安装（推荐）：设置 Docker 官方 `apt` 软件源后进行安装，便于后续自动升级和维护。
- 手动下载并安装 `.deb` 包：适用于无法使用 `apt` 软件源的场景，需自行管理版本和升级。
- ✅使用官方安装脚本（仅推荐用于开发和测试环境）：通过便捷脚本快速安装，无需交互，但不建议在生产环境中使用。

### Install using the `apt` repository

首次在新主机上安装 Docker Engine 前，需要先配置 Docker 官方 `apt` 软件源。配置完成后即可通过 `apt` 安装和更新 Docker。

1. 配置 `apt` 软件源

	```bash
	# Add Docker's official GPG key:
	sudo apt-get update
	sudo apt-get install ca-certificates curl
	sudo install -m 0755 -d /etc/apt/keyrings
	sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
	sudo chmod a+r /etc/apt/keyrings/docker.asc
	
	# Add the repository to Apt sources:
	echo \
	  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
	  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
	  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
	sudo apt-get update
	```

2. 安装 Docker 最新版本

	```bash
	sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
	```

	示例输出：

	```bash hl:1
	root@lavm-z2u1k533p1:~# sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
	Reading package lists... Done
	Building dependency tree... Done
	Reading state information... Done
	The following additional packages will be installed:
	  docker-ce-rootless-extras
	Suggested packages:
	  cgroupfs-mount | cgroup-lite docker-model-plugin
	The following NEW packages will be installed:
	  containerd.io docker-buildx-plugin docker-ce docker-ce-cli docker-ce-rootless-extras docker-compose-plugin
	0 upgraded, 6 newly installed, 0 to remove and 245 not upgraded.
	Need to get 0 B/103 MB of archives.
	After this operation, 429 MB of additional disk space will be used.
	Do you want to continue? [Y/n] y
	Selecting previously unselected package containerd.io.
	(Reading database ... 80010 files and directories currently installed.)
	Preparing to unpack .../0-containerd.io_1.7.27-1_amd64.deb ...
	Unpacking containerd.io (1.7.27-1) ...
	Selecting previously unselected package docker-ce-cli.
	Preparing to unpack .../1-docker-ce-cli_5%3a28.3.1-1~ubuntu.22.04~jammy_amd64.deb ...
	Unpacking docker-ce-cli (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Selecting previously unselected package docker-ce.
	Preparing to unpack .../2-docker-ce_5%3a28.3.1-1~ubuntu.22.04~jammy_amd64.deb ...
	Unpacking docker-ce (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Selecting previously unselected package docker-buildx-plugin.
	Preparing to unpack .../3-docker-buildx-plugin_0.25.0-1~ubuntu.22.04~jammy_amd64.deb ...
	Unpacking docker-buildx-plugin (0.25.0-1~ubuntu.22.04~jammy) ...
	Selecting previously unselected package docker-ce-rootless-extras.
	Preparing to unpack .../4-docker-ce-rootless-extras_5%3a28.3.1-1~ubuntu.22.04~jammy_amd64.deb ...
	Unpacking docker-ce-rootless-extras (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Selecting previously unselected package docker-compose-plugin.
	Preparing to unpack .../5-docker-compose-plugin_2.38.1-1~ubuntu.22.04~jammy_amd64.deb ...
	Unpacking docker-compose-plugin (2.38.1-1~ubuntu.22.04~jammy) ...
	Setting up docker-buildx-plugin (0.25.0-1~ubuntu.22.04~jammy) ...
	Setting up containerd.io (1.7.27-1) ...
	Created symlink /etc/systemd/system/multi-user.target.wants/containerd.service → /lib/systemd/system/containerd.service.
	Setting up docker-compose-plugin (2.38.1-1~ubuntu.22.04~jammy) ...
	Setting up docker-ce-cli (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Setting up docker-ce-rootless-extras (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Setting up docker-ce (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Created symlink /etc/systemd/system/multi-user.target.wants/docker.service → /lib/systemd/system/docker.service.
	Created symlink /etc/systemd/system/sockets.target.wants/docker.socket → /lib/systemd/system/docker.socket.
	Processing triggers for man-db (2.10.2-1) ...
	Scanning processes...                                                                                                                                                                                                                      
	Scanning linux images...                                                                                                                                                                                                                   
	
	Running kernel seems to be up-to-date.
	
	No services need to be restarted.
	
	No containers need to be restarted.
	
	No user sessions are running outdated binaries.
	
	No VM guests are running outdated hypervisor (qemu) binaries on this host.
	root@lavm-z2u1k533p1:~# 
	```

3. 验证是否成功安装

   运行测试容器，验证 Docker 是否成功安装：

	```bash
	sudo docker run hello-world
	```

	若输出欢迎信息，说明 Docker 已成功安装并运行。示例输出：

	```bash hl:1
	root@lavm-z2u1k533p1:~# sudo docker run hello-world
	Unable to find image 'hello-world:latest' locally
	latest: Pulling from library/hello-world
	e6590344b1a5: Pull complete 
	Digest: sha256:940c619fbd418f9b2b1b63e25d8861f9cc1b46e3fc8b018ccfe8b78f19b8cc4f
	Status: Downloaded newer image for hello-world:latest
	
	Hello from Docker!
	This message shows that your installation appears to be working correctly.
	
	To generate this message, Docker took the following steps:
	 1. The Docker client contacted the Docker daemon.
	 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
	    (amd64)
	 3. The Docker daemon created a new container from that image which runs the
	    executable that produces the output you are currently reading.
	 4. The Docker daemon streamed that output to the Docker client, which sent it
	    to your terminal.
	
	To try something more ambitious, you can run an Ubuntu container with:
	 $ docker run -it ubuntu bash
	
	Share images, automate workflows, and more with a free Docker ID:
	 https://hub.docker.com/
	
	For more examples and ideas, visit:
	 https://docs.docker.com/get-started/
	
	root@lavm-z2u1k533p1:~# 
	```

	如果下载镜像时遇到超时问题，请先[[#配置镜像加速器 ]]。

> [!tip]
> 如需升级 Docker，只需重新执行步骤 2 的安装命令，系统将会自动安装可用的更新版本。

### Install using the convenience script

Docker 提供了一个安装脚本 [get.docker.com](https://get.docker.com/)，可在开发环境中非交互式快速安装 Docker。这种方式适用于临时部署或自定义初始化脚本中，**不推荐用于生产环境**。该安装脚本的源代码是开源的，托管在 GitHub 的 [`docker-install`](https://github.com/docker/docker-install) 仓库中。

> [!warning] 用前须知
> 在运行脚本前，请务必了解以下风险与限制：
> - 必须使用 `root` 或 `sudo` 权限执行脚本
> - 自动识别系统版本并配置 `apt` / `yum` 等软件源
> - 不支持安装参数自定义（版本、路径等）
> - 默认安装最新稳定版的 Docker、`containerd`、`runc`
> - 不会提示确认即直接安装依赖，可能会引入大量额外软件包
> - 不支持升级已安装版本，重复运行可能导致依赖不一致

> [!tip]
> 在生产部署前，请先在测试环境中验证此脚本的行为。可使用 `--dry-run` 预览脚本将执行哪些操作：
> ```bash
> curl -fsSL https://get.docker.com -o get-docker.sh
> sudo sh ./get-docker.sh --dry-run
> ```

🚀从 [get.docker.com](https://get.docker.com/) 下载并运行安装脚本，以在 Linux 系统中安装最新稳定版 Docker：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

示例输出：

```bash hl:1,2,60
root@lavm-z2u1k533p1:~# curl -fsSL https://get.docker.com -o get-docker.sh
root@lavm-z2u1k533p1:~# sudo sh get-docker.sh
# Executing docker install script, commit: 53a22f61c0628e58e1d6680b49e82993d304b449
+ sh -c apt-get -qq update >/dev/null
+ sh -c DEBIAN_FRONTEND=noninteractive apt-get -y -qq install ca-certificates curl >/dev/null
+ sh -c install -m 0755 -d /etc/apt/keyrings
+ sh -c curl -fsSL "https://download.docker.com/linux/ubuntu/gpg" -o /etc/apt/keyrings/docker.asc
+ sh -c chmod a+r /etc/apt/keyrings/docker.asc
+ sh -c echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu jammy stable" > /etc/apt/sources.list.d/docker.list
+ sh -c apt-get -qq update >/dev/null
+ sh -c DEBIAN_FRONTEND=noninteractive apt-get -y -qq install docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-ce-rootless-extras docker-buildx-plugin >/dev/null
+ sh -c docker version
Client: Docker Engine - Community
 Version:           28.3.1
 API version:       1.51
 Go version:        go1.24.4
 Git commit:        38b7060
 Built:             Wed Jul  2 20:56:22 2025
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          28.3.1
  API version:      1.51 (minimum version 1.24)
  Go version:       go1.24.4
  Git commit:       5beb93d
  Built:            Wed Jul  2 20:56:22 2025
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.7.27
  GitCommit:        05044ec0a9a75232cad458027ca83437aae3f4da
 runc:
  Version:          1.2.5
  GitCommit:        v1.2.5-0-g59923ef
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0

================================================================================

To run Docker as a non-privileged user, consider setting up the
Docker daemon in rootless mode for your user:

    dockerd-rootless-setuptool.sh install

Visit https://docs.docker.com/go/rootless/ to learn about rootless mode.


To run the Docker daemon as a fully privileged service, but granting non-root
users access, refer to https://docs.docker.com/go/daemon-access/

WARNING: Access to the remote API on a privileged Docker daemon is equivalent
         to root access on the host. Refer to the 'Docker daemon attack surface'
         documentation for details: https://docs.docker.com/go/attack-surface/

================================================================================

root@lavm-z2u1k533p1:~# docker --version
Docker version 28.3.1, build 38b7060
root@lavm-z2u1k533p1:~# 
```

在 Debian 系 Linux 发行版（如 Ubuntu）中，Docker 服务会自动启动。而在 RPM 系发行版（如 CentOS、Fedora、RHEL、SLES）中，需使用 `systemctl` 或 `service` 命令手动启动 Docker 服务。默认情况下，非 root 用户无法运行 Docker 命令。

若通过便捷脚本安装 Docker，请使用软件包管理器（如 `apt` 或 `yum`）进行后续升级。不建议重复运行脚本进行更新，避免覆盖源配置或产生依赖冲突。

## 配置镜像加速器

```bash
# 创建配置目录（如果不存在）
sudo mkdir -p /etc/docker

# 写入镜像加速配置文件（可根据需要替换为你自己的镜像地址）
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me"
  ]
}
EOF

# 重载并重启 Docker 服务使配置生效
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 卸载 Docker Engine

1. 卸载 Docker 引擎及其组件（包括 CLI、containerd、Compose 插件等）：

	```bash
	sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
	```

	示例输出：

	```bash hl:1
	root@lavm-z2u1k533p1:~# sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
	Reading package lists... Done
	Building dependency tree... Done
	Reading state information... Done
	The following packages were automatically installed and are no longer required:
	  libltdl7 libslirp0 pigz slirp4netns
	Use 'sudo apt autoremove' to remove them.
	The following packages will be REMOVED:
	  containerd.io* docker-buildx-plugin* docker-ce* docker-ce-cli* docker-ce-rootless-extras* docker-compose-plugin*
	0 upgraded, 0 newly installed, 6 to remove and 245 not upgraded.
	After this operation, 429 MB disk space will be freed.
	Do you want to continue? [Y/n] y
	(Reading database ... 80247 files and directories currently installed.)
	Removing docker-ce (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Removing containerd.io (1.7.27-1) ...
	Removing docker-buildx-plugin (0.25.0-1~ubuntu.22.04~jammy) ...
	Removing docker-ce-cli (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Removing docker-ce-rootless-extras (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Removing docker-compose-plugin (2.38.1-1~ubuntu.22.04~jammy) ...
	Processing triggers for man-db (2.10.2-1) ...
	(Reading database ... 80013 files and directories currently installed.)
	Purging configuration files for docker-ce (5:28.3.1-1~ubuntu.22.04~jammy) ...
	Purging configuration files for containerd.io (1.7.27-1) ...
	root@lavm-z2u1k533p1:~# 
	```

2. 上述操作不会自动删除已有的镜像、容器、数据卷及自定义配置。如果您希望彻底清理 Docker 所有数据，可执行以下命令：

	```bash
	sudo rm -rf /var/lib/docker
	sudo rm -rf /var/lib/containerd
	```

3. 删除源列表和密钥文件：

	```bash
	sudo rm /etc/apt/sources.list.d/docker.list
	sudo rm /etc/apt/keyrings/docker.asc
	```

您必须手动删除任何已编辑的配置文件。
