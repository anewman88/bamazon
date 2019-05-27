var mysql = require("mysql");
var inquirer = require("inquirer");

var DebugON = false;

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
    
    console.log ("\n\n\n\n                                                Welcome to Bamazon\n");

});  // connection.connect()

//**************************************************************************/
// function DisplayProducts()  
// Displays, in table form, the products available for purchase
//**************************************************************************/
function DisplayProducts() {
    
    var query = "SELECT * FROM products";
    connection.query(query, function(err, result) {
        if (err) {
            console.error("*** DisplayProducts query error " + query + " " + err.stack);
            return;
        }  // if 
    
        // Display the products 
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

//    if (DebugON) console.log ("In PromptUser() - CurrentStock:", CurrentStock);
    inquirer.prompt([
        {  // prompt for product id 
            name: "ProductID",
            type:   "input",
            message: "Please enter the Item ID of the product you wish to order (or enter Q to exit): "
        },
        {  // prompt for quantity 
            name: "Quantity",
            type:   "input",
            message: "Please enter the quantity (or enter Q to exit): "
        }

    ])  // inquirer.prompt()
    .then(function(answer) {
        if (DebugON) console.log ("After Inquiry - Item num: " + answer.ProductID + " Quantity: " + answer.Quantity);

 
        // verify that a valid item ID was entered
        if (isNaN(answer.ProductID)) {  // input was not a number

            // check if q or Q was entered to exit the program
            if ((answer.ProductID === "q")  || (answer.Quantity === "Q")) {
                console.log ("\nThank you for shopping at Bamazon\n");
                connection.end();
                return;
            }   // if

            // check if Done or done was entered to complete the order 
            if ((answer.ProductID === "Done")  || (answer.Quantity === "done")) {
                console.log ("complete the order process here Thank you for shopping at Bamazon");
                connection.end();
                return;
            }   // if

            // input item id is not valid.  Prompt the user again
            console.log ("Input is not valid");
            PromptUser();
            return;

        }  // if (isNAN())
        else { // input item ID is a number

            // verify that the input quatity is valid
            if (isNaN(answer.Quantity)) { // input value is not a number; prompt the user again
               console.log ("Input Quantity is not valid");
               PromptUser();
               return;
            }

            var OrderQuantity = parseInt(answer.Quantity);
            var ProductID = parseInt(answer.ProductID);
            // verify the input number is a valid item ID
            if ((ProductID >= 1)  && (ProductID < CurrentStock.length)) {
    
                // search CurrentStock for product id 
                for (var i=0; i < CurrentStock.length; i++) {
                    if (DebugON) console.log ("CurrentStock " + CurrentStock[i].item_id + " answer.ProductID " +  parseInt(answer.ProductID));

                    if (CurrentStock[i].item_id === ProductID) {  // product is found
                        
                        // verify that there is enough of the product in stock
                        if (DebugON) console.log ("Found Item number " + CurrentStock[i].item_id);

                        // if there is enough product in stock, process the order and update database
                        if (CurrentStock[i].stock_quantity >= OrderQuantity) {
                            ProcessOrder(CurrentStock[i], OrderQuantity);
                        }  // if
                        else {  // notify user not enough product available to fill order
                            console.log ("----------------------------------------------------------------------------");
                
                            console.log ("Not enough stock to fulfill order.  Current quantity is stock is:" + CurrentStock[i].stock_quantity);
                            PromptUser();
                            return;
                        }  // else
                        break;  // break out of for loop once product is found
                    }  // if
                } // for  
            }  // if 
                
        }  // else - input is a number

    }); // inquirer.prompt

}  // function PromptUser()


//**************************************************************************/
// function ProcessOrder()  
// The purpose of this function is to process the user's order and to
// update the new quantity in the product database
//**************************************************************************/
function ProcessOrder(Item, Quantity) {

    if (DebugON) console.log ("in ProcessOrder ", Item);

    var Total = Quantity * Item.unit_price;

//    var query = "UPDATE products SET stock_quantity = stock_quantity + " + updateProduct.add_quantity + " WHERE item_id = " + updateProduct.item_id;
    var query = "UPDATE products SET stock_quantity = stock_quantity - " + Quantity + 
          ", product_sales = product_sales + " + Total + " WHERE item_id = " + Item.item_id;

    connection.query(query, function(err, res) {
        if (err) {
           console.error("*** In ProcessOrder() query error: " + query + " " + err.stack);
           return;
        }  // if 
   
        console.log ("--------------------------------------------------------------------------------");
        console.log ("  Your Bamazon Order Summary: ");
        console.log (" ");
        console.log("     Product #" + Item.item_id + ": " + Item.product_name);
        console.log("     Unit cost of $" + Item.unit_price + " with quantity of " + Quantity);
        console.log("     Your total cost is: $" + Total);
        console.log (" ");
        console.log ("  Thank you for your order");
        console.log ("--------------------------------------------------------------------------------");
        
        // display the updated product list
        DisplayProducts();
        
    });  // connection.query

}  // function ProcessOrder()

//**************************************************************************/
//**************************************************************************/
