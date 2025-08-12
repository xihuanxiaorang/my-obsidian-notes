---
tags:
  - Java/JavaSE
update_time: 2025/07/29 22:21
create_time: 2025/06/29 13:17
---

## 章节索引

```dataview
TABLE file.ctime AS "📅 创建时间", file.mtime AS "🕓 修改时间" 
FROM ""
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```

## 参考资料

```dataview
TABLE 
  source AS "🌐 来源", 
  author AS "👤 up主 / 讲师", 
  type AS "📁 类型", 
  elink(url, 
    choice(
      type = "📺 Video", "▶ 播放", 
      choice(type = "🛠️ 工具", "🧰 使用", "📖 跳转") 
    )
  ) AS "🔗 链接", 
  join(filter(file.tags, (x) => x != "#Resource" and x != "#Java/JavaSE"), " ") AS "🏷️ 标签", 
  rate AS "⭐ 评分", 
  date AS "📅 日期"
FROM #Resource AND #Java/JavaSE 
SORT type, rate DESC, date DESC
```
