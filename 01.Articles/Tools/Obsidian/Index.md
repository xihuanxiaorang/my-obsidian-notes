---
tags: 
create_time: 2025-04-10 23:21
update_time: 2025/04/10 23:21
---

```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "修改时间" 
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
