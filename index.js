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
          "Update Employee Role",
          "Quit",
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
      if (choices === "Quit") {
        // quit();
        process.exit();
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
          console.log("Error");
          return;
        }
        console.log("Added " + res.depName + "to the database");
        main();
      });
    });
};

//NEED to complete
const addRole = () => {
  const sql = "SELECT id,dep_name from department";
  db.query(sql, (err, rows) => {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role?",
          name: "roleName",
        },
        {
          type: "number",
          message: "What is the salary of the role?",
          name: "salary",
        },

        //TODO how to get all department from database
        {
          type: "list",
          message: "Which department does the role belong to?",
          name: "department",
          choices: rows.map((depName) => {
            return depName.dep_name;
          }),
        },
      ])
      .then((data) => {
        console.log(data);
        const roleArray = rows.filter((dep) => {
          console.log(dep.dep_name.trim == data.department.trim);
          return dep.dep_name == data.department;
        });
        console.log(roleArray);
        const sql =
          "INSERT INTO role(title,salary,department_id) VALUES (?,?,?)";
        db.query(
          sql,
          [data.roleName, data.salary, roleArray[0].id],
          (err, result) => {
            if (err) {
              console.log(err);
              return;
            } else {
              console.log("Added role to the database");
            }
          }
        );
      });
  });

  // main();
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

//NEED todo proper error handling
//NEED todo proper validation
//NEED todo .env(secure password)
//quit();TODO

//TODO UPDATE an empoyee's role
//DELETE an employee
//If get time async and await(try/catch)

main();
