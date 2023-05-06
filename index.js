const inquirer = require("inquirer");
// const cTable = require("console.table");
require("console.table");
const mysql = require("mysql2");
require("dotenv").config();

//TODO Change password in .env file
// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

//DATABASE_PASSWORD='root'
//process.env.MYSQL_PASSWORD,
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
        addRole();
      }
      if (choices === "Add Employee") {
        addEmployee();
      }
      if (choices === "Update Employee Role") {
        console.log("inside choices");
        updateEmployee();
      }
      if (choices === "Quit") {
        process.exit();
      }
    });
}; //main

//Show all departments
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

//Show all Roles from the database
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

//Show all Employees
const showAllEmployees = () => {
  console.log("All Employees");
  const sql =
    "SELECT employee.id,employee.first_name,employee.last_name,role.title,department.dep_name AS department,role.salary,manager.first_name AS manager FROM employee LEFT join role ON role.id= employee.role_id LEFT join department ON department.id = role.department_id LEFT JOIN employee AS manager ON employee.manager_id = manager.id";
  //TODO CONCAT(manager.first_name," ",manager.last_name)AS manager
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("ERRor");
      return;
    }
    console.table(rows);
    main();
  });
};

//Add a new department
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
      // console.log(res);
      const sql = "INSERT INTO department(dep_name) VALUES(?)";
      db.query(sql, res.depName, (err, rows) => {
        if (err) {
          console.log("Error");
          return;
        }
        console.log("Added " + res.depName + " to the database");
        main();
      });
    });
};

// Add a new Role
const addRole = () => {
  const sql = "SELECT id,dep_name FROM department";
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
        //console.log(data);
        const roleArray = rows.filter((dep) => {
          // console.log(dep.dep_name.trim == data.department.trim);
          return dep.dep_name == data.department;
        });
        // console.log(roleArray);
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
              console.log(`Added ${data.roleName} to the database`);
              main();
            }
          }
        );
      });
  });
};

//Add a new employee to the database
const addEmployee = () => {
  inquirer
    .prompt([
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
    ])

    //List out all the roles in the database
    .then((answer) => {
      const sql = "SELECT id,title FROM role";
      db.query(sql, (err, rows) => {
        inquirer
          .prompt([
            {
              type: "list",
              message: "What is the employee's role?",
              name: "empRole",
              choices: rows.map((roleName) => {
                return roleName.title;
              }),
            },
          ])
          .then((data) => {
            //console.log(data);

            const employeeArray = rows.filter((emp) => {
              return emp.title == data.empRole;
            });
            //console.log(employeeArray);
            //employeeArray[0].id

            //List out all the employees name
            const sql = "SELECT * FROM employee";
            db.query(sql, (err, rows) => {
              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "Who is the employee's manager?",
                    name: "mgrRole",
                    choices: rows.map((empName) => {
                      return empName.first_name + " " + empName.last_name;
                      //+ "" + roleName.lastName;
                    }),
                  },
                ])
                .then((data) => {
                  // console.log(data);
                  const mgrArray = rows.filter((mgr) => {
                    return mgr.first_name + " " + mgr.last_name == data.mgrRole;
                  });
                  // console.log(mgrArray); //mgrArray[0].id
                  // console.log(mgrArray[0].id);

                  //Insert new employee values in employee table
                  const sql =
                    " INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?)";
                  db.query(
                    sql,
                    [
                      answer.firstName,
                      answer.lastName,
                      employeeArray[0].id,
                      mgrArray[0].id,
                    ],
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        return;
                      } else {
                        console.log(
                          `Added ${answer.firstName}  ${answer.lastName} to the database`
                        );
                        main();
                      }
                    }
                  );
                }); //.then after query
            }); //dbquery of select employee
          }); //result data from roles
      }); //dbquery for roles
    }); //.then for getting roles
}; //Add Employee

//UPDATE an empoyee's role
const updateEmployee = () => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, rows) => {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee's role do you want to update?",
          name: "name",
          choices: rows.map((empName) => {
            return empName.first_name + " " + empName.last_name;
          }),
        },
      ])
      .then((data) => {
        console.log(data);
        const updateEmp = rows.filter((emp) => {
          return emp.first_name + " " + emp.last_name == data.name;
        });
        console.log(updateEmp); //updateEmp[0].id
        const sql = "SELECT * FROM role";
        db.query(sql, (err, rows) => {
          inquirer
            .prompt([
              {
                type: "list",
                message:
                  "Which role do you want to assign the selected employee?",
                name: "role",
                choices: rows.map((empRole) => {
                  return empRole.title;
                }),
              },
            ])
            .then((data) => {
              console.log(data);
              const newRole = rows.filter((role) => {
                return role.title == data.role;
              });
              console.log(newRole); //newRole[0].id
              const sql = "UPDATE employee SET role_id = ? WHERE id = ?";
              db.query(sql, [newRole[0].id, updateEmp[0].id], (err, result) => {
                if (err) {
                  console.log(err);
                  return;
                } else {
                  console.log(`Updated employee's role`);
                  main();
                }
              });
            }); //.tthen
        }); //dbquery role
      }); //.then employee
  }); //dbquery Employee
}; //update Employee

//NEED todo proper error handling
//NEED todo proper validation
//NEED todo .env(secure password)
//quit();TODO

//DELETE an employee
//If get time async and await(try/catch)

main();
