---
tags:
  - SQL
create_time: 2025-04-08 19:11
update_time: 2025/04/08 23:28
---

## 前置知识

- 🗝 **Primary key / 主键**：用于唯一标识表中每条记录的字段（或字段组合）。在关系型数据库中，主键通常作为连接多个表的基础。
- 🔑 **Foreign key / 外键**：一个表中用于引用另一个表主键的字段。通过外键与主键的关联，可在表之间建立关系，实现数据的连接与约束。
- 🔁 **One-to-one / 一对一关系**：表示一个表中的某条记录与另一个表中的某条记录唯一对应，反之亦然。常用于需要将数据分表存储但仍保持唯一对应关系的场景。
- 🔗 **One-to-many / 一对多关系**：一个表中的一条记录可以对应另一个表中的多条记录，而后者的每条记录仅对应前者的一条记录。常见于主从结构，例如用户与订单的关系。
- 🔄 **Many-to-many / 多对多关系**：两个表中的多条记录可相互关联。通常通过一个"中间表"实现，该表包含指向两个原始表的外键，用于建立映射关系。

## 示例数据

<strong style="font-size:22px; color:#007acc;">🎤 Artist Table</strong>

<table> <thead> <tr> <th><strong>artist_id</strong></th> <th><strong>name</strong></th> </tr> </thead> <tbody> <tr><td>1</td><td>AC/DC</td></tr> <tr><td>2</td><td>Aerosmith</td></tr> <tr><td>3</td><td>Alanis Morissette</td></tr> </tbody> </table>

<strong style="font-size:22px; color:#D36B76;">💿 Album Table</strong>

<table> <thead> <tr> <th><strong>album_id</strong></th> <th><strong>title</strong></th> <th><strong>artist_id</strong></th> </tr> </thead> <tbody> <tr><td>1</td><td>For those who rock</td><td>1</td></tr> <tr><td>2</td><td>Dream on</td><td>2</td></tr> <tr><td>3</td><td>Restless and wild</td><td>2</td></tr> <tr><td>4</td><td>Let there be rock</td><td>1</td></tr> <tr><td>5</td><td>Rumours</td><td>6</td></tr> </tbody> </table>

## 分类

### INNER JOIN（内连接）

在两个表之间执行 `INNER JOIN` 时，只有当**连接字段在两个表中都存在匹配记录**时，才会返回结果。这种连接方式常用于查找两个表之间**交集**的数据。

![[SQL - INNER JOIN]]
