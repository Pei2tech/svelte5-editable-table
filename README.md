# svelte5-editable-table

A simple and small svelte 5 editable table component. Allows editing data and option operation on icon selection.

## Example

[example](https://dasdaniel.github.io/svelte-table/)

## Install

```sh
npm install -save svelte5-editable-table 
```

## Usage

```html
<script> 
  import {SveltEditeTable} from "svelte5-editable-table";  
</script> 

<SvelteEditTable  
               table_config={table_config}
               rows_data={rows}/>  
```


## Sample Data and config

```js
// define sample data (below data are from kaggle web site)...

const rows = [
 { Index: 1, FirstName: "Sara", LastName: "Mcguire", Sex: "Female", Email: "tsharp@example.net", Phone: "(971)643-6089x9160", BirthDate: "17-08-21" },
 { Index: 2, FirstName: "Alisha", LastName: "Hebert", Sex: "Male", Email: "vincentgarrett@example.net", Phone: "+1-114-355-1841x78347", BirthDate: "28-06-69" },
 { Index: 3, FirstName: "Gwendolyn", LastName: "Sheppard", Sex: "Male", Email: "mercadon@example.com", Phone: "9017807728", BirthDate: "25-09-15" },
 { Index: 4, FirstName: "Kristine", LastName: "Mccann", Sex: "Female", Email: "lindsay55@example.com", Phone: "+1-607-333-9911x59088", BirthDate: "27-07-78" },
 { Index: 5, FirstName: "Bobby", LastName: "Pittman", Sex: "Female", Email: "blevins@example.com", Phone: "3739847538", BirthDate: "17-11-89" }, 
 ];


// define column configures
const columns = [            
        {key: 'index', displayName:'Index'},
        {key: 'firstname', displayName: 'FirstName'},
        {key: 'lastname', displayName: 'LastName'},
        {key: 'sex', displayName: 'Sex'},
        {key: 'email', displayName: 'Email', edit: true},
        {key: 'phone', displayName: 'Phone'},
        {key: 'birthdate', displayName:'BirthDate'}
        ];

// define table configuration
 let table_config = {             
        columns_setting: columns,        
      }        
```

 ## Props of columns_setting

| Name           | Type          | Description 
| `key`          | String        | Unique key identifying the column (array)                                           |
| `displayName`  | String        | Name for header(array)                                                        |
| `width`        | Boolen        | Width of Field. vailid for authwidth:false  
| `edit`         | Boolen        | optional. default: false  


## Props of table_config

| Option                     | Type            | Description                                                             |
| -------------------------- | --------------- | ----------------------------------------------------------------------- |
| `columns_setting`          | Object[]        | configuration of columns (array)                                           |
| `rows`                     | Object[]        | row (data) (array)                                                        |
| `autowidth`                | Boolen          | Width ajustment. default: true  
| `sortable`                 | Boolen          | Sorting default: true  
| `operation`                | Boolen          | extra operation icon default: false                                                          |
| `style`                    | Object          | row style (see below detailed)              |
| `icons`                    | Object          | optional icons (emoji)
| `iconstip`                 | Object          | optional icons tips 
  


###  Props of component

 pass the following params to component 

| paramenter    |  call back        | Description     |
| ------------- | ---------------   | --------------- |
| `onclickCell` | `event` (id, key, row) | click on a cell   |
| `onupdate`    | `event` (id, row) | click on a edit icon |
| `onoperation` | `event` (id, row) | click on a operation icon |
| `selectedrow` |                   | pass selected rows (id)  
| `table_config`|                   | configuration of table
| `rows_data`   |                   | data of rows   




### Selecting multiply Rows

- By default, single row selection is handled by clickRow, However, multiple rows is handled through `onclickCell` and the `selectedrow` properity.


```html
<script>  
  import {SvelteEditTable} from 'svelte5-editable-table';
  let selectedrow=$state([]);
  function handleCell(event) {       
        selectedrow=[...selectedrow, event.id]        
  }
</script> 
<SvelteEditTable
  table_config={table_config}
  rows_data="{rows}"
  selectedrow={selectedrow}
  onclickCell={handleCell}  
/> 
```


### `searchValue`

#### Option 1: `searchValue(row, searchTerm):boolean`

Define a function that accepts a row and the searchTerm, the comparison is defined within the function and the match is returned in the form of a boolean.

This is the recommended way of using the search (added in v0.5.3)

#### Option 2: `searchValue(row):string`

Define a function that accepts a row and returns a string. SveltTable does the comparison internally, but only supports case-insensitive compare using `includes`

This behaviour is set for deprecation and should not be used.

If you want to migrate the existing behaviour you can use this example:

```js
searchValue: (v, s) = 
  v["some_key"].toString().toLowerCase().includes(s.toLowerCase()),
```

### `renderComponent`

Defining a component can be done directly by passing the component as a value

```js
[
  {
    key: "myColumn",
    //...
    renderComponent: myComponent,
  },
];
```

Or, if props need to be passed, an object with `component` and `props` can be passed.

```js
[
  {
    key: "myColumn",
    //...
    renderComponent: {
      component: myComponent,
      props: {
        myProp: "someValue",
      },
    },
  },
];
```

