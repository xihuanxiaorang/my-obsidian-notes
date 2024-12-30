---
tags:
  - Github
create_time: 2024-12-29 22:22
update_time: 2024/12/29 22:35
---

Github 的 Token 是一种用于身份验证的密钥，允许你在脚本、命令行工具或应用中安全地访问你的账户。以下是生成 Personal Access Token 的详细步骤：

## 1. 登录 Github

前往 [Github 官网](https://github.com/) 并登录你的账户。

## 2. 进入 Token 管理页面

访问 [Personal Access Tokens (Classic)](https://github.com/settings/tokens) 页面，或按照以下步骤手动进入：

- 点击右上角头像，选择 **Settings**。
- 在左侧导航栏，找到 **Developer settings** > **Personal access tokens** > **Tokens (classic)**。

## 3. 创建新 Token

1. 点击 **Generate new token (Classic)** 按钮。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161737003.png)
2. 在 **Note** 中填写 Token 的用途（例如：`PicList 图床`），方便区分。
3. 在 **Expiration（过期时间）** 中选择有效期（推荐 90 天或 1 年）。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412161737958.png)

> [!note]
> 过期后需重新生成新的 Token。

## 4. 设置权限

根据你的需求勾选相应的权限。对于图床配置，需要勾选 `repo`，确保拥有对仓库的完全读写权限。

## 5. 生成 Token

1. 滑到页面底部，点击 **Generate token** 按钮。
2. 生成的 Token 会显示在页面上。

## 6. 保存 Token

生成的 Token 只会显示一次，请立即复制并保存到安全的地方，例如密码管理工具。

> [!note]
> 如果忘记保存或 Token 遗失，无法再次查看，需重新生成新的 Token。
