require("dotenv").config();  // read and set any environment variables with the dotenv package

var mysql = require("mysql");
var inquirer = require("inquirer");
var color = require("colors");
var LowThreshold = "5";
var DebugON = false;

// Connect to the bamazon database 
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.MySQL_PW,
  database: "bamazon"
});

//  Connect to the database and call the start or entry into the program
connection.connect(function(err) {
    if (err) {
        console.error("*** Error connecting database: " + err.stack + " *** ".red);
        return;
    }  // if 
    
    // Prompt for Action
    ProductManagementMenu();

});  // connection.connect()

//**************************************************************************/
// function ProductManagementMenu()  
// Prompts the user for what action they want to take
//**************************************************************************/
function ProductManagementMenu() {
        if (DebugON) console.log ("In ProductManagementMenu()");
        inquirer.prompt({ 
            // prompt for action
            name: "action",
            type:   "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit Program"
            ]
        })  // inquirer.prompt()
        .then(function(answer) {

            switch (answer.action) {
                case "View Products for Sale":
                  DisplayProducts();
                  break;
          
                case "View Low Inventory":
                  ViewLowInventory();
                  break;
          
                case "Add to Inventory":
                  AddToInvetory();
                  break;
          
                case "Add New Product":
                  AddNewProduct();
                  break;

                case "Exit Program":
                  console.log ("Exiting Product Management Application");
                  connection.end();
                  return;
                  break;  
            }  // switch()

        }); // .then()
    
    }  // function ProductManagementMenu()

//**************************************************************************/
// function DisplayProducts()  
// Displays, in table form, the products available for purchase
//**************************************************************************/
function DisplayProducts() {
    
    var query = "SELECT * FROM products";
    connection.query(query, function(err, result) {
        if (err) {
            console.error("*** In DisplayProducts() query error: " + query + " " + err.stack + " *** ".red);
            return;
        }  // if 
    
        console.log ("");
        console.log ("Current Bamazon Stock");
        console.table (result);  

        ProductManagementMenu();       

    }); // connect.query()

}  // function DisplayProducts()

//**************************************************************************/
// function ViewLowInventory()  
// Displays, in table form, the products that have low inventory
//**************************************************************************/
function ViewLowInventory() {
    if (DebugON) console.log("In ViewLowInventory()");

    // query the database for current products
    var query = "SELECT * FROM products WHERE stock_quantity<"+LowThreshold;
    connection.query(query, function(err, lowStock) {
        if (err) {
            console.error("*** In ViewLowInventory() query error " + query + " " + err.stack + " *** ".red);
            return;
        }  // if 
        
        if (lowStock.length > 0) {
            console.log ("\nCurrent Low Bamazon Stock");
            console.table (lowStock);  
        }  // if
        else {
            console.log ("\nAll Stock Quantities Above " + LowThreshold + " Units");
        }  //else
    
        ProductManagementMenu();       

    }); // connect.query()
      
}  // ViewLowInventory()

//**************************************************************************/
// function AddToInventory()  
// Prompts user to update the inventory in the database
//**************************************************************************/
function AddToInvetory() {
    if (DebugON) console.log("In AddToInventory()");
    // prompt the user for product information 
    inquirer.prompt([
        {
          name: "item_id",
          type: "input",
          message: "Input Product ID: "
        },
        {
          name: "add_quantity",
          type: "input",
          message: "Input Quantity to Add to Stock Total: "
        }
      ])
      .then(function(updateProduct) {
          
          if (DebugON) console.log ("inserting new product", updateProduct);
          
          var query = "UPDATE products SET stock_quantity = stock_quantity + " + updateProduct.add_quantity
           + " WHERE item_id = " + updateProduct.item_id;
    
          connection.query(query, function(err, res) {
              if (err) {
                  console.error("*** In AddToInventory() query error: " + query + " " + err.stack + " *** ".red);
                  return;
              }  // if 
      
              console.log("Stock quantity update!\n");

              ProductManagementMenu();
        });  // connection.query()
              
      });  // inquire.prompt()
        
}  // AddToInventory()

//**************************************************************************/
// function AddNewProduct()  
// Prompts user to input new product info and then adds it to the database
//**************************************************************************/
function AddNewProduct() {
    if (DebugON) console.log("\nIn AddNewProduct()\n");
    
    // prompt the user for product information 
    inquirer.prompt([
      {
        name: "product_name",
        type: "input",
        message: "Input Product Name: "
      },
      {
        name: "department_name",
        type: "input",
        message: "Input Department Name: "
      },
      {
        name: "unit_price",
        type: "input",
        message: "Input the Price Per Unit: "
      },
      {
        name: "stock_quantity",
        type: "input",
        message: "Input the Stock Quantity: "
      }
    ])
    .then(function(newProduct) {
        
        if (DebugON) console.log ("inserting new product", newProduct);

        var query = "INSERT INTO products SET ?"
        connection.query(query, newProduct, function(err, res) {
            if (err) {
                console.error("*** In AddNewProduct() query error: " + query + " " + err.stack + " *** ".red);
                return;
            }  // if 
    
            console.log(res.affectedRows + " product inserted!\n");
            ProductManagementMenu();
      });  // connection.query()
      
    });  // inquire.prompt()
}  // AddNewProduct()


