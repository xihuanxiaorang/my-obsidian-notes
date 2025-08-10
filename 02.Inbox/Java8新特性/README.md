---
tags:
  - Java/JavaSE
version: JDK8
create_time: 2025/07/14 23:38
update_time: 2025/07/14 23:40
---

Lambda 表达式、强大的 Stream API、全新时间日期 API；新特性使得 Java 的运行速度更快、代码更少（Lambda 表达式）、便于并行、最大化减少空指针异常！

```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "修改时间"
FROM #Java/JavaSE 
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
