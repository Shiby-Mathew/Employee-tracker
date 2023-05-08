const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    //password: "root",
    database: "employee_db",
  },
  console.log(`Connected to the  employee_db database.`)
);

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
