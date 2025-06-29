---
tags:
  - Obsidian/Plugin
create_time: 2025-04-10 19:12
update_time: 2025/06/29 22:47
priority: 10
---

[Dataview](https://blacksmithgu.github.io/obsidian-dataview/) 插件为 Obsidian 带来了强大的**数据查询与可视化功能**，让你的 Markdown 笔记像数据库一样灵活处理与分析。其核心功能包括：

- **结构化笔记数据**：自动解析笔记中的元数据（YAML frontmatter、内联字段、标签等），构建可查询的数据视图。
- **灵活查询语法**：支持 Dataview Query Language（DQL）语法，可查询文件名、标题、创建时间、自定义字段等，实现动态内容聚合。
- **多种视图支持**：
    - `table` 表格视图：以表格形式展示数据，适合对比与概览；
    - `list` 列表视图：以简洁清单方式展示结果；
    - `task` 任务视图：自动识别笔记中的任务列表；
    - `calendar`（配合插件）：展示基于时间的数据；
- **动态内容面板**：可用于生成自动更新的阅读清单、项目进度、笔记索引、任务追踪等视图，提高 Obsidian 的信息组织能力。
- **脚本模式（DataviewJS）**：使用 JavaScript 编写更复杂的查询和自定义渲染逻辑，适合有编程基础的高级用户。

📌_适用于：知识库整理、任务管理、读书笔记索引、项目追踪等多场景数据驱动的内容管理需求。_

## 查询方式

> [!quote]
> [DQL, JS and Inlines - Dataview](https://blacksmithgu.github.io/obsidian-dataview/queries/dql-js-inline/)

Dataview 支持将笔记视为结构化数据，提供了**四种查询方式**，可灵活读取和展示笔记中的[[Obsidian - 核心篇#元数据（Metadata）|元数据]]。所有查询都写在 Markdown 文件中，通过代码块或行内代码实时渲染，自动响应仓库中的内容变化。

### Dataview Query Language（DQL）

DQL（Dataview Query Language）是一种类 SQL 查询语言，用于对笔记中的结构化数据进行查询与展示。它支持：

- 选择查询结果的输出格式（如表格、列表、任务、日历）
- 从指定数据源（标签、文件夹、页面链接等）中筛选笔记
- 通过 `WHERE` 筛选字段（如比较、空值判断等）
- 字段转换（如计算、格式化、拆分多值字段）
- 对查询结果进行排序、分组、限制数量

> [!warning]
> 虽然语法类似 SQL，但 DQL 与 SQL 并不完全相同，建议阅读官方文档中的 [DQL 与 SQL 的区别](https://blacksmithgu.github.io/obsidian-dataview/queries/differences-to-sql/)。

#### 基本语法结构

一个标准的 DQL 查询一般由以下部分组成：

```markdown
```dataview
<查询类型> <字段列表>
FROM <数据源>
<数据命令> <表达式>
<数据命令> <表达式>
...
```

其中：

- **`查询类型`（Query Type）为必填项**
- 其余部分（如 `FROM`、`WHERE`、`SORT`）均为可选项

> [!warning]
> 记得用 **三个反引号 ```** 包裹代码块，不要用 `'`（单引号）误写！

#### 输出格式 (Query Type)

Dataview 支持以下四种输出格式：

| 类型         | 说明                     |
| ---------- | ---------------------- |
| `TABLE`    | 表格视图，列出字段数据            |
| `LIST`     | 列表视图，每项为笔记链接           |
| `TASK`     | 任务列表，展示所有匹配的任务项        |
| `CALENDAR` | 日历视图，在日期上以圆点标记匹配项（如笔记） |

> [!important]
> 查询类型必须位于查询语句首行。

示例：

- 列出所有页面（不推荐大仓库使用）：

	```markdown
	```dataview
	LIST
	```

- 显示仓库中所有任务项：

	```markdown
	```dataview
	TASK
	```

- 显示日历视图，每个页面按创建时间显示为一个点：

	```markdown
	```dataview
	CALENDAR file.cday
	```

- 显示笔记的 `due` 字段、标签和平均工作时长：

	```markdown
	```dataview
	TABLE due, file.tags AS "标签", average(working-hours)
	```

#### 指定查询源 （FROM）

`FROM` 指定要查询的笔记范围，如标签、文件夹、链接等：

- 推荐在大仓库中始终加 `FROM`，以提升性能
- **每个查询中最多只能有一个 `FROM`**

示例：

- 列出 `Books` 文件夹下所有笔记：

	```markdown
	```dataview
	LIST
	FROM "Books"
	```

- 查询含标签 `#status/open` 或 `#status/wip` 的笔记：

	```markdown
	```dataview
	LIST
	FROM #status/open OR #status/wip
	```

- 组合多个条件来源：

	```markdown
	```dataview
	LIST
	FROM (#assignment AND "30 School")
		OR ("30 School/32 Homeworks" AND outgoing([[School Dashboard Current To Dos]]))
	```

#### 数据命令（Data Commands）

用于进一步处理查询结果的命令。除 `FROM` 外，其余命令可重复出现，顺序不限（必须在 `Query Type` 之后）：

| 命令         | 功能说明                |
| ---------- | ------------------- |
| `WHERE`    | 条件过滤，如字段值匹配、是否存在等   |
| `SORT`     | 按字段升序/降序排序          |
| `GROUP BY` | 将结果按字段值分组，每组仅显示一条记录 |
| `LIMIT`    | 限制返回结果数量            |
| `FLATTEN`  | 拆分多值字段，使每个值单独作为一行   |

示例：

- 筛选 `due` 字段存在，且早于今天的笔记：

	```markdown
	```dataview
	LIST
	WHERE due AND due < date(today)
	```

- 列出创建时间最新的 10 条带 `#status/open` 标签的笔记：

	```markdown
	```dataview
	LIST
	FROM #status/open
	SORT file.ctime DESC
	LIMIT 10
	```

- 分组显示 10 条未完成任务，按文件创建时间排序：

	```markdown
	```dataview
	TASK
	WHERE !completed
	SORT created ASC
	LIMIT 10
	GROUP BY file.link
	SORT rows.file.ctime ASC
	```

#### 常用模板

✅ 任务看板（Task Board）

```markdown
```dataview
TABLE file.link AS "任务文件", text AS "任务", due AS "截止时间", completed AS "是否完成"
FROM "01.Tasks"
WHERE !completed
SORT due ASC
```

可变体：按 `status` 分组显示

```markdown
```dataview
TABLE text AS "任务", due AS "截止", status
FROM "01.Tasks"
WHERE !completed
GROUP BY status
```

📚 读书清单（Reading List）

```markdown
```dataview
TABLE author AS "作者", status AS "状态", rating AS "评分"
FROM #book
WHERE status != "弃读"
SORT status ASC, rating DESC
```

支持字段：`status`（未读 / 在读 / 已读）、`rating`、`author`

🗂️ 笔记索引（当前目录索引）

```markdown
```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "修改时间" 
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```

### Inline DQL (内联 DQL 表达式)

在正文中直接嵌入的 DQL 表达式，适合行内动态展示单个值：

```markdown
当前文件名为：`= this.file.name`
```

- 使用 \`= 表达式\` 语法（默认前缀可自定义）
- 每次只能输出一个值（不能输出列表或表格）
- 可引用当前笔记（`this.`）或链接页（`[[linkToPage]].字段名`）

```markdown
今天是：`= date(today)`
离考试还有：`= [[exams]].deadline - date(today)`
```

### Dataview JS（DQL 的 JS 版本）

使用 JavaScript 编写更复杂的查询逻辑，功能远超 DQL，适合有编程经验的用户。

```markdown
```dataviewjs
let pages = dv.pages("#books and -#books/finished").where(b => b.rating >= 7);
for (let group of pages.groupBy(b => b.genre)) {
   dv.header(3, group.key);
   dv.list(group.rows.file.name);
}
```

- 用 `dataviewjs` 声明代码块
- 使用 `dv` 对象访问 API，支持所有筛选、渲染和操作逻辑
- 可查询多个页面、分组、排序、自定义展示

> [!warning]
> JS 查询可访问本地文件系统，请谨慎运行来源不明的脚本！

### Inline Dataview JS (内联 JS 表达式)

在正文中嵌入 JavaScript 表达式，适合行内动态展示 JS 计算结果。

```markdown
最后修改时间：`$= dv.current().file.mtime`
```

- 使用 \`$=\` 前缀（可在设置中修改）
- 支持完整的 Dataview JS API
- 不局限于单值，可输出列表、任务等

```markdown
你还有 `= length(filter(link(dateformat(date(today), "yyyy-MM-dd")).file.tasks, (t) => !t.completed))` 个待办任务。
```
