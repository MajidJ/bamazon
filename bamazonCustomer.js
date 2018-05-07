"use strict";
require("dotenv").config();

const mysql = require("mysql");
const inquirer = require("inquirer");
const key = require('./key');



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

function startShopping () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        listProducts(res);
        purchaseQuery(res);
    });
}

function listProducts(dbProductArray) {
    console.log("\nAll available products:\n")
    dbProductArray.map(elem => {
        if (elem.stock_quantity > 0) {
          console.log(`Product: ${elem.product_name}`);
          console.log(`Price: $${elem.price}`);
          console.log(`ID: ${elem.item_id}\n`);
          // console.log(`Department: ${elem.department_name}`);
        }
    })
}

function purchaseQuery(dbProductArray) {
    inquirer.prompt(
        {
            type: "type",
            message: "What product would you like to purchase? Give the pruduct ID number: ",
            name: "productID"
        }
    ).then(results => {
        if (!isNaN(results.productID) && results.productID > 0 && results.productID <= dbProductArray.length) {
            purchaseQuantityQuery(dbProductArray[results.productID-1]);
        } else {
            console.log("Please try again with a viable ID number.");
            purchaseQuery(dbProductArray);
        }
    })
    .catch(err => {
        if (err) throw err;
    })
}

function purchaseQuantityQuery(dbProduct) {
    inquirer.prompt(
        {
            type: "type",
            message: "How many would you like to purchase?",
            name: "productQuantity"
        }
    ).then(results => {
        if (!isNaN(results.productQuantity) && results.productQuantity > 0 && results.productQuantity <= dbProduct.stock_quantity) {
            console.log(`\nSure! Here you go.\nThat will cost $${results.productQuantity * dbProduct.price}.\nThanks for shopping!\n`);
            continueShoppingQuery();
        } else if (results.productQuantity > dbProduct.stock_quantity) {
            console.log(`Sorry, we do not have that much stock. We only have ${dbProduct.stock_quantity}. Please try again.`);
            purchaseQuantityQuery(dbProduct);
        } else {
            console.log("Please try again with a viable ID number.");
            purchaseQuantityQuery(dbProduct);
        }
    })
    .catch(err => {
        if (err) throw err;
    })
}

function continueShoppingQuery() {
    inquirer.prompt(
        {
            type: "list",
            message: "Would you like to keep shopping?",
            choices: ["yes", "no"],
            name: "continueShoppingAnswer"
        }
    ).then(results => {
        switch (results.continueShoppingAnswer) {
            case "yes":
            startShopping();
            break;
            
            case "no":
            console.log("Thanks for shopping with us! Bye.");
            connection.end();
            break;

            default:
            console.log("Please try again.");
            continueShoppingQuery();
            break;
        }
    })
    .catch(err => {
        if (err) throw err;
    })
}

startShopping();
