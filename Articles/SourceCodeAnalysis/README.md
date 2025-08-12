---
tags:
  - SourceCodeAnalysis
create_time: 2025/06/29 13:26
update_time: 2025/06/30 12:59
---

## 章节索引

```dataviewjs
const pages = dv.pages("#SourceCodeAnalysis")
  .where(p => p.file.path.includes(dv.current().file.folder) && p.file.name !== dv.current().file.name);

// 获取分组字段（章节）
function getGroup(folder) {
  const match = folder.match(/^.*?\/SourceCodeAnalysis(?:\/([^/]+))?.*/);
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
  join(filter(file.tags, (x) => x != "#Resource" and x != "#SourceCodeAnalysis"), " ") AS "🏷️ 标签", 
  rate AS "⭐ 评分", 
  date AS "📅 日期"
FROM #Resource AND #SourceCodeAnalysis  
SORT type, rate DESC, date DESC
```

- 📺视频
	- spring
		- 2022
			- [霸气骚气帅气的最强Java老詹带你手写Spring以及阅读源码](https://www.bilibili.com/video/BV11P4y1M7vF?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Spring源码 - 极客时间](https://www.bilibili.com/video/BV1Bd4y1U7Ec?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- early
			- [spring源码集锦](https://www.bilibili.com/video/BV18Q4y1r7ZT?vd_source=84272a2d7f72158b38778819be5bc6ad) 👍
			- [spring源码 - 马士兵教育](https://www.bilibili.com/video/BV1nK4y1u7ni?p=263&vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Java工程师高薪训练营 5 期2021年 之 开源框架源码剖析 - 拉勾教育](https://www.bilibili.com/video/BV1qA4y1S7S7?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [spring源码基础篇 - 子路](https://www.bilibili.com/video/BV1Ek4y1r7j5?p=6&vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Spring IOC核心源码分析](https://www.bilibili.com/video/BV1zB4y1T7RK?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [【Java Spring源码解读】从0实现最新完整Spring5底层源码](https://www.bilibili.com/video/BV1BZrhYfEu3?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- 零散
			- [Spring 无参构造的推断](https://www.bilibili.com/video/BV1vt4y1J76n?vd_source=84272a2d7f72158b38778819be5bc6ad) & [Spring 循环依赖](https://www.bilibili.com/video/BV1fK411f7bG?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [【关于Spring的两三事】](https://www.bilibili.com/video/BV1wAU7Y1EMg?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Spring源码解析一小时通关](https://www.bilibili.com/video/BV1oEwbegEy3?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [动画学Spring如何用三级缓存解决循环依赖](https://www.bilibili.com/video/BV1AJ4m157MU?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [彻底拿捏Spring循环依赖以及三个级别缓存](https://www.bilibili.com/video/BV1HwkvYmEXv?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [源码级讲解spring三级缓存解决循环依赖](https://www.bilibili.com/video/BV1RX4y1c7qB?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Spring Bean循环依赖源码解析，不一定是最好的，但一定是听着最爽的 - 鲁班大叔](https://www.bilibili.com/video/BV1dy4y1C7MP?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Spring Bean 生命周期源码解析](https://www.bilibili.com/video/BV1GY411g7JK?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Spring之bean的生命周期以及循环依赖的源码分析](https://www.bilibili.com/video/BV1bX4y1w7Sr?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Bean的循环依赖与三级缓存](https://www.bilibili.com/video/BV1PM411v7vs?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [循环依赖](https://www.bilibili.com/video/BV1Pp421R7k6?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [图解Spring源码](https://www.bilibili.com/video/BV1Lj9tY5ESf?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Spring事务传播原理及数据库事务操作原理](https://www.bilibili.com/video/BV1R64y1R7Pm?p=12&vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [spring事务源码解析](https://www.bilibili.com/video/BV1ey4y1E7uA?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [spring申明式事务深层剖析](https://www.bilibili.com/video/BV1VE41157Um?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [《Spring源码》-第3章 AOP的原理以及实现](https://www.bilibili.com/video/BV1Kv411T7UV?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Spring AOP源码解读](https://www.bilibili.com/video/BV1XN4y1W78n?vd_source=84272a2d7f72158b38778819be5bc6ad)
	- Mybatis
		- 2025
			- [mybatis源码精讲](https://www.bilibili.com/video/BV1XFRvYwEiD?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- 2024
			- [狂野架构师第四期 | MyBatis 源码剖析 - 子慕](https://www.bilibili.com/video/BV1fQ4y1F7ZQ?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [MyBatis源码 - 马士兵教育](https://www.bilibili.com/video/BV1cw411E7CY?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [手写MyBatis源码](https://www.bilibili.com/video/BV1uK4y1q7T2?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- 2023
			- [看源码学软件设计](https://www.bilibili.com/video/BV1cm4y1G7WX?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Mybatis-源码系列](https://www.bilibili.com/video/BV1dT411z7fL?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [深入剖析MyBatis核心原理 - 拉勾教育](https://www.bilibili.com/video/BV1Gs4y1j7j7?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- 2022
			- [霸气骚气帅气的最强Java老詹带你手写Mybatis以及阅读源码](https://www.bilibili.com/video/BV1Y34y187yT?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [13小时撕开Mybatis源码，吊打面试官 - 黑马子慕](https://www.bilibili.com/video/BV1R14y1W7yS?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [硬核，MyBatis源码解析](https://www.bilibili.com/video/BV1tt4y1u7u3?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [MyBatis 源码解读](https://www.bilibili.com/video/BV1sP4y1o7kB?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- early
			- [mybatis源码 - 马士兵教育](https://www.bilibili.com/video/BV1nK4y1u7ni?p=269&vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [Mybatis应用分析与最佳实践 - 咕泡教育](https://www.bilibili.com/video/BV1R64y1R7Pm?p=15&vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [MyBatis原理](https://www.bilibili.com/video/BV1Jh411v7Uf?vd_source=84272a2d7f72158b38778819be5bc6ad)
			- [MyBatis源码解析大合集 - 鲁班大叔](https://www.bilibili.com/video/BV1Tp4y1X7FM?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- 零散
			- [【小飞非系列】源码分析-Mybatis的源码分析-执行过程](https://www.bilibili.com/video/BV1J64y1q7V8?vd_source=84272a2d7f72158b38778819be5bc6ad) &  [【小飞非系列】Mybatis插件原理分析](https://www.bilibili.com/video/BV1hy4y1j7oF?vd_source=84272a2d7f72158b38778819be5bc6ad)
	- JUC
		- [T灵第五期-并发编程](https://www.bilibili.com/video/BV1oB4y1Y7Dt?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- [JUC并发编程](https://www.bilibili.com/video/BV1VR4y1z7yn?vd_source=84272a2d7f72158b38778819be5bc6ad)
	- RuoYi-Vue-Plus
		- [RUOYI-VUE-PLUS框架讲解](https://www.bilibili.com/video/BV1Ci421y7xg?vd_source=84272a2d7f72158b38778819be5bc6ad)
	- RuoYi-Cloud-Plus
		- [若依微服务PLUS版本源码详解与二次开发](https://www.bilibili.com/video/BV1yA411r7ji?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- [若依微服务Plus版入门与进阶](https://www.bilibili.com/video/BV1yg411e7Kt?vd_source=84272a2d7f72158b38778819be5bc6ad)
		- [ruoyi-cloud-plus2.x新特性讲解](https://www.bilibili.com/video/BV1fG411y7JN?vd_source=84272a2d7f72158b38778819be5bc6ad)
	- RuoYi-Vue
		- [庖丁解牛若依分离版【全栈系列课程】](https://www.bilibili.com/video/BV1ZyfoYLEzY?vd_source=84272a2d7f72158b38778819be5bc6ad)
