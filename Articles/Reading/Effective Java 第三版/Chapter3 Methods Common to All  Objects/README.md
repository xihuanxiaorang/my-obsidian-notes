---
tags:
  - Java/EffectiveJava
create_time: 2025/07/17 23:20
update_time: 2025/07/17 23:20
---

```dataview
TABLE description AS "描述", file.ctime AS "创建时间", file.mtime AS "修改时间"
FROM #Java/EffectiveJava  
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
