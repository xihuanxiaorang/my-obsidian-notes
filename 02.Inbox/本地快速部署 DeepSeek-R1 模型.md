---
tags:
  - AI
refrence_url: 
create_time: 2025-02-06 19:06
update_time: 2025/02/07 17:18
---

这是一篇在 Windows 平台下使用 Ollama + OpenWebUI 实现大语言模型本地部署的教程。

## Ollama

Ollama 是一个强大的 AI 大模型部署平台，旨在帮助用户轻松的部署和管理 AI 模型，即使没有任何程序开发经验，也可以轻松上手，是一个非常适合初学者的 AI 模型部署平台。

1. 下载：
	前往 [Ollama 官网](https://ollama.com/) 下载适用于你系统的安装包。
	![](https://img.xiaorang.fun/202502061908780.png)
	![](https://img.xiaorang.fun/202502061910636.png)
2. 安装：
	下载安装后，双击安装包进行安装，默认安装在 C 盘的用户文件夹。
	![](https://img.xiaorang.fun/202502061912237.png)
3. 验证安装：
	打开终端，运行以下命令检查安装是否成功：

	```bash
	ollama -v
	```

	![](https://img.xiaorang.fun/202502061915898.png)

## DeepSeek-R1 模型

Ollama 下载的模型默认存储在 **C:\Users\%username%\.ollama\models**，但模型文件动辄几个 G 甚至几十个 G，存储在 C 盘会导致 C 盘空间严重不足，我们可以修改模型文件默认的存储位置，
下载的模型默认保存在 C 盘，非常的不友好，可以新增 `OLLAMA_MODELS` 环境变量指定模型存储位置。

可以使用 `ollama rm deepseek-r1:7b` 命令删除 DeepSeek 模型。

使用 `ollama run deepseek-r1:7b` 命令下载并运行 DeepSeek-R1 大模型，如下所示：
![](https://img.xiaorang.fun/202502062317142.png)

> [!tip]
> 如果使用上述方式下载很慢或者失败的话，可以使用科学上网工具，或者可以去[魔搭社区](https://www.modelscope.cn/) 和 [HF-Mirror](https://hf-mirror.com/) 下载 DeepSeek-R1 的模型文件（GGUF 格式）。

出现上述界面表示大语言模型安装完成，我们可以在这里输入对话，然后按下回车来测试一下。
![](https://img.xiaorang.fun/202502062321313.png)
