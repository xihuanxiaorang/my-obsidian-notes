---
tags:
  - Algorithm/排序
create_time: 2025/08/11 19:19
update_time: 2025/08/26 12:54
---

## 章节索引

```dataview
TABLE file.ctime AS "📅 创建时间", file.mtime AS "🕓 修改时间"
FROM #Algorithm/排序  
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
