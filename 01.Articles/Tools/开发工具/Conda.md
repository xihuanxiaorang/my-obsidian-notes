---
tags:
  - Python
  - DevTool
  - Tool
  - EnvironmentSetup
refrence_url:
  - https://www.bilibili.com/video/BV1BFSJYEEj2?vd_source=84272a2d7f72158b38778819be5bc6ad
create_time: 2025-02-09 21:52
update_time: 2025/02/11 17:51
---

## 简介

- Conda 是一款开源的包和环境管理工具，支持 Python、R、Ruby、Lua 等多种语言，兼容 Windows、macOS 和 Linux。
- 可快速安装、运行和更新软件包及其依赖。
- 便捷创建、保存、加载和切换独立环境，灵活管理依赖，互不影响。

## 下载 & 安装

Conda 存在如下两个版本：

- **Miniconda**：轻量版，仅包含 Conda 和 Python，适合希望手动安装依赖的用户。🚀🚀🚀推荐安装 Miniconda，占用空间小，按需安装依赖。
- **Anaconda**：完整版本，包含 Conda 以及大量预装的科学计算和数据分析库（如 NumPy、Pandas、Scikit-learn）。

前往 [Anaconda](https://www.anaconda.com/download/#) 官网或者[清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/)（推荐👍👍👍）进行下载，点击右侧的 "获取下载链接" ➡️ 在弹框中选择 "应用软件" 一栏 ➡️ 点击 "Conda" ➡️ 选择适用于你操作系统的最新 Miniconda 安装包 ➡️ 点击等待下载完成。
![](https://img.xiaorang.fun/202502111750222.png)
双击运行安装包，开始进行安装，安装过程非常简单，只需要一直点击 ➡️ 下一步即可。在安装过程中，有两个步骤值得注意：
1. 自定义软件的安装路径，如 `E:\devsoft\miniconda3`。
	![](https://img.xiaorang.fun/202502111750224.png)
2. 高级安装选项（Advanced Installation Options），用于自定义 Miniconda 在 Windows 上的集成方式。
	![](https://img.xiaorang.fun/202502111750225.png)
	每个选项的含义如下：
	- **Create shortcuts（创建快捷方式）✅**
		- 在"开始菜单"或桌面创建快捷方式，建议勾选。
	- **Add Miniconda3 to my PATH environment variable（将 Miniconda 添加到 PATH 环境变量）❌（不推荐）**
		- **正确做法**：安装完成后，使用 **"Anaconda Prompt" 或 "Miniconda Prompt"** 来运行 `conda` 命令，而不是直接在 CMD 或 PowerShell 中使用。
		- 勾选该选项虽然可以直接在 CMD 或 PowerShell 运行 `conda` 命令，但可能与系统已有的 Python 版本冲突，因此**不建议勾选**。
	- **Register Miniconda3 as my default Python 3.12（将 Miniconda3 设为默认 Python 3.12）✅（推荐）**
	    - 允许其他程序（如 VSCode、PyCharm）自动检测并使用 Miniconda 的 Python 版本，**建议勾选**。
	- **Clear the package cache upon completion（安装后清理包缓存）✅（推荐）**
	    - 释放磁盘空间，不影响功能，**建议勾选**。

## 环境变量配置 (可选)

在终端中使用 `conda` 命令时会报如下错误：
![](https://img.xiaorang.fun/202502111750226.png)
出现该报错的原因在于 `conda` 命令无法被识别，因此我们需要配置一下系统环境变量。

1. 右键点击 "计算机" 或 "此电脑"，选择 "属性"。
2. 点击 "高级系统设置"。
3. 在弹出的 "系统属性" 窗口中，点击 "环境变量"。
4. 在 "系统变量" 区域，点击 "新建"。
    1. 新建 <u>MINICONDA_HOME</u> 系统变量，变量值为 miniconda 的安装路径，如 `E:\devsoft\miniconda3`。
5. 配置 Path 系统变量。
    1. 在 "系统变量" 中找到 Path 变量，点击 "编辑"。
    2. 点击 "新建"，添加 `%MINICONDA_HOME%`、`%MINICONDA_HOME%\Scripts` 和 `%MINICONDA_HOME%\Library\bin`，然后尽量将其 "上移"。
    3. 最后一路点击 "确定" 进行保存配置。

## 更新镜像源

> [!quote]
> https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/

各系统都可以通过修改用户目录下的 `.condarc` 文件来使用清华大学开源软件镜像站。

不同系统下的 `.condarc` 目录如下：
- macOS: `${HOME}/.condarc`
- Windows: `C:\Users\<YourUserName>\.condarc`
- Linux: `${HOME}/.condarc`

> [!note]
> 由于 Windows 用户无法直接创建名为 `.condarc` 的文件，所以需要先生成该文件之后再进行修改。
> 搜索应用，以管理员身份运行 "Anaconda Prompt"，在打开的终端中运行 `conda config --set show_channel_urls yes` 命令。

在用户目录下使用记事本打开 `.condarc` 文件，先清空文件中原有内容，然后拷贝以下内容至该文件中：

```
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

运行 `conda clean -i` 命令清除索引缓存，保证用的是镜像站提供的索引。

> [!tip]
> ![[python#^b672a0]]

## 常用命令

1. Conda 版本和信息

	```bash
	conda --version           # 查看 Conda 版本
	conda info                # 显示 Conda 配置信息
	conda list                # 查看已安装的所有包
	```

2. 管理环境 (工作区)🚀🚀🚀

	```bash
	conda create -n myenv python=3.12  # 创建名为 myenv 的环境，并安装指定版本的 Python
	conda env list                     # 查看已创建的环境
	conda activate myenv                # 激活 myenv 环境
	conda deactivate                    # 退出当前环境
	conda remove -n myenv --all         # 删除 myenv 环境
	```

3. 管理软件包

	```bash
	conda install numpy pandas          # 安装 NumPy 和 Pandas
	conda update numpy                  # 更新 NumPy
	conda uninstall numpy                # 卸载 NumPy
	conda list                           # 查看当前环境已安装的包
	```

4. 导出和恢复环境

	```bash
	conda env export > environment.yml   # 导出当前环境到文件
	conda env create -f environment.yml  # 从 environment.yml 文件创建环境
	```
