"use strict";
require("dotenv").config();

const mysql = require("mysql");
const inquirer = require("inquirer");
const key = require('./key');
let numLowInventoryProducts;

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : key.mysqlLocal.pw,
  database : 'bamazon_db'
});
 
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
});

function mainMenu () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt(
            {
                type: "list",
                message: "Please choose an action:",
                choices: ["View All Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"],
                name: "nextAction"
            }
        ).then(results => {
            switch (results.nextAction) {
                case "View All Products for Sale":
                    listProducts(res);
                    break;
                case "View Low Inventory":
                    listLowInventoryProducts(res);
                    break;
                case "Add to Inventory":
                    addInventory(res);
                    break;
                case "Add New Product":
                    addNewProduct(res);
                    // console.log("Thanks for adding a new product.");
                    // mainMenu();
                    break;
                case "End Session":
                    console.log("Have a nice day! Bye.");
                    connection.end();
                    break;
                default:
                    console.log("There was an error with your choice. Please try again.");
                    mainMenu();
                    break;
            }
        }).catch(err => {
            if (err) throw err;
        })
    });
}


function listProducts(dbProductArray) {
    console.log("\nAll available products:\n")
    dbProductArray.map(elem => {
        console.log(`Product: ${elem.product_name}`);
        console.log(`Price: $${elem.price}`);
        console.log(`Stock Quantity: ${elem.stock_quantity}`);
        console.log(`ID: ${elem.item_id}\n`);
    })
    mainMenu();
}

function listLowInventoryProducts(dbProductArray) {
    console.log("\nAll low inventory products:\n")
    numLowInventoryProducts = 0;
    dbProductArray.map(elem => {
        if (elem.stock_quantity <= 5) {
            numLowInventoryProducts++;
            console.log(`Product: ${elem.product_name}`);
            console.log(`Price: $${elem.price}`);
            console.log(`Stock Quantity: ${elem.stock_quantity}`);
            console.log(`ID: ${elem.item_id}\n`);
        }
    })
    if (numLowInventoryProducts === 0) {
        console.log("No items with stock inventory below 5 units.\n")
    }
    mainMenu();
}


function addInventory(dbProductArray) {
    inquirer.prompt([
        {
            type: "type",
            message: "What product would you like to add inventory to? Give the pruduct ID number: ",
            name: "productID"
        },
        {
            type: "type",
            message: "How much inventory would you like to add?",
            name: "inventoryIncrease"
        }
    ]).then(results => {
        if (!isNaN(results.productID) && !isNaN(results.inventoryIncrease) && results.productID > 0 && results.productID <= dbProductArray.length) {
            connection.query(
                `UPDATE products SET stock_quantity = stock_quantity + ${results.inventoryIncrease} WHERE item_id = ${results.productID} and stock_quantity >= 0`,
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " got updated!");
                }
            )
            mainMenu();
        } else {
            console.log("Please try again with a viable product ID number and quantity.");
            addInventory(dbProductArray);
        }
    })
    .catch(err => {
        if (err) throw err;
    })    
}


function addNewProduct(dbProductArray) {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product?",
            name: "productName"
        },
        {
            type: "input",
            message: "What department does this product belong?",
            name: "productDepartment"
        },
        {
            type: "input",
            message: "How much stock inventory is there for this product?",
            name: "productInventory"
        },
        {
            type: "input",
            message: "What is the price (in dollars) for this product?",
            name: "productPrice"
        },
    ]).then(results => {
        if (!isNaN(results.productInventory) && !isNaN(results.productPrice) && results.productName && results.productDepartment) {
            connection.query(
                `INSERT INTO products SET ?`, 
                {
                    product_name: results.productName,
                    department_name: results.productDepartment,
                    price: results.productPrice,
                    stock_quantity: results.productInventory
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(`${results.productName} inventory was updated.`);
                }
            )
            mainMenu();
        } else {
            console.log("Please try again with valid product details.");
            addNewProduct(dbProductArray);
        }
    })
    .catch(err => {
        if (err) throw err;
    })    
}



mainMenu();