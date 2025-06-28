---
tags:
  - DevKit/Docker
create_time: 2025-06-28T11:42:00
update_time: 2025/06/28 23:43
---

```dataviewjs
const pages = dv.pages("#DevKit/Docker")
  .where(p => p.file.path.includes(dv.current().file.folder) && p.file.name !== dv.current().file.name);

// 获取分组字段（章节）
function getGroup(folder) {
  const match = folder.match(/^.*?\/Docker(?:\/([^/]+))?.*/);
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
