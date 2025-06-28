---
tags:
  - DevKit
  - Frontend/Python
create_time: 2024-12-28T17:30:00
update_time: 2025/06/28 23:29
---

> [!tip]
> 正式安装前，可用 [[软件卸载工具#^6ce691|HiBit Uninstaller]] 或 Windows 自带的卸载工具清理旧版本（如已安装的话）。

1. 访问 [Python](https://www.python.org/) 首页，点击 **Downloads**，并选择 **Windows**。
   ![](https://img.xiaorang.fun/202502251802822.png)
2. 在下载页面，找到最新的稳定版本，点击 **"Windows installer (64-bit)"** 下载适用于 Windows 的安装包。
   ![](https://img.xiaorang.fun/202502251802823.png)
3. 双击运行安装包，在安装界面中：
   ![](https://img.xiaorang.fun/202502251802824.png)
   - 勾选 **"Add python.exe to PATH"**（将 Python 添加到系统环境变量）。
   - 点击 **"Customize installation"** 以自定义安装配置。
4. 在 **Optional Features** 界面时，建议勾选以下全部选项：
   ![](https://img.xiaorang.fun/202502251802825.png)
	- **Documentation**：推荐：安装 Python 官方文档，方便在本地查阅帮助信息。
	- **pip** （必须勾选）：安装 `pip`，用于管理和安装第三方 Python 包。
	- **td/tk and IDLE**：推荐：安装 `tkinter`（GUI 库）和 IDLE（自带的开发环境），便于学习和开发。
	- **Python test suite**：推荐：安装标准库的测试套件，如果你需要验证或调试 Python 标准库时会用到。
	- **py launcher**：必须：安装全局 `py` 启动器，便于在命令行运行 Python。建议同时勾选 **"for all users"**，以便所有账户都能使用 `py` 启动器。
5. 在 **Advanced Options** 界面时，建议勾选以下全部选项以获得更完整的功能支持：
   ![](https://img.xiaorang.fun/202502251802826.png)
   - **Install Python 3.12 for all users**：推荐：为所有用户安装 Python，方便在多个账户下使用。
   - **Associate files with Python (requires the 'py' launcher)**：推荐：将 `.py` 文件与 Python 关联，双击即可运行。
   - **Create shortcuts for installed applications**：推荐：创建快捷方式，方便打开 Python 应用程序（如 IDLE）。
   - **Add Python to environment variables**：必须：将 Python 添加到系统环境变量（PATH），以便通过命令行直接运行。
   - **Precompile standard library**：推荐：预编译标准库，提升运行效率。
   - **Download debugging symbols**：可选：主要用于调试，勾选不会影响日常使用，建议启用。
   - **Download debug binaries (requires VS 2017 or later)**：可选：需要 Visual Studio 调试工具，仅在需要调试 Python 源代码时有用，但也可以勾选以备不时之需。
6. 设置自定义安装路径，如 `E:\devsoft\Python312`。
7. 点击 **Install** 后等待安装完成，直到看到 **Setup was successful** 界面，点击 **Close** 结束安装。
8. 打开 **命令提示符 (CMD)** 或 **PowerShell**，验证安装是否成功：

	```bash
	python --version
	pip --version
	```

	如果正确显示 Python 和 pip 的版本号，则安装成功。
	![](https://img.xiaorang.fun/202502251802827.png)
9. pip 加速（清华镜像源）：`pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple` ^b672a0
