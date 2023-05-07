# Employee-tracker

## Description

```
This is a command-line application that can view, add, update, delete empoyees details in a company's database.This application is built in Node.js, Inquirer and MySQL.content management systems

```

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees,
add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names,
job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and
that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

## Acceptance Criteria

```
Node.js
Inquirer@8.2.4
MYSQL/MySQL2

```

## Walk through video

```

```

## Usage

- This application is used to manage employee/manager details
- All the informatons are stored in a database
- This is a command-line application, multiple prompts asking to user to get inputs.
- According to user's input,user can add, view, delete and update employee/manager details from database

## Resources

- Course Material
- [Console.table package](https://www.npmjs.com/package/console.table)
- [MySQL2 package](https://www.npmjs.com/package/mysql2)
