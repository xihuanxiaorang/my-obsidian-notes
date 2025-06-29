---
tags:
  - Frontend/Uniapp
  - Frontend/UniCloud
create_time: 2025-06-29T22:49:00
update_time: 2025/06/29 22:50
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
  join(filter(file.tags, (x) => x != "#Resource" AND x != "#Frontend/Uniapp" AND x != "#Frontend/UniCloud"), " ") AS "🏷️ 标签", 
  rate AS "⭐ 评分", 
  date AS "📅 日期"
FROM #Resource AND (#Frontend/Uniapp OR #Frontend/UniCloud) 
SORT type, rate DESC, date DESC
```
