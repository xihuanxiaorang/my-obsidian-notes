---
tags:
  - Java/DesignPattern
create_time: 2025-06-14T17:34:00
update_time: 2025/06/20 19:05
---

```dataview
TABLE rows.file.link AS "📄 文件", rows.file.ctime AS "📅 创建时间", rows.file.mtime AS "🕓 修改时间"
FROM #Java/DesignPattern
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
GROUP BY regexreplace(file.folder, "^.*?/DesignPattern(?:/([^/]+))?.*", choice(length("$1") > 0, "$1", "")) AS "📁 分组"
SORT priority ASC
```
