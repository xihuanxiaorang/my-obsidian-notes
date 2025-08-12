---
create_time: 2025/04/10 23:46
update_time: 2025/06/30 12:10
---

## 章节索引

```dataviewjs
const pages = dv.pages("#Frontend/Vue")
  .where(p => p.file.path.includes(dv.current().file.folder) && p.file.name !== dv.current().file.name);

// 获取分组字段（章节）
function getGroup(folder) {
  const match = folder.match(/^.*?\/Vue(?:\/([^/]+))?.*/);
  return match && match[1] ? match[1] : "";
}

// 构建分组 Map，记录每组的最小 priority
const grouped = new Map();
for (const page of pages) {
  const groupKey = getGroup(page.file.folder);
  const priority = page.priority ?? 999;
  if (!grouped.has(groupKey)) {
    grouped.set(groupKey, { priority, items: [page] });
  } else {
    grouped.get(groupKey).items.push(page);
    grouped.get(groupKey).priority = Math.min(grouped.get(groupKey).priority, priority);
  }
}

// 将 Map 转为数组并按分组 priority 排序
const sortedGroups = Array.from(grouped.entries())
  .sort((a, b) => a[1].priority - b[1].priority);

// 渲染分组及表格
for (const [group, { items }] of sortedGroups) {
  dv.header(3, `📁 ${group || "未分组"}`);
  dv.table(["📄 文件", "📅 创建时间", "🕓 修改时间"],
    items
      .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
      .map(p => [p.file.link, p.file.ctime, p.file.mtime ?? "无"])
  );
}
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
  join(filter(file.tags, (x) => x != "#Resource" and x != "#Frontend/Vue"), " ") AS "🏷️ 标签", 
  rate AS "⭐ 评分", 
  date AS "📅 日期"
FROM #Resource AND #Frontend/Vue 
SORT type, rate DESC, date DESC
```
