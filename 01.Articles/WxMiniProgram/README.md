---
tags:
  - 微信开发
update_time: 2025/06/29 13:08
create_time: 2025-06-29T13:06:00
---

## 参考资料

```dataview
TABLE 
  source AS "🌐 来源", 
  author AS "👤 up主 / 讲师", 
  type AS "📁 类型", 
  elink(url, choice(type = "📺 Video", "▶ 播放", "📖 跳转")) AS "🔗 链接", 
  join(filter(file.tags, (x) => x != "#Resource" and x != "#微信开发"), " ") AS "🏷️ 标签", 
  rate AS "⭐ 评分", 
  date AS "📅 日期"
FROM #Resource AND #微信开发 
SORT type, rate DESC, date DESC
```
