---
tags:
  - DevKit/内网穿透工具
update_time: 2025/06/28 23:45
create_time: 2025-06-28T23:43:00
---

```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "修改时间"
FROM #DevKit/内网穿透工具  
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
