---
create_time: 2025-06-28T11:42:00
update_time: 2025/06/28 22:23
---

```dataviewjs
const pages = dv.pages("#DevKit/Docker")
  .where(p => p.file.path.includes(dv.current().file.folder) && p.file.name !== dv.current().file.name);

// 获取分组字段（章节）
function getGroup(folder) {
  const match = folder.match(/^.*?\/Docker(?:\/([^/]+))?.*/);
  return match && match[1] ? match[1] : "";
}

// 按分组聚合
const grouped = new Map();
for (const page of pages) {
  const groupKey = getGroup(page.file.folder);
  if (!grouped.has(groupKey)) grouped.set(groupKey, []);
  grouped.get(groupKey).push(page);
}

// 排序并输出
for (const [group, items] of grouped.entries()) {
  dv.header(3, `📁 ${group || "未分组"}`);
  dv.table(["📄 文件", "📅 创建时间", "🕓 修改时间"],
    items
      .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
      .map(p => [p.file.link, p.file.ctime, p.file.mtime ?? "无"])
  );
}
```
