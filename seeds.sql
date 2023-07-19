USE employeeDB;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Delete existing data from tables (in reverse order of dependencies)
DELETE FROM employee;
DELETE FROM role;
DELETE FROM department;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert departments
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Legal');

-- Insert roles, ensuring the department_id values match existing department id values
INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 60000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Lead Engineer', 80000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Account Manager', 50000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Legal Team Lead', 70000, 4);
INSERT INTO role (title, salary, department_id) VALUES ('Salesperson', 40000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 45000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 75000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Lawyer', 65000, 4);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Mike', 'Johnson', 3, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Chris', 'Wilson', 4, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Kunal', 'Singh', 4, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Malia', 'Brown', 5, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Ashley', 'Chan', 6, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Emily', 'Lee', 7, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Michael', 'Davis', 7, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sarah', 'Taylor', 8, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jennifer', 'Clark', 8, 2);
