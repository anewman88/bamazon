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
    
    // first display (in table form) all items available for sale
    DisplayProducts();

});  // connection.connect()

//**************************************************************************/
// function DisplayProducts()  
// Displays, in table form, the products available for purchase
//**************************************************************************/
function DisplayProducts() {
    
    var query = "SELECT * FROM products";
    connection.query(query, function(err, result) {
        if (err) {
            console.error("error with query " + query + " " + err.stack);
            return;
        }  // if 
    
        console.log (" ID  |  Product  |  Dept  |  Price  |  # Avail ");
        for (var i = 0; i < result.length; i++) {
            console.log(result[i].item_id + " | " + result[i].product_name + " | "
            + result[i].department_name + " | " + result[i].unit_price + " | "
            + result[i].stock_quantity);
        }  // for 
    
        console.table (result);
        // call the PromptUser function prompt the user action
        PromptUser(result);   

    }); // connect.query()

}  // function DisplayProducts()

//**************************************************************************/
// function PromptUser()  
// Prompts the user for what action they want to take
//**************************************************************************/
function PromptUser(CurrentStock) {
    if (DebugON) console.log ("In PromptUser() - CurrentStock:", CurrentStock);
    inquirer.prompt([
        {  // prompt for product id 
            name: "ProductID",
            type:   "input",
            message: "Please enter product ID: "
        },
        {  // prompt for quantity 
            name: "Quantity",
            type:   "input",
            message: "Please enter quantity: "
        }

    ])  // inquirer.prompt()
    .then(function(answer) {
        if (DebugON) console.log ("After Inquiry - Item num: " + answer.ProductID + " Quantity: " + answer.Quantity);

        // verify that there is enough of the product in stock
        for (var i=0; i < CurrentStock.length; i++) {
            if (DebugON) console.log ("CurrentStock " + CurrentStock[i].item_id + " answer.ProductID " +  parseInt(answer.ProductID));
            if (CurrentStock[i].item_id === parseInt(answer.ProductID)) {
                if (DebugON) console.log ("Found Item number " + CurrentStock[i].item_id);
                var OrderQuantity = parseInt(answer.Quantity);
                // if there is enough product in stock, process the order and update database
                if (CurrentStock[i].stock_quantity >= OrderQuantity) {
                   ProcessOrder(CurrentStock[i].item_id, OrderQuantity, (CurrentStock[i].stock_quantity-OrderQuantity));
                }  // if
                else {  // notify user not enough product available to fill order
                   console.log ("Not enough stock to fulfill order");
                }
                break;
            }  // if
        } // for  
        
    }); // .then()

}  // function PromptUser()


//**************************************************************************/
// function ProcessOrder()  
// The purpose of this function is to process the user's order and to
// update the new quantity in the product database
//**************************************************************************/
function ProcessOrder(ItemID, OrderQuantity, NewStockQuantity) {
    if (DebugON) console.log ("in ProcessOrder ", ItemID, OrderQuantity, NewStockQuantity);
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: NewStockQuantity
          },
          {
            item_id: ItemID
          } 
        ],
        function(error) {
          if (error) throw err;
          console.log("Your Order for " + OrderQuantity + " of item number " 
                      + ItemID + "is complete");
          console.log ("Thank you for your order");

          // display the updated product list
          DisplayProducts();
        }
      );  // connection.query

}  // function ProcessOrder()

//**************************************************************************/
//**************************************************************************/
