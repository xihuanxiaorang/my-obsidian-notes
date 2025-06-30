---
tags:
  - Movie
create_time: 2025/06/30 13:01
update_time: 2025/06/30 13:06
---

```dataview
TABLE 
  Director AS "导演", 
  Stars AS "主演", 
  rating AS "评分", 
  choice(watched, "✔", "❌") AS "已观看",
  join(filter(file.tags, (x) => x != "#Movie"), " ") AS "标签", 
  embed(link(cover)) AS "封面"
FROM #Movie
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT rating DESC
```
