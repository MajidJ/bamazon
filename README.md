# Bamazon Node App

Bamazon is a simple test app that utilizes MySQL server and databases to keep track of customer purchases and product inventory.

## Getting Started

1. Clone the GitHub project repo to your computer 
2. Navigate to the project's root directory in the bash terminal and enter 'npm install' to download all the necessary node modules listed in the package.json
3. Bamazon utalizes your local MySQL server. You will need to initialize your local MySQL server and create a database. Utilize the code supplied in the 'bamazon_db_schema.sql' and 'bamazon_db_seed.sql' files to create a database named 'bamazon_db' that contains a table named 'products'. Once setup, create a '.env' file in the root directory of the project that contains a single statement for your local server password in this format:
    * MYSQL_PW=[put-your-local-mysql-password-here]

## Running the app

The app is run by passing 1 of 2 different commands in the terminal, one for a customer view and another for a manager view. 
1. running 'node bamazonCustomer.js' returns the customer view of the application.
    * This view allows for a customer to see available items that are in stock and purchase items if there is enough stock inventory. The purchase will update the database and update the list of available products accordingly. 
    * The customer can then either continue shopping or exit the program.
2. running 'node bamazonManager.js' returns the manager view of the application.
    * This view allows for a manager to:
        1. View information about all products in the database
        2. View products that have a low stock inventory (less than 5 units)
        3. Add stock inventory to any item in the database
        4. Add a new item to the database by walking through a series of product information prompts
    * The manager will return to the main menu after each action and can either continue with another action or exit the program.

### App Demo

[![Bamazon Node Application Walkthrough](http://img.youtube.com/vi/pZxJcj1ylNc/0.jpg)](http://www.youtube.com/watch?v=pZxJcj1ylNc)


## Authors

* **Majid Jamaleldine** - [Taxlife](https://github.com/taxlife)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details