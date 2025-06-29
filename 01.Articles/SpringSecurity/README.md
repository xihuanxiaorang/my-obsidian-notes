---
tags:
  - SpringSecurity
create_time: 2025-06-29T13:48:00
update_time: 2025/06/29 13:49
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
  join(filter(file.tags, (x) => x != "#Resource" and x != "#SpringSecurity" and x != "#OAuth2"), " ") AS "🏷️ 标签", 
  rate AS "⭐ 评分", 
  date AS "📅 日期"
FROM #Resource AND (#SpringSecurity OR #OAuth2) 
SORT type, rate DESC, date DESC
```
