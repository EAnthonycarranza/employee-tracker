employeeDB;

-- Department
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Legal');
INSERT INTO department (name) VALUES ('Finance');

-- Role
INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 60000, 1); 
INSERT INTO role (title, salary, department_id) VALUES ('Salesperson', 40000, 1); 
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 70000, 2); 
INSERT INTO role (title, salary, department_id) VALUES ('Lead Engineer', 80000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Lawyer', 70000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Legal Team Lead', 90000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 90000, 4); 
INSERT INTO role (title, salary, department_id) VALUES ('Account Manager', 110000, 4);

-- Employee
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 3, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Mike', 'Johnson', 4, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Emily', 'Davis', 5, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Chris', 'Wilson', 8, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Kunal', 'Singh', 6, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Malia', 'Brown', 7, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Ashley', 'Chan', 2, 1);

