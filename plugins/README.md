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

All cell plugin option can be set by a `string` or a `function` (must return expected option value and has `data` as argument, same as column render callback function).

`bootstrap-button`

Render a button with an optional icon (from glyphicon or font-awesome)

```javascript
options = {
	icons: "glyphicon", // "glyphicon", "fa" (font-awesome)
	style: false, // "primary", "info", "success", "warning", "danger", "inverse"
	size: false, // "lg", "sm", "xs"
	classes: false, // add css class
	css: false, // add css style
	icon: false,
	value: data.value
}
```

`fa-button`

Extend `"bootstrap-button"` with `options = { "icons": "fa" }`

`bootstrap-button-boolean`

Render a button with an optional icon (from glyphicon or font-awesome). Adapt the button according to the cell value (`value` equals `valueOn` or not).

```javascript
options = {
	icons: "glyphicon", // "glyphicon", "fa" (font-awesome)
	styleOn: "success", // "default", "primary", "info", "success", "warning", "danger", "inverse"
	styleOff: "warning",
	style: false, // shortcut for "styleOn" = "styleOff" = "style"
	classes: false, // add css class
	css: false, // add css style
	valueOn: "1", // "value" checked to select options "On" (else select options "Off")
	displayOn: "yes", // what is displayed if value == valueOn
	displayOff: "no", // what is displayed if value <> valueOn
	display: false, // shortcut for "displayOn" = "displayOff" = "display"
	iconOn: false,
	iconOff: false,
	icon: false, // shortcut for "iconOn" = "iconOff" = "icon"
	size: false // "lg", "sm", "xs"
}
```

`bootstrap-button-yn`

Extend `"bootstrap-button"` with `options = { "valueOn": "Y" }`

`fa-button-boolean`

Extend `"bootstrap-button-boolean"` with `options = { "icons": "fa" }`

`fa-button-yn`

Extend `"bootstrap-button-boolean"` with `options = { "icons": "fa", "valueOn": "Y" }`

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

All cell plugin option can be set by a `string` or a `function` (must return expected option value and has `data` as argument, same as column render callback function).

`bootstrap-button`

Render a button with an optional icon

```javascript
options = {
	style: false, // "primary", "info", "success", "warning", "danger", "inverse"
	size: false, // "large", "small", "mini"
	classes: false, // add css class
	css: false, // add css style
	icon: false,
	value: data.value
}
```

`bootstrap-button-boolean`

Render a button with an optional icon. Adapt the button according to the cell value (`value` equals `valueOn` or not).

```javascript
options = {
	styleOn: "success", // "primary", "info", "success", "warning", "danger", "inverse"
	styleOff: "warning",
	style: false, // shortcut for "styleOn" = "styleOff" = "style"
	classes: false, // add css class
	css: false, // add css style
	valueOn: "1", // "value" checked to select options "On" (else select options "Off")
	displayOn: "yes", // what is displayed if value == valueOn
	displayOff: "no", // what is displayed if value <> valueOn
	display: false, // shortcut for "displayOn" = "displayOff" = "display"
	iconOn: false,
	iconOff: false,
	icon: false, // shortcut for "iconOn" = "iconOff" = "icon"
	size: false // "large", "small", "mini"
}
```

`bootstrap-button-yn`

Extend `"bootstrap-button"` with `options = { "valueOn": "Y" }`
