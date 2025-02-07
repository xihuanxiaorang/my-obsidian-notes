---
title: "[Obs＃54] Obsidian的任務管理技巧彙總 – 簡睿隨筆"
source: "https://jdev.tw/blog/6858"
author:
published:
created: 2025-02-07
description:
tags:
  - "clippings"
update_time: 2025/02/07 22:28
---

由 · 發表於: 2021/10/03 · 更新於: 2021/10/15 | 瀏覽數: 6 / 9117

標籤： [Markdown](https://jdev.tw/blog/tag/markdown)[obsidian](https://jdev.tw/blog/tag/obsidian)

![tp.web.random_picture|600](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hlY2tsaXN0fHx8fHx8MTYzMTI0ODU2Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1600)

本次介紹與任務管理相關的幾個技巧與搭配的外掛，使用到的外掛是：

- Tasks
- Reminder
- Calendar
- Templater
- QuickAdd
- Kanban
- Min3ditorHotkeys

為了更方便與即時檢視需要處理的待辦事項，我們可以把待辦事項加入每日筆記裡，因此每日筆記的建立與使用也加入工作流程裡。

### 添加待辦事項技巧

1. 直接輸入待辦事項，輸入完成後按兩個 Ctrl+Enter
2. 在待辦事項上按 Ctrl+Enter 以切換完成狀態
3. 啟用【設定】→【編輯器】→【智慧列表】後，在待辦事項最末處按 Enter 會自動再新增待辦事項
4. 另一個快速複製待辦事項的方法：安裝 Min3ditorHotkeys 外掛並啟用後，在待辦事項處按 Ctrl+D (D 可聯想為 Duplicate) 以複製成為下一個事項

### Tasks 外掛

- Tasks 外掛提供查詢語法，可以讓我們快速搜尋與過濾出待辦事項
- 在待辦事項處按 Ctrl+Alt+Enter (Option+Cmd+Enter) 可維護到期日與重覆設定
- 無法設定到期時間，要指定到期時間的話可使用**Reminder**外掛

### 查詢語法 (第三人稱)

- 完成/未完成：done 或 not done
	- 完成日期：done before/after/on 日期
- 无到期日：no due date
- 到期日过滤：due before/after/on 日期
	- 日期可使用 today, yesterday, tomorrow, next week， last Friday, in two weeks 等
- 路径
	- 要搜寻：path includes 路径
	- 不搜寻：path does not include 路径
- 事项描述
	- description includes 字串
	- description does not include 字串
- 最靠近标题
	- heading includes 标题
	- heading does not include 标题
- 是否重覆：is recurring, is not recurring
- 排除某個事項：excludes 清單事項
- 限制顯示事項數目：limit to 數值 tasks
- 排序：sort by (status|due|done|path|description)
- 顯示樣式隱藏 hide
- edit button
- backlink
- done date
- due date
- recurrence rule
- task count

### Tasks 範例

- [GitHub範例](https://github.com/schemar/obsidian-tasks#layout-options)

```
\`\`\`tasks
not done
due before {{date:YYYY-MM-DD}}
\`\`\`

## 未完成任務
\`\`\`tasks
not done
due before today
\`\`\`

## 未完成之無期限任務
\`\`\`tasks
path includes 020-Daily
path does not include todo
not done
no due date
\`\`\`

## 明天到期任務
\`\`\`tasks
due on tomorrow
\`\`\`

## 昨天完成任務
\`\`\`tasks
done on yesterday
\`\`\`
```

## Reminder 外掛

### 功能

- 側邊欄 Reminder 面板顯示待辦事項到期資訊
- 點擊 Reminder 面板開啟該事項所在之筆記

### 選項設定

- Reminder Time：預設的到期時間
- Primary reminder format：若需要到期時間則建議選用 Reminder

### 設置

- 在待辦事項後面輸入 (@日期時間)
- 預設的觸發文字是「(@」，可於設定裡變更
- 觸發文字輸入後會彈出日曆視窗

## Calendar 外掛

- 使用 Calendar 可以更方便的檢視與建立每日筆記
- 如果有做周記的需求，可以在選項裡啟用 Show work number
- 選項裡的 Trigger 最好啟用，建立筆記時模板內的 Templater 程式碼才會生效

## Kanban 整合

- @{日期} @@{時間}
- Kanban 的日期時間格式無法同步到 Reminder，因此建議用 Reminder 的格式

## Dataview

Dataview 的 task 也可列出待辦事項。

↓未完成事項

```
\`\`\`dataview
task where !completed
\`\`\`
```

## 相關連結

- [Simple calendar widget GitHub](https://github.com/liamcain/obsidian-calendar-plugin)
- [Reminder plugin GitHub](https://github.com/uphy/obsidian-reminder)
- [Obsidian Reminder官網](https://uphy.github.io/obsidian-reminder/)
- [Task management GitHub](https://github.com/schemar/obsidian-tasks)

## 教學影片

![](https://www.youtube.com/watch?v=wETtIAFFcfw)

＃＃

#### 您可能也會有興趣的類似文章

- [Obsidian 1.0 新手教學—打造個人知識管理利器，專屬的第二大腦 (2022 年)](https://jdev.tw/blog/7745/obsidian-v1-0-introduction-2022 "Obsidian 1.0 新手教學—打造個人知識管理利器，專屬的第二大腦 (2022 年)") (4 則留言, 2022/10/22)
- [Obs123-掌握 Obsidian 的神秘技巧：解密鮮為人知的操作方法](https://jdev.tw/blog/8091/lesser-known-obsidian-tips "Obs123-掌握 Obsidian 的神秘技巧：解密鮮為人知的操作方法") (0 則留言, 2023/04/15)
- [\[Obs＃55\] 建立新筆記的模板設定-Calendar, Templater 與 QuickAdd](https://jdev.tw/blog/6861/obsidian-templater-and-quickadd-samples "[Obs＃55] 建立新筆記的模板設定-Calendar, Templater 與 QuickAdd") (0 則留言, 2021/10/09)
- [Obs140｜Obsidian 進階全文檢索與複製結果的外掛－Query Control、Better Search View、Float Search、Text Expand、File Cooker](https://jdev.tw/blog/8204/obsidian-advanced-text-search-plugins "Obs140｜Obsidian 進階全文檢索與複製結果的外掛－Query Control、Better Search View、Float Search、Text Expand、File Cooker") (0 則留言, 2023/09/15)
- [\[Obs＃36\] Kanban：提升待辦事項成為專案管理任務](https://jdev.tw/blog/6653/obsidian-plugin-kanban-project-management "[Obs＃36] Kanban：提升待辦事項成為專案管理任務") (0 則留言, 2021/04/26)
- [\[Obs＃86\] 分享與編輯器相關的 21 個 Obsidian 外掛](https://jdev.tw/blog/7102/21-obsidian-plugins-for-editor "[Obs＃86] 分享與編輯器相關的 21 個 Obsidian 外掛") (0 則留言, 2022/05/08)
- [Obs126｜Obsidian 2023/04 7 個新外掛介紹與評析](https://jdev.tw/blog/8107/obsidian-7-new-plugins-introduction "Obs126｜Obsidian 2023/04 7 個新外掛介紹與評析") (0 則留言, 2023/04/29)
- [Obs170｜Obsidian 的官方網頁擷取工具：Obsidian Web Clipper；設定與使用](https://jdev.tw/blog/8611/obsidian-web-clipper-for-browser-extension "Obs170｜Obsidian 的官方網頁擷取工具：Obsidian Web Clipper；設定與使用") (0 則留言, 2024/11/24)
- [Obs167｜複製 Dataview 表格成為 Markdown 格式的外掛：Enhanced Copy 與 Dataview Serializer](https://jdev.tw/blog/8510/copy-dataview-markdown-plugins "Obs167｜複製 Dataview 表格成為 Markdown 格式的外掛：Enhanced Copy 與 Dataview Serializer") (0 則留言, 2024/09/01)
- [Obs139｜5 個方便維護 Properties 的外掛：Linter、TagMany、File Cooker、Tag Wrangler、Templater Hotkeys](https://jdev.tw/blog/8198/5-plugins-for-managing-properties "Obs139｜5 個方便維護 Properties 的外掛：Linter、TagMany、File Cooker、Tag Wrangler、Templater Hotkeys") (0 則留言, 2023/09/10)
- [Obs135｜解鎖簡易 Dataview 查詢：驚人的 SQL 技巧，使用 Query All The Things (QATT) 外掛](https://jdev.tw/blog/8166/obsidian-query-all-the-things-qatt-sql "Obs135｜解鎖簡易 Dataview 查詢：驚人的 SQL 技巧，使用 Query All The Things (QATT) 外掛") (0 則留言, 2023/08/19)
- [\[Obs #12 \] Obsidian v0.8.4~v0.8.9 的新增功能](https://jdev.tw/blog/6409/obs12-obsidian-v0-8-9-features "[Obs #12 ] Obsidian v0.8.4~v0.8.9 的新增功能") (0 則留言, 2020/09/06)
- [\[OBS＃32\] templater: 無限擴充可能的第三方樣板外掛](https://jdev.tw/blog/6615/new-templater-with-eta "[OBS＃32] templater: 無限擴充可能的第三方樣板外掛") (0 則留言, 2021/04/10)
- [\[Obs＃87\] 章節標題自動編號與設定編號形式的 Obsidian 外掛：Number Headings](https://jdev.tw/blog/7107/obsikdian-plugin-number-headings "[Obs＃87] 章節標題自動編號與設定編號形式的 Obsidian 外掛：Number Headings") (0 則留言, 2022/05/12)
- [Obs146｜Obsidian 彙總常用說明網站的助手：HelpMate](https://jdev.tw/blog/8270/obsidian-helpmate-plugin "Obs146｜Obsidian 彙總常用說明網站的助手：HelpMate") (0 則留言, 2023/12/03)

![](https://secure.gravatar.com/avatar/0ab2c84da1b8d49c7a7db8722174955a?s=128&d=monsterid&r=g)

簡睿

服務於軟體業的資訊老兵。興趣廣泛，學習力佳，樂於分享所知所學。

#### 您可能也會喜歡…
