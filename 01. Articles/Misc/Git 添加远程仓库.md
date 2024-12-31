---
tags:
  - Git
create_time: 2024-12-29 17:30
update_time: 2024/12/29 17:57
---

## 设置远程仓库地址

使用以下命令将本地仓库与远程仓库连接起来：

```bash
git remote add origin <远程仓库地址>
```

- `origin` 是远程仓库的默认名称（可以更换成其他名称）。
- `<远程仓库地址>` 是远程仓库的 URL，比如：
    - HTTPS 地址：`https://github.com/username/repo.git`
    - SSH 地址：`git@github.com:username/repo.git`

## 验证远程仓库连接

可以使用以下命令查看远程仓库的配置信息：

```bash
git remote -v
```

输出类似以下内容：

```
origin  https://github.com/username/repo.git (fetch)
origin  https://github.com/username/repo.git (push)
```

## 拉取远程仓库内容

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
> 	 ```
>
> <font color="#d83931">强制覆盖会丢失被覆盖的一方的所有历史记录，谨慎使用！</font>

## 推送本地代码到远程仓库

将本地代码推送到远程仓库：

```bash
git push origin main
```
