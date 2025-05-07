# svelte5-editable-table

A simple and lightweight Svelte 5 editable table component. It allows users to edit data and perform additional operations through icon selection.

This project started as a fork of [svelte-generic-crud-table](https://github.com/ivosdc/svelte-generic-crud-table). However, nearly all the code has been rewritten to improve performance, add new features, support responsiveness, and remove outdated functionality.

## Features

- **Editable Cells**: Enables users to edit specific cells in the table.
- **Customizable Columns**: Configure columns with options like `edit`, `width`, and `displayName`.
- **Row Selection**: Supports both single and multiple row selection.
- **Custom Styles**: Define styles for rows, including hover, click, and alternate row styles.
- **Icons and Tooltips**: Customize icons and tooltips for actions like edit, operation, confirm, and cancel.
- **Sorting**: Enable or disable sorting for columns.
- **Responsive Design**: Automatically adjusts column widths using the `autowidth` option.
- **Event Callbacks**: Handle events like cell clicks, updates, and operations with custom callbacks.

## Installation

```sh
npm install --save svelte5-editable-table 
```

## Usage

```html
<script> 
  import { SvelteEditTable } from "svelte5-editable-table";  
</script> 

<SvelteEditTable  
  table_config={table_config}
  rows_data={rows} 
/>  
```

## Sample Data and Configuration

```js
// Sample data (adapted from Kaggle)

const rows = [
  { index: 1, firstname: "Sara", lastname: "Mcguire", sex: "Female", email: "tsharp@example.net", phone: "(971)643-6089x9160", birthdate: "17-08-21" },
  { index: 2, firstname: "Alisha", lastname: "Hebert", sex: "Male", email: "vincentgarrett@example.net", phone: "+1-114-355-1841x78347", birthdate: "28-06-69" },
  { index: 3, firstname: "Gwendolyn", lastname: "Sheppard", sex: "Male", email: "mercadon@example.com", phone: "9017807728", birthdate: "25-09-15" },
  { index: 4, firstname: "Kristine", lastname: "Mccann", sex: "Female", email: "lindsay55@example.com", phone: "+1-607-333-9911x59088", birthdate: "27-07-78" },
  { index: 5, firstname: "Bobby", lastname: "Pittman", sex: "Female", email: "blevins@example.com", phone: "3739847538", birthdate: "17-11-89" }, 
];

// Column configuration
const columns = [            
  { key: 'index', displayName: 'Index' },
  { key: 'firstname', displayName: 'First Name' },
  { key: 'lastname', displayName: 'Last Name' },
  { key: 'sex', displayName: 'Sex' },
  { key: 'email', displayName: 'Email' },
  { key: 'phone', displayName: 'Phone' },
  { key: 'birthdate', displayName: 'Birth Date' }
];

// Table configuration
let table_config = {             
  columns_setting: columns,        
};
```

## Props of `columns_setting`

| Name           | Type          | Description                                                             |
| --------------- | -------------| ----------------------------------------------------------------------- |
| `key`          | String        | Unique key identifying the column                                       |
| `displayName`  | String        | Name for the column header                                              |
| `width`        | Boolean       | Width of the column. Only valid when `autowidth` is set to `false`      |
| `edit`         | Boolean       | Optional. Default: `false`                                              |

## Props of `table_config`

| Option                     | Type            | Description                                                             |
| -------------------------- | --------------- | ----------------------------------------------------------------------- |
| `columns_setting`          | Object[]        | Configuration of columns (array)                                        |
| `autowidth`                | Boolean         | Automatically adjusts column widths. Default: `true`                    |
| `sortable`                 | Boolean         | Enables sorting. Default: `true`                                        |
| `operation`                | Boolean         | Displays an extra operation icon. Default: `false`                      |
| `style`                    | Object          | Row style configuration. Allows custom styling for rows or cells. See examples below. |
| `icons`                    | Object          | Optional icons (e.g., emoji) for operations or actions. See examples below. |
| `iconstip`                 | Object          | Optional tooltip text for icons. See examples below.                    |

### Examples for `style`, `icons`, and `iconstip`

#### `style`

The `style` property allows you to define custom styles for rows in the table. You can specify styles for alternate rows, hovered rows, clicked rows, and selected rows. This provides flexibility to customize the appearance of the table.

```js
let table_config = {
  ...existing code...
  style: {
    alternateRow: '#fff7fb', // Background color for alternate rows
    hoverRow: "yellow",      // Background color when a row is hovered
    clickRow: "dashed red",  // Border style for a clicked row
    selectedRow: "#f0f5ff"   // Background color for selected rows
  },
};
```

- `alternateRow`: Sets the background color for alternate rows.
- `hoverRow`: Sets the background color when a row is hovered.
- `clickRow`: Sets the border style for a clicked row.
- `selectedRow`: Sets the background color for selected rows.

#### `icons`

You can customize icons for actions like edit, operation, confirm, or cancel.

```js
let table_config = {
  ...existing code...
  icons: {
    edit: "✏️",
    operation: "🗑️",
  },
};
```

- `edit`: Icon for the edit action.
- `operation`: Icon for the extra operation action.
- `confirm`: Icon for the confirmation action.
- `cancel`: Icon for the cancel action.

#### `iconstip`

You can define tooltips for the icons to provide different context (e.g., different languages). For example:

```js
let table_config = {
  ...existing code...
  iconstip: {
    edit: "Update",
    operation: "Delete",
    confirm: "確認",
  },
};
```

- `edit`: Tooltip text for the edit icon.
- `operation`: Tooltip text for the operation icon.
- `confirm`: Tooltip text for the confirmation icon.
- `cancel`: Tooltip text for the cancel icon.

### Props of the Component

Pass the following parameters to the component:

| Parameter      | Callback            | Description                                                             |
| -------------- | ------------------- | ----------------------------------------------------------------------- |
| `onclickCell`  | `event` (id, key, row) | Triggered when a cell is clicked                                        |
| `onupdate`     | `event` (id, row)   | Triggered when the edit icon is clicked                                 |
| `onoperation`  | `event` (id, row)   | Triggered when the operation icon is clicked                            |
| `selectedrow`  |                     | Pass selected rows (id)                                                 |
| `table_config` |                     | Configuration of the table, including column settings and additional options like sorting, styling, and icons |
| `rows_data`    |                     | Data of rows                                                            |

### Selecting Multiple Rows

- By default, single row selection is handled by clicking on a row. However, multiple row selection is managed through the `onclickCell` event and the `selectedrow` property.

```html
<script>  
  import { SvelteEditTable } from 'svelte5-editable-table';
  let selectedrow = $state([]);
  function handleCell(event) {       
    selectedrow = [...selectedrow, event.id];        
  }
</script> 
<SvelteEditTable
  table_config={table_config}
  rows_data={rows}
  selectedrow={selectedrow}
  onclickCell={handleCell}  
/> 
```





