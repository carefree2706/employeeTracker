DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;
USE employeesDB;

CREATE TABLE department
(id INT PRIMARY KEY AUTO_INCREMENT,
department_name VARCHAR(30)
);

CREATE TABLE roles
(id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL(10,2),
department_id INT
);

CREATE TABLE employee
(id INT PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT
);



INSERT INTO department (department_name) VALUES
("Trainer"), 
("Assistant Trainer"), 
("Trainee");

INSERT INTO roles (title, salary, department_id) VALUES
("Trainer", 50000.00, 1), 
("Assistant Trainer", 35000.00, 2),
 ("Trainee", 10000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("Metal", "Gear", 1, NULL),
("Snake", "Liquid", 2, 1),
("Praying", "Mantis", 1, 1),
("Punch", "Man", 1, 2),
("Saitama", "Sake", 2, 2),
("Snoopy", "Sniper", 1, 2),
("Sonic", "Ninja", 2, 2),
("The", "Hulk", 1, 2),
("Black ", "Widow", 3, 3),
("Iron", "Man", 1, 3);


SELECT * FROM roles, employee, department


SELECT id, title , first_name, salary
FROM roles
LEFT JOIN employee ON roles.role_id = roles.id;
