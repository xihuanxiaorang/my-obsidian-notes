---
tags:
  - Java/Collection
  - Interview
create_time: 2024-12-28T17:46:00
update_time: 2025/04/14 18:46
---

```plantuml
@startuml

' 设置背景为深色
skinparam backgroundColor #1E1E1E

' 设置默认文本颜色为白色
skinparam defaultTextColor white

' 设置类的背景和边框颜色
skinparam ClassBackgroundColor #2D2D2D
skinparam ClassBorderColor #555555
skinparam ClassFontColor white

' 设置类属性和方法的颜色
skinparam ClassAttributeIconColor #A0A0A0
skinparam ClassStereotypeFontColor #A0A0A0

' 设置连接线颜色和箭头颜色
skinparam ArrowColor #A0A0A0
skinparam LineColor #A0A0A0

interface Iterable {}
interface Collection extends Iterable {}
interface List extends Collection {}
class CopyOnWriteArrayList implements List {}
class ArrayList implements List {}
class LinkedList implements List {}
class Vector implements List {}
interface Set extends Collection {}
class TreeSet implements Set {}
class HashSet implements Set {}
class LinkedHashSet implements HashSet {}

interface Map {}
class ConcurrentHashMap implements Map {}
class TreeMap implements Map {}
class HashTable implements Map {}
class HashMap implements Map {}
class LinkedHashMap implements HashMap {}

@enduml
```
