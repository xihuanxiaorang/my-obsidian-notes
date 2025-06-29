---
tags:
  - SQL/MySQL
create_time: 2025-03-27T23:31:00
update_time: 2025/04/10 23:41
---

## SQL 执行顺序详解

![[SQL - 执行顺序|1500]]

结合下图伪代码，可以梳理出 SQL 的真实执行顺序：

```sql file:实际执行顺序
(7) SELECT (8) [DISTINCT] <select_list>
(1) FROM <left_table>
    [ (3) <join_type> JOIN <right_table>
      (2) ON <join_condition> ]
(4) WHERE <where_condition>
(5) GROUP BY <group_by_list>
(6) HAVING <having_condition>
(9) ORDER BY <order_by_list> [ASC | DESC]
(10) LIMIT <limit_number>
```

🌠步骤详解（中间结果用 VT 表示）：
1. `FROM`：通过 `FROM` 子句指定的两个表生成笛卡尔积，得到虚拟表 VT1（多表连接时通常选择较小的表作为驱动表，以提高效率）。
2. `ON`：在 VT1 基础上应用 `ON` 筛选器，筛选出符合 `ON` 条件的记录，生成虚拟表 VT2。仅影响连接阶段的数据匹配，不影响最终结果集的行数（区别于 `WHERE`）。
3. `JOIN`：根据连接类型对 VT2 作进一步处理，生成虚拟表 VT3。
	- 若为 `INNER JOIN`，则 VT2 即为最终结果（VT3 = VT2）。
	- 若为 `OUTER JOIN`，则将未匹配的保留表记录补回，生成虚拟表 VT3。
		- `LEFT [OUTER] JOIN`：补回左表中未匹配的记录，右表字段置为 `NULL`。
		- `RIGHT [OUTER] JOIN`：补回右表中未匹配的记录，左表字段置为 `NULL`。
		- `FULL [OUTER] JOIN`：补回左右表中所有未匹配的记录。
4. `WHERE`：对 VT3 应用行级过滤条件，筛选出满足条件的记录，生成虚拟表 VT4。💡仅可使用原始字段，不能使用聚合函数。
5. `GROUP BY`：对 VT4 按照指定字段进行分组，每组只返回一行记录，生成虚拟表 VT5。
6. `HAVING`：对 VT5 应用聚合后的过滤条件，筛选出满足条件的分组记录，生成虚拟表 VT6。💡可使用聚合函数（如 `COUNT()`、`SUM()` 等）进行判断。
7. `SELECT`：从 VT6 中选出指定的字段或表达式，计算并生成最终结果列，生成虚拟表 VT7。
8. `DISTINCT`（可选）：对 VT7 进行去重，删除重复行，生成虚拟表 VT8。
9. `ORDER BY`：对 VT8 中的结果进行排序，返回一个有序的结果集（游标 VC9）。此步骤是唯一可以使用 `SELECT` 列别名的地方。
10. `LIMIT`：限制输出结果的行数，从 VC9 中截取前 N 行，生成最终输出结果 VT10。

> [!note]
> 若 `FROM` 子句包含多个表，则会重复执行上述 ①-③ 步骤（笛卡尔积 → `ON` → `JOIN`），不断更新生成新的 VT3。

> [!question] 为什么 `ORDER BY` 会生成游标而不是虚拟表？
> 排序后的结果不是直接构造成表，而是以**游标**的形式返回：
>
> > [!question] 什么是游标？
> > 游标是数据库在内存中为排序后的结果开辟的一块临时空间，它用来按顺序迭代排序后的结果，就像一个可迭代的 "结果集指针"。
>
> > [!question] 为什么使用游标而不是虚拟表？
> >
> > 1. 排序开销大
> >    排序后的结果通常是存储在内存或临时磁盘空间中，数据库需要一个机制来逐条读取这些排序结果，避免一次性加载完整数据 —— 这正是游标的作用。
> >
> > 2. 配合 `LIMIT` 更高效，如：
> >
> >    ```sql
> >    ORDER BY ... 
> >    LIMIT 10
> >    ```
> >
> >    数据库只需维护前 10 条排序记录，无需对整个结果集排序并生成完整虚拟表。

## 举个栗子：理解执行顺序带来的性能差异

了解 SQL 的执行顺序对我们优化查询性能非常重要！下面通过一个栗子来说明：

❌ 原始写法（先 `JOIN` 再过滤 `WHERE`）：

```sql
SELECT t2.user_id, COUNT(t1.order_id)
FROM `order` t1 
LEFT JOIN `user` t2
ON t1.user_id = t2.user_id
WHERE t1.money > 100 AND t2.city = '北京';
```

✅ 优化写法（先过滤 `WHERE` 再 `JOIN`）：

```sql
SELECT t2.user_id, COUNT(t1.order_id)
FROM (SELECT user_id, money FROM `order` WHERE money > 100) t1 
LEFT JOIN (SELECT user_id, city FROM `user` WHERE city = '北京') t2
ON t1.user_id = t2.user_id;
```

这两条 SQL 语义一致，结果相同。但在大数据量场景下，性能差异会非常明显。

> [!question] 为什么优化后更高效？
> - 原始 SQL：先进行大表之间的连接 `JOIN`, 再执行 `WHERE` 条件过滤，容易产生大量中间数据（笛卡尔积），占用大量资源且严重影响性能。
> - 优化 SQL：先在子查询中对两个大表分别进行过滤 `WHERE`，仅保留相关数据再进行连接 `JOIN`，有效减小中间结果，提升效率。
>
> 本质上就是：**提前过滤，减少连接开销，提升执行效率。**
