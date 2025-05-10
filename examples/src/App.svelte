<script>
 import {SvelteEditTable} from 'svelte5-editable-table';


 let selectedrow=$state([]);
 let myData1 = $state([]);
 let yes = $state(false);
  

 let newData = [
 { index: 1, firstname: "Sara", lastname: "Mcguire", sex: "Female", email: "tsharp@example.net", phone: "(971)643-6089x9160", birthdate: "17-08-21", title: "Editor, commissioning" },
 { index: 2, firstname: "Alisha", lastname: "Hebert", sex: "Male", email: "vincentgarrett@example.net", phone: "+1-114-355-1841x78347", birthdate: "28-06-69", title: "Broadcast engineer" },
 { index: 3, firstname: "Gwendolyn", lastname: "Sheppard", sex: "Male", email: "mercadojonathan@example.com", phone: "9017807728", birthdate: "25-09-15", title: "Industrial buyer" },
 { index: 4, firstname: "Kristine", lastname: "Mccann", sex: "Female", email: "lindsay55@example.com", phone: "+1-607-333-9911x59088", birthdate: "27-07-78", title: "Multimedia specialist" },
 { index: 5, firstname: "Bobby", lastname: "Pittman", sex: "Female", email: "blevinsmorgan@example.com", phone: "3739847538", birthdate: "17-11-89", title: "Planning and development surveyor" },
 { index: 6, firstname: "Calvin", lastname: "Ramsey", sex: "Female", email: "loretta85@example.com", phone: "001-314-829-5014x1792", birthdate: "31-08-17", title: "Therapeutic radiographer" },
 { index: 7, firstname: "Collin", lastname: "Allison", sex: "Male", email: "yvaughn@example.net", phone: "(314)591-7413", birthdate: "21-11-79", title: "Administrator" },
 { index: 8, firstname: "Nicholas", lastname: "Branch", sex: "Male", email: "greerjimmy@example.net", phone: "-7199", birthdate: "21-01-06", title: "Fisheries officer" },
 { index: 9, firstname: "Emma", lastname: "Robinson", sex: "Female", email: "charleshiggins@example.org", phone: "166-234-6882x7457", birthdate: "19-03-09", title: "Haematologist" },
 { index: 10, firstname: "Pedro", lastname: "Cordova", sex: "Male", email: "leslie08@example.com", phone: "(389)824-3204x8287", birthdate: "17-06-08", title: "Phytotherapist" },
 { index: 11, firstname: "Jean", lastname: "Aguilar", sex: "Male", email: "raymond24@example.org", phone: "(285)029-1604x5466", birthdate: "28-10-78", title: "Engineer, control and instrumentation" },
 { index: 12, firstname: "Dwayne", lastname: "Hutchinson", sex: "Female", email: "preston28@example.net", phone: "(233)811-1749x417", birthdate: "22-06-14", title: "Teacher, early years/pre" },
 { index: 13, firstname: "Bradley", lastname: "Velazquez", sex: "Male", email: "joycejay@example.net", phone: "(831)049-2030", birthdate: "23-12-06", title: "Airline pilot" },
 { index: 14, firstname: "Samantha", lastname: "Moon", sex: "Male", email: "wesleymullins@example.net", phone: "7788378816", birthdate: "21-06-78", title: "Intelligence analyst" }
 ];

 
// define column configures
let columns = [            
        {key: 'index', displayName:'Index'},
        {key: 'firstname', displayName: 'FirstName'},
        {key: 'lastname', displayName: 'LastName'},
        {key: 'sex', displayName: 'Sex'},       
        {key: 'phone', displayName: 'Phone'},       
        {key: 'birthdate', displayName:'BirthDate'}
        ];

// define table configuration
 let table_config = $state({  
        operation: false,                         
        columns_setting: columns,        
      });        


   
    function handleCell(event) {          
      if (yes)
        selectedrow=[...selectedrow, event.id]
      else
        selectedrow =[]        
    }


    function handleUpdate(event) {           
    }


    function handleDelete(event) {          
        myData1.splice(event.id,1)
    }

    function normaltable() {       
        selectedrow=[];
        table_config = {
          operation: false,                            
          columns_setting: columns,        
         };     
        myData1=[...newData];
    }

    function editabletable() {        
      table_config = {
        operation: false,                                   
        columns_setting :
        [                      
        {key: 'index', displayName:'Index'},
        {key: 'firstname', displayName: 'FirstName'},
        {key: 'lastname', displayName: 'LastName'},
        {key: 'sex', displayName: 'Sex'},       
        {key: 'phone', displayName: 'Phone',edit:true},       
        {key: 'birthdate', displayName:'BirthDate'}
        ]      
    }
      
      myData1=[...newData];          
    }


    function deletetable() {              
        table_config=
         {                   
          operation: true,
          icons: {   
            operation: "🗑️",
          },  
          iconstip: {    
            operation: "Delete",
          },  
          columns_setting: columns,        
         };     
         myData1=[...newData]; 
    }

</script>

<main>
  <div>
    
  <h1>Svelte5 Editable Table</h1>
  
    <fieldset class="list-group">
      <legend>Table Example</legend>     
      <SvelteEditTable 
                       onupdate={handleUpdate}
                       onoperation={handleDelete}
                       selectedrow={selectedrow}
                       onclickCell={handleCell}                       
                       table_config={table_config}
                       rows_data={myData1}/>
  </fieldset>


  <button onclick={normaltable}> Normal </button>   
  
  <button onclick={editabletable}> Edit Data </button> 
  
  <button onclick={deletetable}> Delete Data </button> 
  <label>    
    <input type="checkbox" bind:checked={yes} />
        multi-row select
  </label>
  

</main>

<style>
 label {
  font-size: 1.2em;
 }
  .list-group {
        display:flex;        
        width:100%;     
        height:300px;
        overflow:auto;
        margin-bottom: 10px;
    }
</style>
