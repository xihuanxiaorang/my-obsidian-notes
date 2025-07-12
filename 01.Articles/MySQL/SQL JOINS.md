---
tags:
  - SQL/MySQL
create_time: 2025/04/08 19:11
update_time: 2025/07/12 22:19
---

## 前置知识

- 🗝 **Primary key / 主键**：用于唯一标识表中每条记录的字段（或字段组合）。在关系型数据库中，主键通常作为连接多个表的基础。
- 🔑 **Foreign key / 外键**：一个表中用于引用另一个表主键的字段。通过外键与主键的关联，可在表之间建立关系，实现数据的连接与约束。
- 🔁 **One-to-one / 一对一关系**：表示一个表中的某条记录与另一个表中的某条记录唯一对应，反之亦然。常用于需要将数据分表存储但仍保持唯一对应关系的场景。
- 🔗 **One-to-many / 一对多关系**：一个表中的一条记录可以对应另一个表中的多条记录，而后者的每条记录仅对应前者的一条记录。常见于主从结构，例如用户与订单的关系。
- 🔄 **Many-to-many / 多对多关系**：两个表中的多条记录可相互关联。通常通过一个"中间表"实现，该表包含指向两个原始表的外键，用于建立映射关系。

## 常见连接类型

### INNER JOIN（内连接）

执行 `INNER JOIN` 时，**仅返回连接字段在两个表中都存在匹配记录**的结果。常用于获取两个表之间**交集**的数据。

![[SQL - INNER JOIN]]

📌 只有当 `A.key = B.key` 时，记录才会出现在结果中。

### LEFT JOIN（左连接）

执行 `LEFT JOIN` 时，**保留左表的所有记录**。若右表无匹配项，则对应字段返回 `NULL` 作为默认值。

![[SQL - LEFT JOIN]]

📌 用于查找左表中未能匹配右表的记录，或保留左表的完整性。

### RIGHT JOIN（右连接）

执行 `RIGHT JOIN` 时，**保留右表的所有记录**。若左表无匹配项，则对应字段返回 `NULL` 作为默认值。

![[SQL - RIGHT JOIN]]

📌 用于查找右表中未能匹配左表的记录，或保留右表的完整性。

### FULL JOIN (全连接)

执行 `FULL [OUTER] JOIN` 时，**保留左右两张表的所有记录**，无匹配项的一方字段以 `NULL` 填充。

![[SQL - FULL OUTER JOIN|600]]

📌 用于同时保留左右两表中所有记录，适合全面对比或合并表数据。

### LEFT EXCLUDING JOIN (左排除连接)

执行 `LEFT EXCLUDING JOIN`（通常通过 `LEFT JOIN` 搭配 `WHERE` 实现）时，**仅返回左表中有、但右表中无匹配项的记录**。

![[SQL - LEFT EXCLUDING JOIN]]

📌 用于筛选仅存在于左表而右表中不存在的记录。

### RIGHT EXCLUDING JOIN (右排除连接)

执行 `RIGHT EXCLUDING JOIN`（通常通过 `RIGHT JOIN` 搭配 `WHERE` 实现）时，**仅返回右表中有、但左表中无匹配项的记录**。

![[SQL - RIGHT EXCLUDING JOIN]]

📌 用于筛选仅存在于右表而左表中不存在的记录。

### OUTER EXCLUDING JOIN（外部排除连接）

执行 `OUTER EXCLUDING JOIN`（通常通过 `FULL OUTER JOIN` 搭配 `WHERE` 实现）时，**仅返回左右表中没有匹配项的记录**，即两表中各自独有的数据。

![[SQL - OUTER EXCLUDING JOIN|600]]

📌 用于筛选左右表中**不重叠**的数据，排除双方均有对应项的记录。
