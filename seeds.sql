USE employeeDB;

INSERT INTO department (id, name) VALUES
  (1, 'Sales'),
  (2, 'Engineering'),
  (3, 'Finance'),
  (4, 'Human Resources');

INSERT INTO role (id, title, salary, department_id) VALUES
  (1, 'Salesperson', 50000, 1),
  (2, 'Engineer', 80000, 2),
  (3, 'Accountant', 60000, 3),
  (4, 'HR Specialist', 45000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
  (1, 'John', 'Doe', 1, NULL),
  (2, 'Jane', 'Smith', 2, 1),
  (3, 'Mike', 'Johnson', 3, 2),
  (4, 'Emily', 'Davis', 4, 2),
  (5, 'Chris', 'Wilson', 2, 1);