---
tags:
  - Tool
create_time: 2024-12-29 21:48
update_time: 2024/12/30 11:06
---

利用 Cloudflare R2 对象存储搭建一个稳定的免费图床，配合 [[Github + PicList 搭建个人图床#PicList|PicList]]，可以轻松实现图片的上传和管理。

## 注册与开通付费计划

首次使用 Cloudflare，需注册账号并绑定支付方式，即使仅使用免费服务也是如此。操作步骤如下：

1. **注册 Cloudflare 账号**
   - 访问 [Cloudflare官网](https://www.cloudflare.com/) 并点击 **Sign Up**，按照页面提示完成注册流程。
2. **绑定支付方式**
   1. 选择使用信用卡或 [[PayPal]] 账户作为支付方式，并完成绑定。
   2. 输入您的账单邮寄地址。
   3. 点击 **"将 R2 订阅添加到我的账户"** 按钮以添加付费计划。

> [!note]
> 即使您使用的是 Cloudflare 的免费服务，绑定支付方式也是开通账户的必要步骤。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412292141647.png)
