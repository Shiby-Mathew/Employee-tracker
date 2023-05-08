-- seeding value in 3 tables



-- INSERT INTO department(dep_name)
-- VALUES("Engineering"),
--         ("Finance"),
--         ("Legal"),
--         ("Sales")


-- INSERT INTO role(title,salary,department_id)
-- VALUES("Software Engineer",120000,1),
--         ("Sales Lead",100000,4),
--         ("Salesperson",80000,4),
--         ("Account Manager",160000,2),
--         ("Accountant",125000,2),
--         ("Legal Team Lead",250000,3),
--         ("Lawyer",190000,3),
--         ("Lead Engineer",150000,1)

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES("Josh","Miller",2,null),
        ("Tyler","Green",3,1),
        ("Ana","Brown",4,null),        
        ("May","Anderson",5,3),
        ("Louis","Jones",8,null),
        ("June","Allen",1,5),
        ("John","Mark",6,null), 
        ("Smith","Moore",7,7)

      
