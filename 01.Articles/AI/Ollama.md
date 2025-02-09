---
tags:
  - AI
refrence_url:
  - https://www.bilibili.com/video/BV15zNGeYE8M?vd_source=84272a2d7f72158b38778819be5bc6ad
  - https://www.bilibili.com/video/BV1QtNmeoEe3/?share_source=copy_web&vd_source=84272a2d7f72158b38778819be5bc6ad
create_time: 2025-02-07 17:20
update_time: 2025/02/09 23:16
---

Ollama 是一款强大的 AI 大模型部署平台，旨在简化 AI 模型的部署与管理。即使没有任何编程经验，用户也能快速上手，非常适合初学者。

## 下载

前往 [Ollama 官网](https://ollama.com/) 下载适用于你操作系统的安装包。
![](https://img.xiaorang.fun/202502061908780.png)
![](https://img.xiaorang.fun/202502061910636.png)

## 安装✨

‼️ ⚠️ **注意：Ollama 默认安装在 C 盘，且无法更改路径**。

为了节省 C 盘空间，建议安装到其他盘，那么该如何实现呢？🌠🌠🌠在 Ollama 安装包所在目录，**右键以管理员身份打开终端（CMD）**，运行以下命令，Ollama 将按指定路径进行安装。

```bash
./OllamaSetup.exe /DIR=G:\AI\Ollama
```

![](https://img.xiaorang.fun/202502091304351.png)

安装完成后，打开终端运行以下命令，检查 Ollama 是否安装成功。

```bash
ollama -v
```

![](https://img.xiaorang.fun/202502061915898.png)

## 模型✨

更改安装路径仅影响软件本身，下载的 AI 模型仍默认存储在 C 盘。那么该如何更改模型存储路径呢？🚀🚀🚀可通过新增系统环境变量 `OLLAMA_MODELS` 设定模型存储位置，如 `G:\AI\Ollama\models`。
![](https://img.xiaorang.fun/202502091726354.png)

为了测试环境变量是否生效？在**新建终端**中运行以下命令下载 [[DeepSeek-R1]] 模型（以最小的 1.5b 为例）。

```bash
ollama run deepseek-r1:1.5b
```

> [!tip]
> 如果下载速度逐渐变慢，可使用 `Ctrl + C` 取消下载，然后重新运行命令，下载会从上次进度继续。

![](https://img.xiaorang.fun/202502091754444.png)

## 常用命令

1. 检查 Ollama 版本

	```bash
	ollama -v
	```

	查看当前安装的 Ollama 版本。

2. 查看已安装的模型

	```bash
	ollama list
	```

	列出本地已下载的 AI 模型。

3. 下载并运行模型

	```bash
	ollama run <模型名称>
	```

	例如：

	```bash
	ollama run deepseek-r1:1.5b
	```

	下载并运行 DeepSeek-R1（1.5b 版本）模型。

4. 手动下载模型

	```bash
	ollama pull <模型名称>
	```

	例如：

	```bash
	ollama pull qwen:4b  
	```

	仅下载模型，不立即运行。

5. 删除本地模型

	```bash
	ollama rm <模型名称>
	```

	例如：

	```bash
	ollama rm deepseek-r1:1.5b
	```

	删除指定模型，释放存储空间。

6. 创建自定义模型

	```bash
	ollama create <模型名称> -f <Modelfile>
	```

	例如：

	```bash
	ollama create my-model -f Modelfile
	```

	根据 `Modelfile` 定义自定义 AI 模型。

## 补充

### 环境变量

| 参数                       | 标识与配置                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **OLLAMA_MODELS**        | 表示模型文件的存放目录，默认目录为**当前用户目录**即  `C:\Users%username%.ollama\models`  <br>Windows 系统 **建议不要放在 C 盘**，可放在其他盘（如 `G:\AI\Ollama\models`）        |
| **OLLAMA_HOST**          | 表示 Ollama 服务监听的网络地址，默认为 **127.0.0.1**   <br>如果想要允许其他电脑访问 Ollama（如局域网中的其他电脑），建议设置成 **0.0.0.0**                                          |
| OLLAMA_PORT              | 表示 Ollama 服务监听的默认端口，默认为 **11434**   <br>如果端口有冲突，可以修改设置成其他端口（如 **8080** 等）                                                              |
| OLLAMA_ORIGINS           | 表示 HTTP 客户端的请求来源，使用半角逗号分隔列表  <br>如果本地使用不受限制，可以设置成星号 `*`                                                                                |
| OLLAMA_KEEP_ALIVE        | 表示大模型加载到内存中后的存活时间，默认为 **5m**（即 5 分钟）  <br>（如纯数字 300 代表 300 秒，0 代表处理请求响应后立即卸载模型，任何负数则表示一直存活）  <br>建议设置成 **24h** ，即模型在内存中保持 24 小时，提高访问速度 |
| OLLAMA_NUM_PARALLEL      | 表示请求处理的并发数量，默认为 **1** （即单并发串行处理请求）  <br>建议按照实际需求进行调整                                                                                   |
| OLLAMA_MAX_QUEUE         | 表示请求队列长度，默认值为 **512**  <br>建议按照实际需求进行调整，超过队列长度的请求会被抛弃                                                                                  |
| OLLAMA_DEBUG             | 表示输出 Debug 日志，应用研发阶段可以设置成 **1** （即输出详细日志信息，便于排查问题）                                                                                     |
| OLLAMA_MAX_LOADED_MODELS | 表示最多同时加载到内存中模型的数量，默认为 **1** （即只能有 1 个模型在内存中）                                                                                           |
