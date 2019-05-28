var mysql = require("mysql");
var inquirer = require("inquirer");
var colors   = require("colors");

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
        if (DebugON) console.log ("In SupervisorMenu()".cyan);

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
                  console.log ("\nExiting Supervisor View Application\n".yellow);
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
    if (DebugON) console.log("\nIn CreateNewDepartment()\n".cyan);
    
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
        
        if (DebugON) console.log ("inserting new department".cyan, newDepartment);

        var query = "INSERT INTO departments SET ?";

        connection.query(query, newDepartment, function(err, res) {
            if (err) {
                console.error("*** In CreateNewDepartment() query error: " + query + " " + err.stack + " ***".red);
                return;
            }  // if 
    
            console.log("New department inserted successfully!\n".green);
                 
            SupervisorMenu();
 
      });  // connection.query()
      
    });  // inquire.prompt()
}  // CreateNewDepartment()

//**************************************************************************/
// function DisplayDepartmentSales()  
// Displays, in table form, the products available for purchase
//**************************************************************************/
function DisplayDepartmentSales() {
    
    var query = "SELECT * FROM departments";

    var query = "Select department_id AS department_id, department_name AS department_name, " +
    "overhead_costs AS overhead_costs, product_sales AS product_sales, " +
    "(product_sales - overhead_costs) AS total_profit FROM departments";

    var query = "SELECT B.department_id, A.department_name, B.overhead_costs, sum(A.product_sales) as Total_Sales_By_Dept,"
    query += "sum(A.product_sales) - B.overhead_costs AS Profit FROM products A, departments B ";
    query += "WHERE A.department_name = B.department_name GROUP BY department_name ORDER BY department_id ";

    var query = "SELECT d.department_id, d.department_name, d.overhead_costs, ";
        query += "COALESCE(SUM(p.product_sales), 0) AS product_sales, ";
        query += "COALESCE(SUM(p.product_sales), 0) - overhead_costs AS total_profit ";
        query += "FROM departments AS d LEFT JOIN products AS p ON d.department_name = p.department_name ";
        query += "GROUP BY d.department_name ORDER BY d.department_id";

    connection.query(query, function(err, result) {
        if (err) {
            console.error("*** DisplayDepartmentSales() query error \n" + query + "\n" + err.stack);
            return;
        }  // if 
    
        // Display the departments 
        console.table (result);

        // call the SupervisorMenu function prompt the user action
        SupervisorMenu();   

    }); // connect.query()

}  // function DisplayDepartmentSales()

