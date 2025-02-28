---
tags:
  - AI
create_time: 2025-02-11 18:23
update_time: 2025/02/13 11:09
---

[Open WebUI](https://github.com/open-webui/open-webui) 是一个可扩展、功能丰富且用户友好的自托管 AI 平台，旨在完全离线运行。它支持各种 LLM 运行器，如 [[Ollama]] 和 OpenAI 兼容的 API，并内置了 RAG 推理引擎，使其成为强大的 AI 部署解决方案。
![](https://img.xiaorang.fun/202502112154423.gif)

## 主要功能

- 🚀 **轻松部署**：支持 Docker 或 Kubernetes（kubectl、kustomize、helm）一键安装，同时兼容 `ollama` 和 `cuda` 版本镜像，简化部署流程。
- 🤝 **Ollama / OpenAI API 集成**：无缝集成 OpenAI 兼容 API，与 Ollama 模型协同工作。可自定义 OpenAI API URL，连接 **LMStudio、GroqCloud、Mistral、OpenRouter** 等多种服务。
- 🛡️ **精细化权限与用户组管理**：管理员可创建详细的用户角色和权限，实现安全访问控制。此功能不仅增强了安全性，还提供了高度可定制的用户体验，提升用户的归属感和责任感。
- 📱 **响应式设计**：适配 **PC、笔记本、移动设备**，提供一致流畅的体验。
- 📱 **PWA（渐进式 Web 应用）支持**：在移动设备上提供类原生应用体验，可在本地运行并支持离线访问。
- ✒️🔢 **完整的 Markdown & LaTeX 支持**：增强 LLM 交互体验，支持格式化文本和数学公式输入。
- 🎤📹 **免提语音 / 视频通话**：集成语音和视频通话功能，使对话更加动态和互动。
- 🛠️ **模型构建器**：通过 Web UI 轻松创建 Ollama 模型，可定制角色、聊天元素，并支持社区模型导入。
- 🐍 **内置 Python 函数调用工具**：在工具工作区支持代码编辑器，允许用户自定义 Python 函数（BYOF），与 LLMs 无缝集成。
- 📚 **本地 RAG（检索增强生成）集成**：支持将文档交互整合到聊天体验中，可直接加载文档或将文件添加到文档库，并通过 `#` 命令轻松访问。
- 🔍 **RAG 网络搜索**：支持多种搜索引擎，如 **SearXNG、Google PSE、Brave Search、serpstack、serper、Serply、DuckDuckGo、TavilySearch、SearchApi、Bing**，并将搜索结果直接注入聊天内容。
- 🌐 **网页浏览能力**：使用 `#` 命令 + URL 将网页内容直接融入聊天，提高对话的丰富度和深度。
- 🎨 **图像生成集成**：支持 **AUTOMATIC1111 API、ComfyUI（本地）、OpenAI DALL-E（云端）**，在聊天中生成动态视觉内容。
- ⚙️ **多模型对话**：同时调用多个模型，结合各自优势，提供更优质的回答体验。
- 🔐 **基于角色的访问控制（RBAC）**：确保访问安全，只有授权用户可使用 Ollama，模型创建 / 拉取权限仅限管理员。
- 🌐🌍 **多语言支持**：提供国际化（i18n）支持，欢迎贡献翻译，扩展更多语言版本。
- 🧩 **插件与自定义管道支持**：通过 **Pipelines 插件框架**，可将自定义逻辑和 Python 库集成到 Open WebUI。例如：
	- **函数调用**
	- **用户速率限制**
	- **使用监控（如 Langfuse）**
	- **实时翻译（LibreTranslate）**
	- **有害内容过滤**
	- **更多高级功能**
- 🌟 **持续更新**：Open WebUI 处于持续优化中，定期推出新功能和修复补丁。

## 安装✨

Open WebUI 可通过 `pip`（[[python]] 包管理器）安装。在安装前，请确保你使用的是 **Python 3.11**，以避免兼容性问题。

1. **安装 Open WebUI**
	打开终端，运行以下命令：

	```bash
	pip install open-webui
	```

	该过程需要等待一会儿...
2. **运行 Open WebUI**
	安装完成后，执行以下命令启动 Open WebUI：

	```bash
	open-webui serve
	```

	启动服务，可在 **[http://localhost:8080](http://localhost:8080)** 访问 Open WebUI。🚀
	![](https://img.xiaorang.fun/202502112151712.png)
