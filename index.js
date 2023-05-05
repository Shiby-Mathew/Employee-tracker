//run npm init -y
//run npm i inquirer
//create a class for index.js

const inquirer = require("inquirer");

const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: "root",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

//main function
const main = () => {
  //prompt asking for user inputs
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choices",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
        ],
      },
    ])
    .then((data) => {
      console.log(data);
      const { choices } = data;

      if (choices === "View all departments") {
        console.log("inside choices");
        showDepartment();
      }

      if (choices === "View all roles") {
        console.log("inside choices");
        showRoles();
      }
      if (choices === "View all employees") {
        console.log("inside choices");
        showAllEmployees();
      }
    });
}; //main

const showDepartment = () => {
  console.log("All departments");
  const sql = "SELECT id,dep_name AS department FROM department";
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("ERRor");
      return;
    }
    console.table(rows);
    main();
  });
};
const showRoles = () => {
  console.log("All Roles");
  const sql =
    "SELECT role.id,role.title,department.dep_name AS department,role.salary FROM role JOIN department ON department.id = role.department_id ORDER BY role.id ";
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("ERRor");
      return;
    }
    console.table(rows);
    main();
  });
};
const showAllEmployees = () => {
  console.log("All Employees");
  const sql ="SELECT employee.id,employee.first_name,employee.last_name,role.title,department.dep_name AS department,role.salary,manager.first_name AS manager FROM employee LEFT join role ON role.id= employee.role_id LEFT join department ON department.id= role.department_id LEFT JOIN employee AS manager ON employee.manager_id = manager.id";
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("ERRor");
      return;
    }
    console.table(rows);
    main();
  });
};

main();
