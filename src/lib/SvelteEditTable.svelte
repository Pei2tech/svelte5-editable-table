<script>   
    import { untrack } from 'svelte';    
    import { calculateColumnWidths } from "./calculatwidth";   

    const table_config_default = {
        autowidth: true,
        sortable: true,
        operation: false,
        icons: {},
        iconstip:{},
        style:{},
        columns_setting: [],     
    };
    /**
     * @typedef {Object} Props
     * @property {any} [rows_data]
     * @property {boolean} [clickborder]    
     * @property {any} [selectedrow]
     * @property {any} [table_config]
     * @property {void} [onupdate]
     * @property {void} [onoperation]
     * @property {void} [onclickCell]
     */

    /** @type {Props} */
    let {
        rows_data =  {},
        clickborder = true,    
        selectedrow = [],
        table_config = table_config_default, 
        onupdate,
        onoperation,
        onclickCell,        
    } = $props();

    let sortOrder = $state(null);
    let sortkey = $state("");
    let icons = $state({
        asc: '▲',
        desc: '▼',
        edit: '📝',
        cancel: '❌',
        confirm: '✔️︎',
        operation: '⛏️',
    });
    let iconstip=$state({
        edit: 'Edit',
        confirm: 'Confirm',
        cancel: 'Cancel',
        operation: 'Operation',
    });
    let rowstyle= $state({
        alternate: '#E0F0FE',
        hover: "lightgoldenrodyellow",
        click: 'solid red',
        selected: 'floralwhite'
    });
   
    let resize_position = $state("none");
    let overflow = $state("--overflow:visible");
    let rowbdcolor = $state([]);
    let editedFlag=$state(false);  
    let operationFlag = $state(false);
    let autowidthFlag = $state(true);
    let sortableFlag = $state(true);
    let fieldFlag = true;


    let tablewidth = $state();   
    let edit_id = $state({});
    let options_flag = $state([]);
    let options_edit_flag = $state([]);
    let options_operation_flag = $state([]);
    let sortStore = [];
    let columnsWidth = $state([]);
    let showCell=$state([]);
    const columnsResize = [];
    const NONE_OPERATION = -1;
    let last_id = NONE_OPERATION;
    let tempwidth=0;
    
       
    function calculateWidth() {        
        if (tablewidth===undefined || tablewidth==0)
            return;       
        columnsWidth.splice(0,columnsWidth.length);
        let keys=Object.keys(columnByKey);
        let width = tablewidth;
        let font_size = 10;
        let newobj={};
        if (rows_data.length !== 0)
            Object.entries(rows_data[0]).forEach(item=>newobj[item[0]]=item[0]);
        table_config.columns_setting.forEach(item=>newobj[item.key]=(item.displayName));
        let array = [newobj, ...rows_data];
        let newdata = array.map(row => {
            let newrow = Object.entries(row).filter(([key]) => keys.includes(key));
            if (editedFlag || operationFlag)
                newrow.push(["", "edit"]);
            return newrow.map(([, value]) => value + "");
        });
        let tempkey = Object.keys(newobj).filter(key => keys.includes(key));
        let tempcolumn = calculateColumnWidths(newdata, width, font_size).map(item => item +'px' );
        keys.forEach((key, index) => columnsWidth[index] = tempcolumn[tempkey.indexOf(key)]);

        if (!editedFlag && !operationFlag)
            columnsWidth.pop();       
    }

    function setMenualwidth(){
        if (fieldFlag && !autowidthFlag) {
            let totalwidth=0;
            let count=0;
            table_config.columns_setting.forEach(data=> {
                columnByKey[data.key] = data;
                if (data.edit) editedFlag = true;
                if (data.width) {
                    totalwidth += Number(data.width.slice(0, -2));
                    count += 1;
                }
            });            
            let fieldwidth = (editedFlag||operationFlag) ?
                    `${parseInt((tablewidth - totalwidth - 60) / (table_config.columns_setting.length - count))}px` :
                    `${parseInt((tablewidth - totalwidth) / (table_config.columns_setting.length - count))}px`;            
            Object.keys(columnByKey).forEach((key, index) => {
                columnsWidth[index] = columnByKey[key].hasOwnProperty("width") ? columnByKey[key].width : fieldwidth;
            });
        }
    }

    function handleEdit(id,event) {
        event.stopPropagation();
        cancelEditingValue(id);
        last_id = id;
        table_config.columns_setting.forEach((item,j) => {
            if (item.edit) {
                showCell[id][j]=false;
            }
        });
        options_flag[id]=false;
        options_edit_flag[id]=true;
        options_operation_flag[id]=false;
    }

    function resetEditOperation(id) {
        if (id===NONE_OPERATION)
            return
        if (editedFlag) {
            table_config.columns_setting.forEach((item,j) => {
                if (item.edit) {
                    showCell[id][j]=true;
                }
            });
        }
        options_flag[id]=true;
        if (editedFlag) options_edit_flag[id]=false;
        if (operationFlag) options_operation_flag[id]=false;
    }

    function handleCancelEdit(id) {
        resetEditOperation(id);
        last_id = NONE_OPERATION;
    }

    function getUpdates(id) {
        const body = { ...rows_data[id] };
        table_config.columns_setting.forEach((item,j) => {
            if (item.edit) {
                showCell[id][j]=true;
                body[item.key] = edit_id[item.key + id].value;
            }
        });
        return body;
    }

    function handleConfirmEdit(id,event) {
        event.stopPropagation();               
        if (onupdate === undefined || onupdate === null){
            resetEditOperation(id); 
            last_id = NONE_OPERATION;      
            return
        } 
        const body = getUpdates(id);
        rows_data[id] = body; 
        onupdate({ id, row: body }),   
        resetEditOperation(id);
        calculateWidth();
    }

    function handleOperation(id,event) {
        event.stopPropagation();
        cancelEditingValue(id);
        last_id = id;
        options_flag[id]=false;
        options_edit_flag[id]=false;
        options_operation_flag[id]=true;
    }

    function handleCancelOperation(id,event) {
        event.stopPropagation();
        resetEditOperation(id);
        last_id = NONE_OPERATION;
    }

    function handleConfirmOperation(id,event) {
        event.stopPropagation(); 
        if (onoperation === undefined || onoperation === null) {
            resetEditOperation(id);
            last_id = NONE_OPERATION;       
            return
        } 
        onoperation({ id, row: rows_data[id] }), 
        resetEditOperation(id);
        rowbdcolor.fill("");
        last_id = NONE_OPERATION;
    }

    function handleCell(id, cell,event) {
        event.stopPropagation();
        cancelEditingValue(id);
        const body = { ...rows_data[id] };
        if (onclickCell !== undefined)        
            onclickCell({ id, row: body, key: Object.keys(columnByKey)[cell] })
        if (clickborder) {
            rowbdcolor.fill("");
            rowbdcolor[id] = rowstyle.click;
        }
    }

    function cancelEditingValue(id) {
        if (last_id !== id && last_id !== NONE_OPERATION) {
            handleCancelEdit(last_id);
        }
    }

    function handleSort(key) {
        if (rows_data.length === 0) return;
        if (!sortableFlag) return;
        resetEditOperation(last_id);
        last_id = NONE_OPERATION;
        rows_data = goSort(key, sortStore, rows_data);
        sortkey = key;
        sortOrder = sortStore[key] === 'ASC' ? 1 : -1;
        rowbdcolor.fill("");       
    }


    function startResize(id) {
        fieldFlag = false;
        columnsResize[id] = !autowidthFlag;
    }

    function handleResize(id,event) {
        let elem = event.target;
        if (columnsResize[id]) {
            columnsWidth[id] = `${elem.offsetWidth}px`;
        }
    }

    function stopResize(id) {
        columnsResize[id] = false;
    }

    function goSort(column, storesort, arr, order) {
        storesort[column] = (order !== undefined) ? order
            : (storesort[column] === undefined || storesort[column] === 'DESC') ? 'ASC' : 'DESC';

        const tableSort = (a, b) => {
            const comparison = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
            return storesort[column] === 'DESC' ? -comparison : comparison;
        };
        return arr.sort(tableSort);
    }
          
    let columnByKey = $derived.by(()=>{                
        let columnKey={}  
        untrack(()=> editedFlag = false);                 
        table_config.columns_setting.forEach(data => {
                columnKey[data.key] = data; 
                untrack(()=>{
                    if (data.edit) editedFlag = true; 
                })                            
            });                         
        return columnKey
    })    

    let rowbkcolor=$derived.by(() => {
        let kcolor=Array(selectedrow.length).fill("")
        if (selectedrow.length !== 0) {               
                selectedrow.forEach(item => {
                    kcolor[item] = rowstyle.selected;
                    untrack(()=>rowbdcolor[item] = "");
                });
        }             
        return kcolor;
    }); 
           

    $effect.pre(() => {                                                      
            autowidthFlag = table_config.autowidth !== undefined ? table_config.autowidth : true;            
            sortableFlag = table_config.sortable !== undefined ? table_config.sortable : true;            
            operationFlag = table_config.operation !== undefined ? table_config.operation : false;

            if (table_config.icons) {
                if (table_config.icons.edit) icons.edit = table_config.icons.edit;
                if (table_config.icons.operation) icons.operation = table_config.icons.operation;
                if (table_config.icons.confirm) icons.confirm = table_config.icons.confirm;
                if (table_config.icons.cancel) icons.cancel = table_config.icons.cancel;
            }

            if (table_config.iconstip) {
                if (table_config.iconstip.edit) iconstip.edit = table_config.iconstip.edit;
                if (table_config.iconstip.confirm) iconstip.confirm = table_config.iconstip.confirm;
                if (table_config.iconstip.cancel) iconstip.cancel = table_config.iconstip.cancel;
                if (table_config.iconstip.operation) iconstip.operation = table_config.iconstip.operation;
            }

            if (table_config.style) {
                if (table_config.style.alternateRow) rowstyle.alternate=table_config.style.alternateRow;
                if (table_config.style.hoverRow) rowstyle.hover=table_config.style.hoverRow;
                if (table_config.style.clickRow) rowstyle.click=table_config.style.clickRow;
                if (table_config.style.selectedRow) rowstyle.selected=table_config.style.selectedRow;

            }   
                 
            untrack(()=>{  
                if (columnsWidth.length===0) {
                    if (editedFlag) {
                        columnsWidth = Array(table_config.columns_setting.length + 1).fill("100%");
                    }else
                        columnsWidth = Array(table_config.columns_setting.length).fill("100%");
                }                                   
                if (rows_data.length!==0){                   
                    if (autowidthFlag) {
                        overflow = "--overflow:visible";                        
                        resize_position = "none";                       
                        calculateWidth();
                    } else {
                        overflow = "--overflow:hidden";
                        resize_position = "horizontal";
                    }
                }
            })    
    });


    $effect.pre(() => {                                      
        if (rows_data.length !== 0) {                                               
            untrack(()=>{                         
                sortOrder = null;                                   
                showCell.splice(0,showCell.length);
                if (editedFlag || operationFlag) {
                    options_flag.splice(0, options_flag.length);
                    options_edit_flag.splice(0, options_edit_flag.length);
                    options_operation_flag.splice(0, options_operation_flag.length);
                }
            
                edit_id={};
                rows_data.forEach((data,i) => {
                    showCell[i]=[];
                    Object.keys(columnByKey).forEach((f,j) => {
                        if (!(f in data)) data[f] = null;
                        showCell[i][j]=true;
                    });
                    if (editedFlag || operationFlag)
                        options_flag[i]=true;
                });  
                    
                if (autowidthFlag){
                    overflow =  "--overflow:visible" ;                    
                    resize_position = "none";            
                    calculateWidth();
                    }else{
                    overflow = "--overflow:hidden";
                    resize_position =  "horizontal";
                    setMenualwidth();
                }
                rowbdcolor.fill("");                  
                tempwidth=tablewidth;                                            
            });        
        }
    });  
    
    $effect(()=>{         
        if(tempwidth!=tablewidth && autowidthFlag && tablewidth!==undefined) {             
            calculateWidth();                
        }
        tempwidth=tablewidth;
    })
   
</script>

<style>
    :root {
        --gray: #bfbfbf;
    }

    main {
        position: inherit;
        width: 100%;
    }

    .table {
        width: 100%;
        font-size: inherit;
        display: inline-grid;
        text-align: left;
        border-bottom: 1px solid var(--gray);
        border-radius: .3em;
    }

    .thead {
        display: inline-flex;
        padding: 0 0em;
        border-radius: inherit;
        min-height: 2em;
        text-align: left;
    }

    .tr {
        display: inline-flex;
        resize: vertical;
        border-radius: inherit;
        border-top: 1px solid #bfbfbf;
    }

    .alternated{
        background-color: var(--alternateRow);
    }

    .tr:hover {
        background-color: var(--hoverRow);
        color: black;
        border: 1px solid var(--gray);
    }

    .td {
        border: none;
        font-weight: 100;
        overflow: var(--overflow);
        text-overflow: ellipsis;
        resize: none;
        height: inherit;
    }

    .cell {
        vertical-align: middle;
        border: none;
        font-weight: normal;
        text-align: left;
    }

    .headline {
        border-radius: inherit;
        color: black;
        font-weight: bolder;
    }

    .headline-name:hover {
        font-weight: bolder;
        color: blue;
    }

    .headline-name {
        cursor: pointer;
        border-top: 1px solid transparent;
    }

    .options-field {
        width: max-content;
        opacity: 60%;
        resize: inherit;
    }

    .options {
        float: left;
        position: relative;
        cursor: pointer;
        padding-left: 2px;
    }

    .options:hover {
        text-decoration: underline;
    }

    .options:focus {
        border: none;
        outline: none;
        opacity: 100%;
    }

    textarea {
        position: relative;
        resize: horizontal;
        overflow: hidden;
        width: calc(95%);
        height: calc(70%);
        font-size: inherit;
        font-weight: normal;
        font-family: inherit;
        text-overflow: ellipsis;
        white-space: pre;
        overflow-y: scroll;
    }

    textarea:focus {
        outline: none;
        white-space: normal;
        overflow: auto;
    }
</style>

<main>
    {#if rows_data !== undefined}
        <div class="table" bind:clientWidth="{tablewidth}" >
             <div class="thead">
                {#each Object.keys(columnByKey) as key, index}
                    <div class="td headline" style="width:{columnsWidth[index]}; resize: {resize_position}; {overflow}"
                         onmousedown={()=>startResize(index)} onmousemove={(e)=>handleResize(index,e)} onmouseup={()=>stopResize(index)}>
                        <div aria-label="Sort{key}" class="headline-name" style="width: {columnsWidth[index]}" onclick={()=>handleSort(key)}>
                            {columnByKey[key].displayName}
                            {#if sortOrder !== null && sortkey === key && rows_data.length !== 0}
                                {sortOrder === 1 ? icons.asc : icons.desc}
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>

            {#each rows_data as tableRow, i (tableRow)}
                <div class="tr alternated" style="border: {rowbdcolor[i]}; background: {rowbkcolor[i]};" style:--alternateRow={i%2===0? rowstyle.alternate: null} style:--hoverRow="{rowstyle.hover}" >
                    {#each Object.keys(columnByKey) as key, j}
                        <div class="td " style:width="{columnsWidth[j]}"  onclick={(e) => handleCell(i, j,e)}>
                           {#if showCell[i][j]}
                            <div class="cell">{tableRow[key]}</div>
                           {:else}
                            <textarea bind:this="{edit_id[key + i]}" onclick={(e) => { e.stopPropagation(); }}>{tableRow[key]}</textarea>
                           {/if}
                        </div>
                        {#if (editedFlag || operationFlag) && Object.keys(columnByKey).length - 1 === j}
                            <div style:width="columnsWidth[table_configx.columns_setting.length]">
                                {#if options_flag[i]}
                                    <div class="options-field">
                                        {#if editedFlag}
                                            <div class="options" onclick={(e)=> handleEdit(i,e)} title={iconstip.edit} tabindex="0">{icons.edit}</div>
                                        {/if}
                                        {#if operationFlag}
                                            <div class="options" onclick={(e)=> handleOperation(i,e)} title="{iconstip.operation}" tabindex="0">{icons.operation}</div>
                                        {/if}
                                    </div>
                                {/if}
                                {#if options_edit_flag[i]}
                                    <div class="options-field ">
                                        <div class="options" onclick={(e)=> handleConfirmEdit(i,e)} title={iconstip.confirm} tabindex="0">{icons.confirm}</div>
                                        <div class="options" onclick={(e)=> handleCancelEdit(i,e)} title={iconstip.cancel} tabindex="0">{icons.cancel}</div>
                                    </div>
                                {/if}
                                {#if options_operation_flag[i]}
                                    <div class="options-field ">
                                        <div class="options" onclick={(e)=> handleConfirmOperation(i,e)} title={iconstip.confirm} tabindex="0">{icons.confirm}</div>
                                        <div class="options" onclick={(e)=> handleCancelOperation(i,e)} title={iconstip.cancel} tabindex="0">{icons.cancel}</div>
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</main>
