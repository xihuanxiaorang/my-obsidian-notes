---
create_time: <% tp.file.creation_date() %>
update_time: <% tp.file.last_modified_date() %>
---

> [!check] 查询所有与今天相关的任务（无论是截止、计划或者开始）
>
> ```tasks
> not done
> (due after today) OR (scheduled today) OR ((starts on today) AND (has start date)) 
> hide backlink
> ```

> [!failure] 已逾期任务
>
> ```tasks
> not done
> (has start date) AND (due before today)
> hide edit button
> hide backlink
> ```
