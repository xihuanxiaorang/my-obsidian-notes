---
create_time: <% tp.file.creation_date() %>
update_time: <% tp.file.last_modified_date() %>
---
```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "修改时间"
FROM ""
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
