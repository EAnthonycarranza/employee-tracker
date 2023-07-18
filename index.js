// Import required modules
const inquirer = require("inquirer");
const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'NEWUSER',
  password: 'Eac123456',
  database: 'employeeDB',
});

// Function to get a database connection from the pool
const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.log('Error connecting to the database:', error);
  }
};

// Function to execute a query
const executeQuery = async (sql, values) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(sql, values);
    return rows;
  } catch (error) {
    console.log('Error executing query:', error);
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Function to get all departments from the database
const getAllDepartments = async () => {
  const sql = 'SELECT * FROM department';
  return await executeQuery(sql);
};

// Function to get all roles from the database
const getAllRoles = async () => {
  const sql = `
    SELECT role.*, department.name AS department_name
    FROM role
    JOIN department ON role.department_id = department.id
  `;
  return await executeQuery(sql);
};

// Function to get all employees from the database
const getAllEmployees = async () => {
  const sql = `
    SELECT employee.*, role.title AS role_title, department.name AS department_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `;
  return await executeQuery(sql);
};

// Function to add a department to the database
const addDepartment = async (name) => {
  const sql = 'INSERT INTO department (name) VALUES (?)';
  await executeQuery(sql, [name]);
  console.log('Department added successfully!');
};

// Function to add a role to the database
const addRole = async (title, salary, departmentId) => {
  const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  await executeQuery(sql, [title, salary, departmentId]);
  console.log('Role added successfully!');
};

// Function to add an employee to the database
const addEmployee = async (firstName, lastName, roleId, managerId) => {
  const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
  await executeQuery(sql, [firstName, lastName, roleId, managerId]);
  console.log('Employee added successfully!');
};

// Function to update an employee's role in the database
const updateEmployeeRole = async (employeeId, roleId) => {
  const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
  await executeQuery(sql, [roleId, employeeId]);
  console.log('Employee role updated successfully!');
};

// Function to calculate the total utilized budget of a department
const getDepartmentBudget = async (departmentId) => {
  const sql = `
    SELECT SUM(role.salary) AS total_budget
    FROM employee
    JOIN role ON employee.role_id = role.id
    WHERE role.department_id = ?
  `;
  const result = await executeQuery(sql, [departmentId]);
  return result[0].total_budget;
};

// Function to display the main menu and handle user selections
const mainMenu = async () => {
  try {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'View department budget',
          'Exit',
        ],
      },
    ]);

    switch (action) {
      case 'View all departments':
        const departments = await getAllDepartments();
        console.table(departments);
        break;
      case 'View all roles':
        const roles = await getAllRoles();
        const rolesTable = roles.map((role) => ({
          ID: role.id,
          Title: role.title,
          Salary: role.salary,
          Department: role.department_name,
        }));
        console.log('\nRoles:');
        console.table(rolesTable);
        break;
      case 'View all employees':
        const employees = await getAllEmployees();
        console.table(employees);
        break;
      case 'Add a department':
        const department = await inquirer.prompt([
          {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department:',
          },
        ]);
        await addDepartment(department.name);
        console.log('Department added successfully!');
        break;
      case 'Add a role':
        const role = await inquirer.prompt([
          {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:',
          },
          {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary of the role:',
          },
          {
            name: 'departmentId',
            type: 'input',
            message: 'Enter the department ID for the role:',
          },
        ]);
        await addRole(role.title, role.salary, role.departmentId);
        console.log('Role added successfully!');
        break;
      case 'Add an employee':
        const employee = await inquirer.prompt([
          {
            name: 'firstName',
            type: 'input',
            message: 'Enter the first name of the employee:',
          },
          {
            name: 'lastName',
            type: 'input',
            message: 'Enter the last name of the employee:',
          },
          {
            name: 'roleId',
            type: 'input',
            message: 'Enter the role ID for the employee:',
          },
          {
            name: 'managerId',
            type: 'input',
            message: 'Enter the manager ID for the employee (leave empty if none):',
          },
        ]);
        await addEmployee(employee.firstName, employee.lastName, employee.roleId, employee.managerId);
        console.log('Employee added successfully!');
        break;
      case 'Update an employee role':
        const employeeToUpdate = await inquirer.prompt([
          {
            name: 'employeeId',
            type: 'input',
            message: 'Enter the ID of the employee to update:',
          },
          {
            name: 'roleId',
            type: 'input',
            message: 'Enter the new role ID for the employee:',
          },
        ]);
        await updateEmployeeRole(employeeToUpdate.employeeId, employeeToUpdate.roleId);
        console.log('Employee role updated successfully!');
        break;
      case 'View department budget':
        const dept = await getAllDepartments();
        const departmentChoices = departments.map((department) => ({
          name: department.name,
          value: department.id,
        }));

        const { departmentId } = await inquirer.prompt([
          {
            name: 'departmentId',
            type: 'list',
            message: 'Select a department:',
            choices: departmentChoices,
          },
        ]);

        const budget = await getDepartmentBudget(departmentId);
        console.log(`Total budget for department: $${budget}`);
        break;
      case 'Exit':
        console.log('Exiting...');
        return;
    }

    // Call the main menu again for continuous operation
    await mainMenu();
  } catch (error) {
    console.log('Error:', error);
  }
};

// Connect to the database and start the application
(async () => {
  try {
    console.log("███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗");
    console.log("██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝");
    console.log("█████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░");
    console.log("██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░");
    console.log("███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗");
    console.log("╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝");
    console.log("");
    console.log("███╗░░░███╗░█████╗░███╗░░██╗░█████╗░░██████╗░███████╗██████╗░");
    console.log("████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝░██╔════╝██╔══██╗");
    console.log("██╔████╔██║███████║██╔██╗██║███████║██║░░██╗░█████╗░░██████╔╝");
    console.log("██║╚██╔╝██║██╔══██║██║╚████║██╔══██║██║░░╚██╗██╔══╝░░██╔══██╗");
    console.log("██║░╚═╝░██║██║░░██║██║░╚███║██║░░██║╚██████╔╝███████╗██║░░██║");
    console.log("╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚═╝░╚═════╝░╚══════╝╚═╝░░╚═╝");

    console.log("Connecting to the database...");
    await pool.query('SELECT 1');
    console.log('Connected to the database.');

    await mainMenu();
    process.exit(0);
  } catch (error) {
    console.log('Error connecting to the database:', error);
    process.exit(1);
  }
})();
