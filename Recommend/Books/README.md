---
tags:
  - Book
create_time: 2025/06/30 13:08
update_time: 2025/06/30 13:09
---

```dataview
TABLE author AS "✍️ 作者", 
      join(filter(file.tags, (x) => x != "#Book"), " ") AS "🏷️ 标签", 
      embed(link(cover)) AS "🖼️ 封面"
FROM #Book
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
```
