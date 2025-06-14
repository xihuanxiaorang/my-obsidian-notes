---
tags:
  - Java/DesignPattern
create_time: 2025-06-14T17:34:00
update_time: 2025/06/14 22:44
---

```dataview
TABLE file.ctime AS "📅 创建时间", file.mtime AS "🕓 修改时间"
FROM #Java/DesignPattern  
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
