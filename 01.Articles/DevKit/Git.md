---
tags:
  - Git
  - DevKit
create_time: 2024-12-29 17:30
update_time: 2025/02/28 18:14
---

## 安装

访问 [Git - Downloading Package (git-scm.com)](https://git-scm.com/download/win)，下载 Windows 版本（需要根据自己的系统进行选择）
![](https://img.xiaorang.fun/202502281752504.png)
下载完成之后，以管理员身份运行 `Git-2.42.0.2-64-bit.exe` 文件，然后点击 Next 进行下一步；
![](https://img.xiaorang.fun/202502281752135.png)
勾选 `Add a Git Bash Profile to Windows Terminal`，然后一直点击 Next 下一步直至安装完成即可！
![](https://img.xiaorang.fun/202502281753282.png)

## 初次运行 Git 前的配置

一般在新的系统上，都需要先配置下自己的 Git 工作环境。配置工作只需一次，以后升级时还会沿用现在的配置。当然，如果需要，你随时可以使用相同的命令修改已有的配置。

Git 提供了一个叫做 git config 的工具（实际是 `git-config` 命令，只不过可以通过 `git` 加一个名字来称呼此命令），专门用来**配置**或**读取**相应的工作**环境变量**。而正是由这些环境变量，决定了 Git 在各个环节的具体工作方式和行为。这些变量可以存放在以下三个不同的地方：

- `/etc/gitconfig` 文件：系统中对所有用户都普遍适用的配置。若使用 `git config` 时用 `--system` 选项，读写的就是这个文件；
- `~/.gitconfig` 文件：用户目录下的配置文件只适用于该用户。若使用 `git config` 时用 `--global` 选项，读写的就是这个文件；
- 当前项目的 git 目录中的配置文件（也就是工作目录中的 `.git/config` 文件）：这里的配置仅仅针对当前项目有效。每一个级别的配置都会**覆盖**上层的相同配置，所以 `.git/config` 里的配置会覆盖 `/etc/gitconfig` 中的同名变量；

### 用户信息

第一个要配置的是你个人的**用户名称**和**邮件地址**。这两条配置很重要，每次 Git 提交时都会引用这两条信息，说明是谁提交了更新，所以会随更新内容一起被永久纳入历史记录：

```bash
git config --global user. name "小让"
git config --global user. email 15019474951@163.com
```

![](https://img.xiaorang.fun/202502281753159.png)

如果使用了 `--global` 选项，那么更改的配置文件就是位于你**用户主目录**下的那个，以后你所有的项目都会默认使用这里配置的用户信息。如果要在某个特定的项目中使用其他名字或者电邮，只需去掉 `--global` 选项重新配置即可，新的设定就会保存在**当前项目**的 `.git/config` 文件里。

### 文本编辑器

Git 需要你输入一些额外消息的时候，会自动调用一个外部文本编辑器给你用。在安装 Git 时已经选择使用 `Vim` 作为默认的文本编辑器。
![](https://img.xiaorang.fun/202502281754045.png)

如果你有其他偏好，比如 Emacs 的话，可以重新设置：

```bash
git config --global core. editor emacs
```

### 查看配置信息

要检查已有的配置信息，可以使用 `git config --list` 命令；
![](https://img.xiaorang.fun/202502281754493.png)
有时候会看到重复的变量名，那就说明它们来自不同的配置文件（比如 `/etc/gitconfig` 和 `~/.gitconfig`），不过最终 Git 实际采用的是最后一个。
也可以直接查阅某个环境变量的设定，只要把特定的名字跟在后面即可，如下所示：`git config user.name`。
![](https://img.xiaorang.fun/202502281754317.png)

## 添加远程仓库

### 设置远程仓库地址

使用以下命令将本地仓库与远程仓库连接起来：

```bash
git remote add origin <远程仓库地址>
```

- `origin` 是远程仓库的默认名称（可以更换成其他名称）。
- `<远程仓库地址>` 是远程仓库的 URL，比如：
    - HTTPS 地址：`https://github.com/username/repo.git`
    - SSH 地址：`git@github.com:username/repo.git`

### 验证远程仓库连接

可以使用以下命令查看远程仓库的配置信息：

```bash
git remote -v
```

输出类似以下内容：

```
origin  https://github.com/username/repo.git (fetch)
origin  https://github.com/username/repo.git (push)
```

### 拉取远程仓库内容

使用以下命令拉取远程仓库的内容：

```bash
git pull origin main --allow-unrelated-histories
```

- `main` 是远程仓库的主分支（根据实际分支名称替换）。
- `--allow-unrelated-histories` 参数用于合并本地仓库与远程仓库两个独立的历史记录。

>[!note]
> 在拉取远程仓库后，可能会产生冲突，如果你只想保留本地或远程仓库的内容，而忽略另一方的内容，可以直接强制同步：
>
>- 保留远程仓库内容（覆盖本地）：
>
> 	```bash
> 	git fetch origin
> 	git reset --hard origin/main
> 	```
>
>- 保留本地仓库内容（覆盖远程）：
>
> 	 ```bash
> 	 git push origin main --force
> 	```
>
> <font color="#d83931">强制覆盖会丢失被覆盖的一方的所有历史记录，谨慎使用！</font>

### 推送本地代码到远程仓库

将本地代码推送到远程仓库：

```bash
git push origin main
```

## 其他

### 通过 SSH 连接到 GitHub

> [!quote]
> [生成新的 SSH 密钥并将其添加到 ssh-agent - GitHub 文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

步骤如下所示：

1. 打开 Git Bash 或者 Windows Terminal 终端；
2. 粘贴以下文本（替换为本人的 Github 邮件地址）；

   ```bash
     ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

   当系统提示您"Enter a file in which to save the key（输入要保存密钥的文件）"时，可以按 Enter 键接受默认文件位置。
   ![](https://img.xiaorang.fun/202502281755840.png)

   > [!note]
   > 如果以前创建了 SSH 密钥，则 ssh-keygen 可能会要求重写另一个密钥，在这种情况下，我们建议创建自定义命名的 SSH 密钥。为此，请键入默认文件位置，并将 id_ssh_keyname 替换为自定义密钥名称。

   ```bash
   Enter a file in which to save the key (/c/Users/YOU/. ssh/id_ALGORITHM):[Press enter]
   ```

3. 在提示符下，键入安全密码；为了后续使用方便此处不设置密码，直接回车即可；

    ```bash
    > Enter passphrase (empty for no passphrase): [Type a passphrase]
    > Enter same passphrase again: [Type passphrase again]
    ```

4. [将 SSH 密钥添加到 ssh-agent](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent)
    1. 使用 `eval "$(ssh-agent -s)"` 命令确保 ssh-agent 正在运行；
       ![](https://img.xiaorang.fun/202502281755820.png)
    2. 使用 `ssh-add ~/.ssh/id_ed25519` 命令将 SSH 私钥添加到 ssh-agent；
        如果使用其他名称创建了密钥或要添加具有其他名称的现有密钥，请将命令中的 ided25519 替换为私钥文件的名称。
        ![](https://img.xiaorang.fun/202502281755454.png)
5. [新增 SSH 密钥到 GitHub 帐户](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
    1. 使用 `clip < ~/.ssh/id_ed25519.pub` 命令将 SSH 公钥复制到剪贴板；如果您的 SSH 公钥文件与示例代码不同，请修改文件名以匹配您当前的设置。
       ![](https://img.xiaorang.fun/202502281756937.png)
        在复制密钥时，请勿添加任何新行或空格！
    2. 在任何页面的右上角，单击个人资料照片，然后单击**设置**；
       ![](https://img.xiaorang.fun/202502281756049.png)
    3. 在边栏的访问部分中，点击**SSH 和 GPG 密钥** ➡️ **新建 SSH 密钥**；
       ![](https://img.xiaorang.fun/202502281756139.png)
    4. **填写标题**（为新密钥添加描述性标签，例如，如果使用的是个人笔记本电脑，则可以将此密钥称为"个人笔记本电脑"） ➡️ **粘贴公钥** ➡️ **添加 SSH 密钥**；
       ![](https://img.xiaorang.fun/202502281757913.png)
6. 使用 `ssh -T git@github.com` 命令[测试 SSH 连接](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection) ；
   ![](https://img.xiaorang.fun/202502281757005.png)
    验证生成的消息中包含您的用户名。

至此，新增 SSH 密钥到 GitHub 帐户就圆满成功啦~

### 添加许可 LICENSE 到仓库

> [!quote]
> [添加许可到仓库 - GitHub 文档](https://docs.github.com/zh/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)

步骤如下所示：

1. 导航到 Github 仓库主页；
2. 点击 Github 仓库中的**添加文件**按钮 ➡️ 选择**创建新文件**
   ![](https://img.xiaorang.fun/202502281757305.png)
3. 在文件名字段中，填写 LICENSE 或 LICENSE. md（**全部大写**） ；
4. 在文件名下，点击**选择许可证模板**；
   ![](https://img.xiaorang.fun/202502281757745.png)
5. 在页面左边的 [Add a license to your project](https://github.com/xihuanxiaorang/java-study/community/license/new)（**添加许可到项目**）下，检查可用的许可，然后从列表中选择许可 ➡️ **查看并提交**；此处选择 MIT 开源协议，对于各个开源协议不懂的小伙伴可以参考[[如何选择开源协议]]这篇文章；
   ![](https://img.xiaorang.fun/202502281758417.png)
6. 点击提交；
   ![](https://img.xiaorang.fun/202502281800329.png)
   ![](https://img.xiaorang.fun/202502281801519.png)

至此，添加许可 LICENSE 到仓库就成功啦~

## 问题 & 解决方案🚀

### fatal detected dubious ownership in repository at 'xxx'

问题描述：
![](https://img.xiaorang.fun/202502281812975.png)

原因：由于 git 的新安全策略会导致使用 git 操作无所有权的仓库目录时报此错误，即当前 git 仓库的所有者与当前登陆用户不一致！

解决方案：更改当前 git 仓库文件夹的所有者！具体步骤如下所示：

1. 鼠标右键文件夹➡️属性➡️安全➡️高级
   ![](https://img.xiaorang.fun/202502281812576.png)
2. 更改所有者
   ![](https://img.xiaorang.fun/202502281813418.png)
3. 选择用户或组➡️高级
   ![](https://img.xiaorang.fun/202502281813491.png)
4. 立即查找➡️选择当前登陆用户为所有者
   ![](https://img.xiaorang.fun/202502281813300.png)
5. 应用于当前文件夹下的子文件夹和文件
   ![](https://img.xiaorang.fun/202502281813736.png)
   ![](https://img.xiaorang.fun/202502281814505.png)
6. 查看是否已解决
