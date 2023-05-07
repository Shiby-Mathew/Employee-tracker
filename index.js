const inquirer = require("inquirer");

require("console.table");
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool(
  {
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the  employee_db database.`)
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
          "Delete Employee Role",
          "View Employee By Manager",
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
        updateEmployee();
      }
      if (choices === "Delete Employee Role") {
        console.log("inside choices");
        deleteEmployee();
      }
      if (choices === "View Employee By Manager") {
        console.log("inside choices");
        managerEmp();
      }
      if (choices === "Quit") {
        process.exit();
      }
    });
}; //main

//Show all departments
const showDepartment = async () => {
  console.log("All departments");
  try {
    const sql = "SELECT id,dep_name AS department FROM department";
    const [rows, fields] = await db.promise().query(sql);
    console.table(rows);
    main();
  } catch (err) {
    console.log(err);
  }
};

//Show all Roles from the database
const showRoles = async () => {
  console.log("All Roles");
  try {
    const sql =
      "SELECT role.id,role.title,department.dep_name AS department,role.salary FROM role LEFT JOIN department ON department.id = role.department_id ORDER BY role.id ";
    const [rows, fields] = await db.promise().query(sql);
    console.table(rows);
    main();
  } catch (err) {
    console.log(err);
  }
};

//Show all Employees
const showAllEmployees = async () => {
  console.log("All Employees");

  try {
    const sql =
      'SELECT employee.id,employee.first_name,employee.last_name,role.title,department.dep_name AS department,role.salary,CONCAT(manager.first_name," ",manager.last_name) AS manager FROM employee LEFT join role ON role.id= employee.role_id LEFT join department ON department.id = role.department_id LEFT JOIN employee AS manager ON employee.manager_id = manager.id';
    //TODO CONCAT(manager.first_name," ",manager.last_name)AS manager
    const [rows, fields] = await db.promise().query(sql);
    console.table(rows);
    main();
  } catch (err) {
    console.log(err);
  }
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
const addRole = async () => {
  const sql = "SELECT id,dep_name FROM department";
  const [rows, fields] = await db.promise().query(sql);
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
      const roleArray = rows.filter((dep) => {
        return dep.dep_name == data.department;
      });

      const sql = "INSERT INTO role(title,salary,department_id) VALUES (?,?,?)";
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
  // });
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
            const employeeArray = rows.filter((emp) => {
              return emp.title == data.empRole;
            });

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
                    }),
                  },
                ])
                .then((data) => {
                  // console.log(data);
                  const mgrArray = rows.filter((mgr) => {
                    return mgr.first_name + " " + mgr.last_name == data.mgrRole;
                  });

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

//DELETE an employee from database

const deleteEmployee = () => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, rows) => {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee do you want to delete?",
          name: "name",
          choices: rows.map((empName) => {
            return empName.first_name + " " + empName.last_name;
          }),
        },
      ])
      .then((data) => {
        console.log(data);
        const deleteEmp = rows.filter((emp) => {
          return emp.first_name + " " + emp.last_name == data.name;
        });
        console.log(deleteEmp);
        const sql = "DELETE  FROM employee WHERE id = ?";
        db.query(sql, [deleteEmp[0].id], (err, result) => {
          if (err) {
            console.log(err);
            return;
          } else {
            console.log(`Deleted an employee from database`);
            main();
          }
        });
      });
  });
};

//view employee by manager

const managerEmp = async () => {
  console.log("Employee and their manager");
  try {
    const sql =
      'SELECT CONCAT(manager.first_name," ",manager.last_name) AS manager,CONCAT(employee.first_name," ",employee.last_name) AS employee FROM employee join employee AS manager ON employee.manager_id = manager.id';
    const [rows, fields] = await db.promise().query(sql);
    console.table(rows);
    main();
  } catch (err) {
    console.log(err);
  }
};

main();
