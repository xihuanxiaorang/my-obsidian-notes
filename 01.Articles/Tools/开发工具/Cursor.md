---
tags:
  - AI
  - DevKit
create_time: 2025-02-13 11:31
update_time: 2025/02/14 18:38
---

## 下载 & 安装

1. 前往[官方](https://www.cursor.com/cn)下载适用于你操作系统的安装包。
	![](https://img.xiaorang.fun/202502132155298.png)

2. ‼️ ⚠️ **注意：Cursor 默认安装在 C 盘，且无法更改路径**。
	为了节省 C 盘空间，建议安装到其他盘，那么该如何实现呢？🌠🌠🌠在 Cursor 安装包所在目录，**右键以管理员身份打开终端（CMD）**，运行以下命令，Cursor 将按指定路径进行安装。

	```bash
	Start-Process '"Cursor Setup 0.45.11 - x64.exe"' '/D="E:\Cursor"'
	```

	![](https://img.xiaorang.fun/202502132151517.png)

3. 进入配置向导页面，语言填写 "中文", 其他选项保持默认即可。
	![](https://img.xiaorang.fun/202502132152490.png)

4. 询问是否要从 VS Code 导入扩展、设置和快捷键，以便快速开始使用 Cursor 编辑器？
	- **Start from Scratch**：如果你不想导入任何设置，可以选择从头开始使用 Cursor。
	- **Use Extensions**：点击该按钮后，你可以选择导入你在 VS Code 中使用的设置。
	![](https://img.xiaorang.fun/202502132152674.png)

5. 数据偏好设置页面，询问你是否同意收集使用数据以帮助改进软件？
	- **Help Improve Cursor**：启用此选项后，Cursor 会收集你的使用数据，例如在编辑器中进行的操作、代码片段、聊天中的问题等。这些数据用于改善软件。
	- **Privacy Mode**：如果启用隐私模式，Cursor 将不会存储任何你输入的问题或代码，也不会将这些数据发送给第三方。
	![](https://img.xiaorang.fun/202502132153496.png)

## 注册 & 登录

1. 注册登录界面，提示你进行登录或注册一个账号。
	- **注册账号 (Sign Up)**：如果你还没有账号，可以点击 **"注册"** 按钮创建一个新账户。
	- **登录 (Log In)**：如果你已有账号，可以点击 **"登录"** 按钮登录到你的账户。
	![](https://img.xiaorang.fun/202502132153327.png)

2. 填写姓名以及邮箱地址
	![](https://img.xiaorang.fun/202502132153348.png)

3. 填写密码
	![](https://img.xiaorang.fun/202502132154849.png)

4. 填写验证码
	![](https://img.xiaorang.fun/202502132154835.png)

5. 询问是否登录到 Cursor 桌面端？点击 "YES, LOG IN"
	![](https://img.xiaorang.fun/202502132154946.png)

## 插件安装

- [Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)
- [Python](https://marketplace.cursorapi.com/items?itemName=ms-python.python)
