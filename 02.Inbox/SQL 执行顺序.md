---
tags:
  - SQL
create_time: 2025-03-27T23:31:00
update_time: 2025/04/04 19:04
refrence_url:
  - https://www.bilibili.com/video/BV1o14y1B7Mc?vd_source=84272a2d7f72158b38778819be5bc6ad
---

![[03.Excalidraw/SQL 执行顺序|1500]]

```sql
SELECT DISTINCT<select_list>
FROM <left_table> <join_type>JOIN<right_table>
ON<join_condition>
WHERE<where_condition>
GROUP BY <group_by_list>
WITH {CUBE|ROLLUP}
HAVING<having_condition>
ORDER BY<order_by_list>
LIMIT<limit_number>
```

结合上图，整理出如下伪SQL查询语句：

![画板](https://cdn.nlark.com/yuque/0/2023/jpeg/1554080/1687583226526-be43b36b-9ac0-4bc9-843a-002eb69684dd.jpeg)

<font style="color:rgb(77, 77, 77);">查询语句是从 </font>**<font style="color:rgb(77, 77, 77);">FROM </font>**<font style="color:rgb(77, 77, 77);">开始执行的，并不是所谓的 </font>**<font style="color:rgb(77, 77, 77);">SELECT</font>**<font style="color:rgb(77, 77, 77);">。在实际的执行过程中，每一个步骤都会生成一个虚拟表，这个虚拟表将作为下一个步骤的输入。 这些虚拟表不会对用户展示，只有最后一张表会作为输出结果呈现给用户。如果在查询中没有指定某一个子句，将跳过相应的步骤。</font>

<font style="color:rgb(77, 77, 77);">接下来，以一个例子来详细的介绍下每个步骤的具体执行过程。如下所示：</font>

```sql
SELECT st.age, COUNT(DISTINCT sc.sid) AS num
FROM student st
         LEFT JOIN score sc
                   ON st.id = sc.sid
WHERE st.sex = '男'
GROUP BY st.age
HAVING COUNT(*) > 1
ORDER BY st.age
LIMIT 100;
```

SQL执行顺序如下：

1. **FROM**：<font style="color:rgb(37, 41, 51);">对 FROM 子句中的 student 与 score 两个表执行笛卡尔积，生成虚拟表VT1；</font>
2. **<font style="color:rgb(37, 41, 51);">ON</font>**<font style="color:rgb(37, 41, 51);">：对虚拟表VT1应用 ON 筛选器，筛选出满足 ON 条件的记录，在此处就是把不符合 st.id = sc.sid 的记录给过滤掉，只保留满足条件的记录，这样数据量就会减少很多，经过这一步生成虚拟表VT2；</font>
3. **<font style="color:rgb(37, 41, 51);">JOIN</font>**<font style="color:rgb(37, 41, 51);">：</font>
    1. <font style="color:rgb(37, 41, 51);">如果制定了 OUTER JOIN，则保留表中未找到匹配的行将作为外部行添加到虚拟表VT2中，生成虚拟表VT3。</font>
        1. <font style="color:rgb(37, 41, 51);">LEFT [OUTER] JOIN：把左表作为保留表</font>
        2. <font style="color:rgb(37, 41, 51);">RIGHT [OUTER] JOIN：把右表作为保留表</font>
        3. <font style="color:rgb(37, 41, 51);">FULL [OUTER] JOIN：把左右表都作为保留表</font>
    2. 在虚拟表VT2的基础上添加保留表中被过滤条件过滤掉的数据，非保留表中的数据被赋予 NULL值，最后生成虚拟表VT3。
    3. 具体来说，如果是 LEFT [OUTER] JOIN 就把上一步舍弃的左表中的记录给补回来，对应右表中的数据用 NULL 填充，针对上面的例子就等于把 student 表中不等于 score 表中对应 ID 的记录给补回来，这样操作之后就生成虚拟表VT3。
4. **WHERE**：对虚拟表VT3根据过滤条件对数据进行筛选，并把满足条件的数据插入虚拟表VT4中。针对上面的例子就是把虚拟表VT3中 sex 列不等于 '男' 的记录给剔除掉，只留下符合条件的记录生成虚拟表VT4。
5. **GROUP BY**：虚拟表VT4根据 GROUP BY 子句中的列进行分组，每组只包含一条记录，分组后的结果集生成虚拟表VT5。针对上面的例子，按照学生的年龄分组后生成虚拟表VT5。
6. **HAVING**：对虚拟表VT5根据 HAVING 后的过滤条件进行筛选，并把满足条件的数据插入虚拟表VT6。HAVING 子句与 WHERE 子句的作用差不多，都是对数据进行过滤，不过 HAVING 是针对分组后的数据进行过滤。执行到这里数据算是基本成型，再后面就是展示的问题了。针对上面的例子，过滤出的是至少参加过一门考试的学生。
7. **SELECT**：将上面经过层层筛选后的虚拟表VT6按照指定的列给筛选出来，并对字段进行处理，计算 SELECT 子句中的表达式，生成虚拟表VT7。针对上面的例子，只把用到的列 age 和 聚合后的列 num 取出来，生成虚拟表VT7。
8. **DISTINCT**：对虚拟表VT7做指定列的去重操作或者将重复的行删除，生成虚拟表VT8。针对上面的例子，就是按照不同的学生ID做去重操作，生成虚拟表VT8。<font style="background:#F8CED3;color:#70000D">TOBEIMPROVED</font>
9. **ORDER BY**：将虚拟表VT8中的行按照 ORDER BY 子句中的列（必须来自于 SELECT 中，如果 SELECT 中没有这一列那么是无法按照这一列进行排序）进行排序，生成游标 VC9，注意不是虚拟表。针对上面的例子，按照学生的年龄从小打到进行排序。
10. **LIMIT**：最后一步，限制输出数量，针对上面的例子，取出排序过后的前100条记录，生成虚拟表VT10并作为输出结果呈现给用户。

🤔那么了解SQL的执行顺序有什么用呢？其实对咱们优化SQL有很大的帮助，下面就举个例子演示一下：

```sql
SELECT t2.user_id, COUNT(t1.order_id)
FROM `order` t1 
LEFT JOIN `user` t2
ON t1.user_id = t2.user_id
WHERE t1.money > 100 and t2.city = '北京';
```

```sql
SELECT t2.user_id, COUNT(t1.order_id)
FROM (SELECT user_id, money FROM `order` WHERE money > 100) t1 
LEFT JOIN (SELECT user_id, city FROM `user` WHERE city = '北京') t2
ON t1.user_id = t2.user_id;
```

左右两条 SQL 执行的结果是一致的，在数据量不是很大的情况下执行效果也差不多，但是当数据量大起来的时候，比如说一个千万级的订单表和一个千万级的用户表关联的时候，此时右边的效果要明显好于左边的 SQL，因为SQL 的执行顺序，在右边的 SQL 语句中，会先在子查询中对需要 JOIN 的两个表做了过滤，这样 JOIN 的时候数据量就小了很多，而在左边的 SQL 语句中会先对两个表 JOIN 然后再过滤，可以想象一下<u>笛卡尔积</u>会有多大，十分影响效率。怎么样，了解 SQL 的执行顺序还是很有用的吧！
