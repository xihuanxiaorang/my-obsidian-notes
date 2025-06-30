---
tags:
  - Frontend/HTML
  - Frontend/CSS
create_time: 2025/06/29 13:52
update_time: 2025/06/30 12:08
---

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
  join(filter(file.tags, (x) => x != "#Resource" AND x != "#Frontend/HTML" AND x != "#Frontend/CSS"), " ") AS "🏷️ 标签", 
  rate AS "⭐ 评分", 
  date AS "📅 日期"
FROM #Resource AND (#Frontend/HTML OR #Frontend/CSS) 
SORT type, rate DESC, date DESC
```
