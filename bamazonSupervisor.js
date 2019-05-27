var mysql = require("mysql");
var inquirer = require("inquirer");
var DebugON = true;

// Connect to the bamazon database 
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Mycwg4ever@CO",
  database: "bamazon"
});

//  Connect to the database and call the start or entry into the program
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }  // if 
    
    // Prompt for Action
    SupervisorMenu();

});  // connection.connect()

//**************************************************************************/
// function SupervisorMenu()  
// Prompts the user for what action they want to take
//**************************************************************************/
function SupervisorMenu() {
        if (DebugON) console.log ("In SupervisorMenu()");
        inquirer.prompt({ 
            // prompt for action
            name: "action",
            type:   "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Product Sales by Department",
                "Create New Department",
                "Exit Program"
            ]
        })  // inquirer.prompt()
        .then(function(answer) {

            switch (answer.action) {
                case "View Product Sales by Department":
                  DisplayDepartmentSales();
                  break;
          
                case "Create New Department":
                  CreateNewDepartment();
                  break;
          
                case "Exit Program":
                  console.log ("Exiting Supervisor View Application");
                  connection.end();
                  return;
                  break;  
            }  // switch()

        }); // .then()
    
    }  // function SupervisorMenu()

//**************************************************************************/
// function CreateNewDepartment()  
// Prompts user to input new department info and then adds it to the database
//**************************************************************************/
function CreateNewDepartment() {
    if (DebugON) console.log("\nIn CreateNewDepartment()\n");
    
    // prompt the user for product information 
    inquirer.prompt([
      {
        name: "department_name",
        type: "input",
        message: "Input Department Name: "
      },
      {
        name: "overhead_costs",
        type: "input",
        message: "Input the Department Overhead Cost: "
      }
    ])
    .then(function(newDepartment) {
        
        if (DebugON) console.log ("inserting new department", newDepartment);

        var query = "INSERT INTO departments SET ?"
        connection.query(query, newDepartment, function(err, res) {
            if (err) {
                console.error("*** In CreateNewDepartment() query error: " + query + " " + err.stack);
                return;
            }  // if 
    
            console.log(res.affectedRows + " department inserted!\n");
            
      });  // connection.query()
      
      SupervisorMenu();

    });  // inquire.prompt()
}  // CreateNewDepartment()

//**************************************************************************/
// function DisplayDepartmentSales()  
// Displays, in table form, the products available for purchase
//**************************************************************************/
function DisplayDepartmentSales() {
    
    var query = "SELECT * FROM departments";
    connection.query(query, function(err, result) {
        if (err) {
            console.error("*** DisplayDepartmentSales() query error " + query + " " + err.stack);
            return;
        }  // if 
    
        // Display the departments 
        console.table (result);

        // call the SupervisorMenu function prompt the user action
        SupervisorMenu();   

    }); // connect.query()

}  // function DisplayDepartmentSales()


