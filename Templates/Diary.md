---
create_time: <% tp.file.creation_date() %>
update_time: <% tp.file.last_modified_date() %>
---
> [!check] 所有与今天相关的任务（无论是截止、计划或者开始）
>
> ```tasks
> (due today OR scheduled today OR starts today)
> ```

> [!failure] 所有未完成的任务
>
> ```tasks
> not done
> hide edit button
> hide backlink
> group by function \
>     const date = task.due.moment; \
>     const tomorrow  = moment().add(1,'days'); \
>     const now = moment(); \
>     const label = (order, name) => `%%${order}%% ==${name}==`; \
>     if (!date)                           return label(5, 'Undated'); \
>     if (!date.isValid())                 return label(0, 'Invalid date'); \
>     if (date.isBefore(now, 'day'))       return label(1, 'Overdue'); \
>     if (date.isSame(now, 'day'))         return label(2, 'Today'); \
>     if (date.isSame(tomorrow, 'day'))    return label(3, 'Tomorrow'); \
>     return label(4, 'Future');
> ```
