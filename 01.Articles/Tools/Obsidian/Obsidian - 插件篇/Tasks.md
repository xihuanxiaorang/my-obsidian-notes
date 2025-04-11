---
tags:
  - Obsidian
  - Plugin
priority: 10
create_time: 2025-04-11T18:33:00
update_time: 2025/04/11 18:47
---

[Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) 插件为 Obsidian 提供了更强大的任务管理功能，主要特点包括：

- **任务解析**：自动识别 Markdown 中的任务列表，并支持自定义任务状态（如待办、进行中、完成）。
- **高级查询**：使用内置查询语法跨多个笔记筛选任务，例如按标签、日期、优先级等条件过滤任务。
- **任务排序与分组**：支持根据截止日期、创建时间或自定义字段对任务进行排序和分组，方便管理和查看任务进展。
- **提醒和日期管理**：可以为任务设置截止日期、提醒时间，甚至支持重复任务的配置，帮助你更好地规划时间。
- **自定义视图**：通过查询语法生成任务面板或仪表盘，实现个性化的任务展示和统计分析。

## 创建 & 编辑任务

使用 `Ctrl + P` 命令唤出命令面板，搜索关键字 `tasks`，选择 `Tasks: Create or edit task`，弹出新建/编辑任务弹窗可以快速新建/修改任务。
![](https://img.xiaorang.fun/202502251726417.png)

- **Due（截止日期）** 📅
    - 任务的到期日，表示任务应该在这一天或之前完成。
- **Scheduled（计划日期）** ⏳
    - 代表任务被计划执行的时间，但不一定意味着它必须从这一天开始。
    - 主要用于组织和安排任务，例如将任务排入日程，而不会影响任务是否可见或可执行。
- **Start（开始日期）** 🏁
    - 代表任务正式开始的时间，在此日期之前，任务不会显示在任务列表中（如果启用了"Only future dates"）。
- **Created（创建日期）** ➕
    - 任务被创建的日期，通常是你最初记录任务的时间。
- **Done（完成日期）** ✅
    - 任务被标记为完成的日期，表示何时完成了该任务。
- **Cancelled（取消日期）** ❌
    - 任务被取消的日期，适用于已放弃或不再需要完成的任务。

在任意笔记中创建几个任务，如下所示：

```markdown
- [ ] Something non-important, with no date
- [x] Remember to do that important thing - with a due date 📅 2022-12-17 ✅ 2025-02-08
- [ ] Send Kate a birthday card - with a scheduled date 🔁 every January on the 4th ⏳ 2023-01-04
```

## 创建任务查询

### 查询语法 (第三人称)

> [!quote]
> https://publish.obsidian.md/tasks/Queries/About+Queries

- 完成/未完成：done 或 not done
	- 完成日期：done before/after/on 日期
- 无到期日：no due date
- 到期日过滤：due before/after/on 日期
	- 日期可使用 today, yesterday, tomorrow, next week， last Friday, in two weeks 等
- 路径
	- 要搜寻：path includes 路径
	- 不搜寻：path does not include 路径
- 事项描述
	- description includes 字串
	- description does not include 字串
- 最靠近标题
	- heading includes 标题
	- heading does not include 标题
- 是否重复：is recurring, is not recurring
- 排除某个事项：excludes 清单事项
- 限制显示事项数目：limit to 数值 tasks
- 排序：sort by (status|due|done|path|description)
- 显示样式隐藏 hide
	- edit button
	- backlink
	- done date
	- due date
	- recurrence rule
	- task count

### 示例

在笔记中插入一个任务查询区块，用于筛选显示特定条件下的任务。如下所示：

> [!failure]+ 未完成任务
>
> ```tasks
> not done
> has start date
> hide edit button
> hide backlink
> group by function \
>     const date = task. due. moment; \
>     const tomorrow  = moment (). add (1,'days'); \
>     const now = moment (); \
>     const label = (order, name) => `%%${order}%% ==${name}==`; \
>     if (! date)                           return label (5, 'Undated'); \
>     if (! date. isValid ())                 return label (0, 'Invalid date'); \
>     if (date. isBefore (now, 'day'))       return label (1, 'Overdue'); \
>     if (date. isSame (now, 'day'))         return label (2, 'Today'); \
>     if (date. isSame (tomorrow, 'day'))    return label (3, 'Tomorrow'); \
>     return label (4, 'Future');
> # Optionally, ask Tasks to explain how it interpreted this query:
> explain
> ```

> [!check] 查询所有与今天相关的任务（无论是截止、计划或者开始）
>
> ```tasks
> not done
> (due after today) OR (scheduled today) OR ((starts on today) AND (has start date)) 
> hide backlink
> # Optionally, ask Tasks to explain how it interpreted this query:
> explain
> ```
