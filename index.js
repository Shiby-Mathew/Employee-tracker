const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");

//TODO Change password in .env file
// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
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
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
        ],
      },
    ])
    .then((data) => {
      const { choices } = data;

      if (choices === "View All Departments") {
        showDepartment();
      }

      if (choices === "View All Roles") {
        showRoles();
      }
      if (choices === "View All Employees") {
        showAllEmployees();
      }
      if (choices === "Add Department") {
        addDepartment();
      }
      if (choices === "Add Role") {
        console.log("inside choices");
        addRole();
      }
      if (choices === "Add Employee") {
        console.log("inside choices");
        addEmployee();
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
    "SELECT role.id,role.title,department.dep_name AS department,role.salary FROM role LEFT JOIN department ON department.id = role.department_id ORDER BY role.id ";
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
  const sql =
    "SELECT employee.id,employee.first_name,employee.last_name,role.title,department.dep_name AS department,role.salary,manager.first_name AS manager FROM employee LEFT join role ON role.id= employee.role_id LEFT join department ON department.id = role.department_id LEFT JOIN employee AS manager ON employee.manager_id = manager.id";
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("ERRor");
      return;
    }
    console.table(rows);
    main();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "depName",
      },
    ])
    .then((res) => {
      console.log(res);
      const sql = "INSERT INTO department(dep_name) VALUES(?)";
      db.query(sql, res.depName, (err, rows) => {
        if (err) {
          console.log("ERRor");
          return;
        }
        console.log("Added " + res.depName + "to the database");
        main();
      });
    });
};

//NEED to complete
const addRole = () => {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the role?",
      name: "roleName",
    },
    {
      type: "input",
      message: "What is the salary of the role?",
      name: "salary",
    },

    //TODO how to get all department from database
    {
      type: "list",
      message: "Which department does the role belong to?",
      name: "department",
      choices: ["list"],
    },
  ]);
  main();
};

//TODO need to get values
const addEmployee = () => {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "firstName",
    },
    {
      type: "input",
      message: "What is the employee's last name?",
      name: "lastName",
    },
    //TODO need to get values
    {
      type: "list",
      message: "What is the employee's role?",
      name: "empRole",
      choices: ["list"],
    },
    {
      type: "list",
      message: "Who is the employee's manager?",
      name: "empManager",
      choices: ["list"],
    },
  ]);
  main();
};
//TODO UPDATE an empoyee's role
//DELETE an employee

main();
