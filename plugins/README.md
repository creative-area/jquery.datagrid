jquery.datagrid - plugins
=========================


## jquery.datagrid.bootstrap3.js


Use it with Bootstrap 3.

### sorter

`bootstrap`

```javascript
options = {
	up: "chevron-up", // icon (add class `glyphicon glyphicon-[options.up]`)
	down: "chevron-down", // icon (add class `glyphicon glyphicon-[options.down]`)
	icons: false // false ("chevron"), "arrow", "load" (use prefix for both up and down)
}
```

`bootstrap-chevron`

Extend `"bootstrap"` with `options = {}`

`bootstrap-arrow`

Extend `"bootstrap"` with `options = { "icons": "arrow" }`

`bootstrap-load`

Extend `"bootstrap"` with `options = { "icons": "load" }`

### pager

`bootstrap`

Extend `"default"` with `options`:

```javascript
options = {
	item: "li",
	attrUl: { "class": "pagination" },
	attrItemActive: { "class": "active" },
	attrItemDisabled: { "class": "disabled" },
	link: true,
	behavior: { "sliding": { "pages": 3 } },
	firstPage: "&lt;&lt;",
	prevPage: "&lt;",
	nextPage: "&gt;",
	lastPage: "&gt;&gt;"
}
```

`bootstrap-sm`

Extend `"bootstrap"` with `options = { attrUl: { "class": "pagination pagination-sm" } }`

`bootstrap-lg`

Extend `"bootstrap"` with `options = { attrUl: { "class": "pagination pagination-lg" } }`

### cell

`bootstrap-button`

Render a button with an optional icon (from glyphicon or font-awesome)

```javascript
options = {
	icons: "glyphicon", // "glyphicon", "fa" (font-awesome)
	style: false, // "primary", "info", "success", "warning", "danger", "inverse"
	size: false, // "lg", "sm", "xs"
	classes: false, // add css class
	icon: false,
	value: data.value
}
```

`fa-button`

Extend `"bootstrap-button"` with `options = { "icons": "fa" }`

----

## jquery.datagrid.bootstrap.js


Use it with Bootstrap 2.

### sorter

`bootstrap`

```javascript
options = {
	up: "chevron-up", // icon (add class `icon-[options.up]`)
	down: "chevron-down", // icon (add class `icon-[options.down]`)
	icons: false // false ("chevron"), "arrow", "load" (use prefix for both up and down)
}
```

`bootstrap-chevron`

Extend `"bootstrap"` with `options = {}`

`bootstrap-arrow`

Extend `"bootstrap"` with `options = { "icons": "arrow" }`

`bootstrap-load`

Extend `"bootstrap"` with `options = { "icons": "load" }`

### pager

`bootstrap`

Extend `"default"` with `options`:

```javascript
options = {
	item: "li",
	attrUl: { "class": "pagination" },
	attrItemActive: { "class": "active" },
	attrItemDisabled: { "class": "disabled" },
	link: true,
	behavior: { "sliding": { "pages": 3 } },
	firstPage: "&lt;&lt;",
	prevPage: "&lt;",
	nextPage: "&gt;",
	lastPage: "&gt;&gt;"
}
```

`bootstrap-center`

Extend `"bootstrap"` with `options = { attrUl: { "class": "pagination pagination-centered" } }`

`bootstrap-right`

Extend `"bootstrap"` with `options = { attrUl: { "class": "pagination pagination-right" } }`

### cell

`bootstrap-button`

Render a button with an optional icon

```javascript
options = {
	style: false, // "primary", "info", "success", "warning", "danger", "inverse"
	size: false, // "lg", "sm", "xs"
	classes: false, // add css class
	icon: false,
	value: data.value
}
```
