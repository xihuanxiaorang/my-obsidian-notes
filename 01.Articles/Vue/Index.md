---
tags: 
create_time: 2025-04-10 23:46
update_time: 2025/04/10 23:46
---

```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "修改时间" 
FROM #Vue
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
