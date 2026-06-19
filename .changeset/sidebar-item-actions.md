---
'@rapidset/rapidkit': minor
---

SideBar: add an optional per-item `action` slot to `SideBarMenuItem`. The action renders as a trailing icon button that reveals on row hover/focus (or stays visible when `active`), so apps can offer inline row affordances such as favorite/unfavorite directly on nav and favorites items. Exposes a new `SideBarItemAction` type. Clicking the action does not trigger the row's navigation/`onSelect`, and the action is hidden in the collapsed icon rail.
