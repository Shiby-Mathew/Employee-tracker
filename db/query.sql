-- 1. View all departments
-- SELECT id,dep_name AS department FROM department;

-- -- 2. View all roles
-- SELECT role.id,role.title,department.dep_name AS department,role.salary FROM role
--  JOIN department ON department.id = role.department_id ORDER BY role.id ;

-- -- 3. View all employees

-- SELECT employee.id,employee.first_name,employee.last_name,role.title,department.dep_name AS department,role.salary,manager.first_name AS manager
-- FROM employee
-- LEFT join role ON role.id= employee.role_id 
-- LEFT join department ON department.id= role.department_id 
-- left join employee AS manager ON employee.manager_id = manager.id
;

-- 4. Add a department
    INSERT INTO department(dep_name) VALUES(?);



--  enter dep_name


-- 5. add a role

-- name,salary,department for role
 INSERT INTO role(title,salary,department_id) VALUES(?,?,?);

-- add an employee
-- first name ,last name role,manager
 INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?);

-- update an employee role
-- update new role

-- employeeby manager
SELECT CONCAT(manager.first_name," ",manager.last_name) AS manager,CONCAT(employee.first_name," ",employee.last_name) AS employee
FROM employee join employee AS manager ON employee.manager_id = manager.id;


--  use employee_db;

