-- 1. View all departments
-- SELECT * FROM department;

-- -- 2. View all roles
-- select role.id,role.title,department.dep_name AS department,role.salary FROM role
--  JOIN department ON department.id = role.department_id order by role.id ;

-- -- 3. View all employees

select employee.id,employee.first_name,employee.last_name,role.title,department.dep_name AS department,role.salary,manager.first_name As manager
from employee
LEFT join role On role.id= employee.role_id 
LEFT join department On department.id= role.department_id 
left join employee AS manager On employee.manager_id = manager.id
;



-- add a department
-- add a role
-- add an employee
-- update an employee role
--  use employee_db;

