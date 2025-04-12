---
create_time: 2025-04-12 23:47
update_time: 2025/04/12 23:48
---

```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "修改时间"
FROM #AI
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
