---
create_time: 2025-04-10 23:46
update_time: 2025/06/07 13:20
---

```dataview
TABLE rows.file.link AS "📄 文件", rows.file.ctime AS "📅 创建时间", rows.file.mtime AS "🕓 修改时间"
FROM #Frontend/Vue
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
GROUP BY regexreplace(file.folder, "^.*\/Vue\/([^\/]+).*", "$1") AS "章节"
SORT priority ASC
```
