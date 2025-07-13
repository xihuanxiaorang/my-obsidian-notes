---
tags:
  - DevKit
  - EnvironmentSetup
create_time: 2024/12/16 10:54
update_time: 2025/07/13 12:58
---

## 快捷键

### 常用编辑操作

- **快速修复 / 生成变量、导入包、重构代码**：`Alt + Enter`
- **生成构造方法、Getter/Setter、`equals()` / `hashCode()`、`toString()`、测试方法等**：`Alt + Insert`
- **复制当前行**：`Ctrl + D`
- **删除当前行**：`Ctrl + Y`
- **移动当前行**：`Shift + Alt + ↑ / ↓`
- **代码包围（如 try-catch、if-else）**：`Ctrl + Alt + T`
- **代码格式化**：`Ctrl + Alt + L`
- **优化导入（整理并去除无用导包）**：`Ctrl + Alt + O`
- **大小写切换**：`Ctrl + Shift + U`

### 导航与搜索

- **全局搜索（任何内容）**：`Shift + Shift`
- **跳到定义（方法/接口/变量）**：`Ctrl + B` 或 `Ctrl + 鼠标左键`
- **跳到方法/接口具体实现**：`Ctrl + Alt + B`
- **查看继承结构**：`Ctrl + H`
- **查看类中所有方法/成员**：`Ctrl + F12`
- **最近打开的文件**：`Ctrl + E`
- **后退一步**：`Ctrl + Alt + ←`
- **前进一步**：`Ctrl + Alt + →`
- **全局替换**：`Ctrl + Shift + R`

### 重构相关

- **重命名**：`Shift + F6`
- **提取方法（Extract Method）**：`Ctrl + Alt + M`
- **重构菜单（Refactor This）**：`Ctrl + Alt + Shift + T`

### 调试与辅助

- **显示类关系图（弹出层）**：`Ctrl + Alt + U`
- **调试时计算表达式**：`Alt + F8`
- **折叠代码**：`Ctrl + NumPad -`
- **展开代码**：`Ctrl + NumPad +`

## 设置

### 如何隐藏不想看到的文件夹或者文件？

File ➡ Settings ➡ Editor ➡ File Types ➡ Ignore Files and Folders，配置不想看到的文件夹或者文件。
![](https://img.xiaorang.fun/202502251743993.png)

如果配置无误还能看到文件夹或者文件的话，请确保没有勾选显示排除的文件选项，如果勾选了的话取消勾选即可！
![](https://img.xiaorang.fun/202502251743994.png)

### 以 TODO 为例添加自定义的实时模板

设置 ➡ 编辑器 ➡ 实时模板，先创建一个属于自己的分组，组名可以根据自己的喜欢取；
![](https://img.xiaorang.fun/202502251743995.png)在创建的分组下新建一个模板，以 <span style="background:rgba(255, 183, 139, 0.55)">TODO</span> 为例，步骤如下所示：

1. 先右键选中新创建的分组，然后点击 + 号选择实时模板；
   ![](https://img.xiaorang.fun/202502251743996.png)
2. 填写模板信息，缩写，描述信息，模板文本，以及编辑模板文本中涉及到的变量，最后选择该模板应用于 Java 环境；
   ![](https://img.xiaorang.fun/202502251743997.png)
3. 设置 ➡ 编辑器 ➡ TODO，先创建一个模式，按照如下方式进行填写；
   ![](https://img.xiaorang.fun/202502251743998.png)
4. 添加一个筛选器，名称任意，模式选择上面新建的，最后点击确定退出设置；
   ![](https://img.xiaorang.fun/202502251743000.png)
5. 打开 TODO 窗口，选中咱们新建的筛选器，这样就只会显示出咱们添加的 TODO，把其他人或其他引入的第三方项目中的 TODO 给过滤掉！
   ![](https://img.xiaorang.fun/202502251743001.png)

### 设置文件的行分隔符为 LF

文件 ➡ 设置 ➡ 编辑器 ➡ 代码样式 ➡ 行分隔符。

### 添加 JDK

1. 点击 "文件"，选择 "项目结构"，快捷键是 "Ctrl+Alt+Shift+S"。
   ![](https://img.xiaorang.fun/202502251743002.png)
2. 弹出 "Project Structure" 窗口，点击 "项目"，选择 "SDK"。
   ![](https://img.xiaorang.fun/202502251743003.png)
3. 选择下拉框中的 "下载 JDK…"。
   ![](https://img.xiaorang.fun/202502251743004.png)
4. 弹出 "下载 JDK" 窗口，选择自己需要的 JDK 版本（如 1.8，17 等等），供应商（如 Amazon，Oracle 等）以及安装路径，最后点击 "下载" 按钮，等待下载完成即可。
   ![](https://img.xiaorang.fun/202502251743005.png)
5. 耐心等待下载安装完成…
   ![](https://img.xiaorang.fun/202502251743006.png)
6. 如果 "SDK" 处的文字不再显示红色就代表已经下载安装完成，最后点击 "确定" 按钮就大功告成啦🌸🌸🌸
   ![](https://img.xiaorang.fun/202502251743007.png)

### 切换中/英文

依次点击：**File** → **Settings** → **Appearance & Behavior** → **System Settings** → **Language and Region**

- 点击 **Language** 选项，选择 **Chinese (Simplified) 简体中文** 切换为中文。
- 也可在同一位置选择 **English** 切换回英文。

### 欢迎界面

要在 IDEA 启动时显示 **Welcome Screen**（欢迎界面）：

- 依次点击：**File** → **Settings** → **Appearance & Behavior** → **System Settings**
- 取消勾选 **"Reopen projects on startup"**（启动时重新打开项目）
- 点击 **OK**

下次启动时，IDEA 将显示 **Welcome Screen** 而不是自动打开上次的项目。

## 插件

- 使用 IDE 内置插件系统安装（推荐）
    - **Preferences (Settings)** → **Plugins** → **Marketplace** → 搜索插件名称 → 点击 **Install** 按钮进行安装；
- 手动安装
    - 到 [JetBrains Marketplace](https://plugins.jetbrains.com/) 上下载与你的 IDE 兼容的最新版本的插件包；
    - **Preferences (Settings)** > **Plugins** > ⚙ > **从磁盘安装插件…** > 选择插件包并安装（无需解压）

安装好后重新启动 **IDE** 即可。

### Translation

> [!quote]
> 插件地址：[Translation - IntelliJ IDEs Plugin | Marketplace (jetbrains.com)](https://plugins.jetbrains.com/plugin/8579-translation)
> 官方文档地址：[TranslationPlugin ❤️ Yii.Guxing (yiiguxing.github.io)](https://yiiguxing.github.io/TranslationPlugin/#/)

TranslationPlugin 是一个基于 IntelliJ IDE/Android Studio 的翻译插件。它集成了<u>谷歌翻译</u>、<u>微软翻译</u>、<u>DeepL 翻译</u>、<u>有道翻译</u>、<u>百度翻译</u>等众多翻译引擎，在你的 IDE 内随时对想要翻译的文本、代码注释、代码文档等进行翻译。

大多数翻译服务都需要注册账号才能访问他们的服务（如：OpenAI、DeepL、有道翻译等）。因此您可能需要注册一个帐号，并获取其**认证密钥**，然后在插件内绑定**认证密钥**：**Preferences (Settings)** → **Tools** → **Translation** → **常规** → **翻译引擎** → **配置…**

以**有道翻译**为例，登陆控制台 → 应用总览 → 创建应用 → 填写相关信息（如应用名称：IntelliJ IDEA Translation，选择服务：文本翻译和文档翻译，接入方式选择：API，应用类别：实用工具）→ 确定。
![](https://img.xiaorang.fun/202502251743008.png)

![](https://img.xiaorang.fun/202502251743009.png)

复制应用 ID 以及密钥信息，如下所示：
![](https://img.xiaorang.fun/202502251743010.png)

### LeetCode Editor

> [!quote]
> 插件地址：[LeetCode Editor - IntelliJ IDEs Plugin | Marketplace (jetbrains.com)](https://plugins.jetbrains.com/plugin/12132-leetcode-editor)
> 官方文档地址：[leetcode-editor/README_ZH.md at master · shuzijun/leetcode-editor (github.com)](https://github.com/shuzijun/leetcode-editor/blob/master/README_ZH.md)

文档已经详细介绍了插件的使用方法，借鉴官方的自定义代码生成配置，一步步摸索完善，如下所示：
![](https://img.xiaorang.fun/202502251743011.png)

- CodeFileName

	```text
	$!velocityTool.camelCaseName(${question.titleSlug})_${question.frontendQuestionId}
	```

- TemplateConstant

	```text
	package fun.xiaorang.leetcode.editor.cn;
	
	/**
	 * @author liulei
	 * @description <a href="https://leetcode.cn/problems/${question.titleSlug}/" style="font-weight:bold;font-size:11px;">LeetCode.${question.frontendQuestionId}.${question.title}<a/>
	 * @github <a href="https://github.com/xihuanxiaorang/java-study">java-study</a>
	
	 * @Copyright 博客：<a href="https://docs.xiaorang.fun">小让の码场</a>  - show me the code
	 * @date $!velocityTool.date()
	 */
	public class $!velocityTool.camelCaseName(${question.titleSlug})_${question.frontendQuestionId} {
	  public static void main(String[] args) {
	       Solution solution = new $!velocityTool.camelCaseName(${question.titleSlug})_${question.frontendQuestionId}().new Solution();
	  }
	  
	  ${question.code}
	}
	```

## Tips✨

### 快速生成测试类

对某个类快速生成测试类：选中需要生成测试代码的类 ➡ 右键 ➡ Go To ➡ Test ➡ Create New Test。
![](https://img.xiaorang.fun/202502251743012.png)

## 激活🚀

### 下载补丁

访问 [JETBRA.IN CHECKER | IPFS](https://3.jetbra.in/) 网站，打开后会发现是一个 IPFS Checker 页面，我们在这个页面中选择一个可用的链接打开。如下所示：
![](https://img.xiaorang.fun/202502251743013.png)

点击页面中的 `jetbra.zip` 链接开始下载我们所需的补丁。
![](https://img.xiaorang.fun/202502251743014.png)

### 安装补丁

首先解压 `jetbra.zip`，然后双击运行 `scripts` 文件夹中的 `install-current-user.vbs` 程序，如下所示：
![](https://img.xiaorang.fun/202502251743015.png)

> [!tip]
> 如果你曾经安装过 `jetbra` 系列的旧版补丁，需要先运行 `uninstall` 开头的脚本。

### 配置补丁

[ja-netfilter](https://zhile.io/2021/11/29/ja-netfilter-javaagent-lib.html) 作者 `zhile` 提到 [JetBrains新版本区域选择的坑](https://zhile.io/2024/09/05/jetbrains-2024-2-region.html)，新版 IDEA 为中国用户提供了专门的激活验证 API，因此我们也需要编辑对应的配置文件。

编辑 `config-jetbrains\url. conf` 文件，新增以下内容用于把新的域名也拦截。

```properties
PREFIX,https://account.jetbrains.com.cn/lservice/rpc/validateKey.action
```

保存配置后，重启正在运行的 IDE，补丁就彻底配置好了。

### 使用激活码进行激活

激活码的好处是离线使用，不需要联网验证。你可以在刚才热心大佬的网站 [JETBRA.IN CHECKER | IPFS](https://3.jetbra.in/) 上获取对应产品的激活码。
![](https://img.xiaorang.fun/202502251743016.png)
