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
 
connection.query("SELECT * FROM products", function (err, res) {
  if (err) throw err;
  res.map(elem => {
      console.log(`Product: ${elem.product_name}`);
      console.log(`Price: $${elem.price}`);
      console.log(`Department: ${elem.department_name}`);
      console.log(`ID: ${elem.item_id}\n`);
  })
});
 
connection.end();