// Import required modules
const inquirer = require("inquirer");
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Function to read the seeds.sql file
const readSeedsFile = () => {
  const filePath = path.join(__dirname, 'seeds.sql');
  return fs.readFileSync(filePath, 'utf8');
};

// Create a connection pool to handle multiple connections
const pool = mysql.createPool({
  host: 'localhost',
  user: 'NEWUSER',
  password: 'Eac123456',
  database: 'employeeDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a connection from the pool
pool.getConnection(async (error, connection) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database!');
    try {
      // Read the seeds.sql file
      const seedsSql = readSeedsFile();
      
      // Execute the SQL statements in the seeds.sql file
      await connection.query(seedsSql);
      
      console.log('Database changes applied successfully!');
    } catch (error) {
      console.error('Error applying database changes:', error);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  }
});



// Function to delete a role by ID
const deleteRoleById = async (roleId) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM role WHERE id = ?', [roleId]);
    console.log('Role deleted successfully!');
    connection.release();
  } catch (error) {
    console.error('Error deleting role:', error);
  }
};

// Function to execute a query
const executeQuery = async (sql, values) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, values);
    return rows;
  } catch (error) {
    console.log('Error executing query:', error);
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

const dbCheck = `CREATE DATABASE IF NOT EXISTS employeeDB`;

pool.query(dbCheck)
  .then(([results]) => {
    console.log('Database check/creation successful.');
  })
  .catch(error => {
    console.error('Error checking/creating database:', error);
  });

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
  const query = `
    SELECT e.id, e.first_name, e.last_name, d.name AS department_name, r.title AS role_title, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
  `;

  const rows = await executeQuery(query);
  return rows;
};

const viewAllEmployees = async () => {
  try {
    const employees = await getAllEmployees();
    if (employees && employees.length > 0) {
      console.log('\nEmployees:');
      console.table(employees);
    } else {
      console.log('No employees found.');
    }
  } catch (error) {
    console.error('Error fetching employee data:', error);
  }
};

// Function to add a department to the database
const addDepartment = async (name) => {
  const sql = 'INSERT INTO department (name) VALUES (?)';
  await executeQuery(sql, [name]);
  console.log('Department added successfully!');
};

async function viewDepartments() {
  try {
    const departments = await getAllDepartments();
    console.table(departments);
  } catch (error) {
    console.error('Error fetching department data:', error);
  }
}

// Function to add a role to the database
const addRole = async (title, salary, departmentId) => {
  const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  await executeQuery(sql, [title, salary, departmentId]);
  console.log('Role added successfully!');
};

const addEmployee = async (firstName, lastName, roleId, managerId) => {
  const hasManager = (managerId !== null);

  if (hasManager) {
    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    await executeQuery(sql, [firstName, lastName, roleId, managerId]);
  } else {
    const sql = 'INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)';
    await executeQuery(sql, [firstName, lastName, roleId]);
  }

  console.log('Employee added successfully!');
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

const deleteRecord = async () => {
  const deleteChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'deleteOption',
      message: 'What would you like to delete?',
      choices: ['Department', 'Role', 'Employee'],
    },
  ]);

  switch (deleteChoice.deleteOption) {
    case 'Department':
      await deleteDepartment();
      break;
    case 'Role':
      await deleteRole();
      break;
    case 'Employee':
      await deleteEmployee();
      break;
    default:
      console.log('Invalid choice.');
      break;
  }
};

// Function to delete a department by ID
const deleteDepartmentById = async (departmentId) => {
  const sql = 'DELETE FROM department WHERE id = ?';
  await executeQuery(sql, [departmentId]);
};

const deleteDepartment = async () => {
  // Retrieve all departments from the database
  const departments = await getAllDepartments();

  // Prompt the user to select a department to delete
  const departmentChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department to delete:',
      choices: departments.map((department) => ({
        name: department.name,
        value: department.id,
      })),
    },
  ]);

  // Delete the selected department
  await deleteDepartmentById(departmentChoice.departmentId);

  console.log('Department deleted successfully!');
};

const deleteRole = async () => {
  // Retrieve all roles from the database
  const roles = await getAllRoles();

  // Prompt the user to select a role to delete
  const roleChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role to delete:',
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
  ]);

  // Delete the selected role
  await deleteRoleById(roleChoice.roleId);

  console.log('Role deleted successfully!');
};

// Function to delete an employee by ID
const deleteEmployeeById = async (employeeId) => {
  const sql = 'DELETE FROM employee WHERE id = ?';
  await executeQuery(sql, [employeeId]);
};

const deleteEmployee = async () => {
  // Retrieve all employees from the database
  const employees = await getAllEmployees();

  // Prompt the user to select an employee to delete
  const employeeChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to delete:',
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
  ]);

  // Delete the selected employee
  await deleteEmployeeById(employeeChoice.employeeId);

  console.log('Employee deleted successfully!');
};

// Function to update an employee's role
const updateEmployeeRole = async (employeeId, roleId) => {
  const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
  await executeQuery(sql, [roleId, employeeId]);
  console.log('Employee role updated successfully!');
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
          'Delete',
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
        const employeesTable = employees.map((employee) => ({
          ID: employee.id,
          'First Name': employee.first_name,
          'Last Name': employee.last_name,
          Department: employee.department_name,
          Role: employee.role_title,
          'Manager Name': employee.manager_name,
        }));
        console.log('\nEmployees:');
        console.table(employeesTable);
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
        const roleDepartments = await getAllDepartments();
        const roleDepartmentChoices = roleDepartments.map((department) => ({
          name: department.name,
          value: department.id,
        }));

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
            type: 'list',
            message: 'Select the department for the role:',
            choices: roleDepartmentChoices,
          },
        ]);

        await addRole(role.title, role.salary, role.departmentId);
        console.log('Role added successfully!');
        break;
      case 'Add an employee':
        // Fetch roles and employees (potential managers) before the prompt
        const allRoles = await getAllRoles();
        const allEmployees = await getAllEmployees();

        const roleChoices = allRoles.map((role) => ({
          name: role.title,
          value: role.id,
        }));

        const managerChoices = allEmployees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        const employeesToAdd = await inquirer.prompt([
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
            type: 'list',
            message: 'Select the role for the employee:',
            choices: roleChoices,
          },
          {
            name: 'hasManager',
            type: 'confirm',
            message: 'Does the employee have a manager?',
          },
          {
            name: 'managerId',
            type: 'list',
            message: 'Select the manager for the employee:',
            choices: managerChoices,
            when: (answers) => answers.hasManager,
          },
        ]);        

        const { firstName, lastName, roleId, managerId } = employeesToAdd;
        await addEmployee(firstName, lastName, roleId, managerId);
        console.log('Employee added successfully!');
        break;
      case 'Update an employee role':
        const allRolesForUpdate = await getAllRoles();
        const allEmployeesForUpdate = await getAllEmployees();

        const roleChoicesForUpdate = allRolesForUpdate.map((role) => ({
          name: role.title,
          value: role.id,
        }));

        const employeeChoicesForUpdate = allEmployeesForUpdate.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        const employeesToUpdate = await inquirer.prompt([
          {
            name: 'employeeId',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employeeChoicesForUpdate,
          },
          {
            name: 'roleId',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roleChoicesForUpdate,
          },
        ]);
        await updateEmployeeRole(employeesToUpdate.employeeId, employeesToUpdate.roleId);
        console.log('Employee role updated successfully!');
        break;
      case 'Delete':
        await deleteRecord();
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

    await mainMenu();  // Starts the application
    process.exit(0);
  } catch (error) {
    console.log('Error connecting to the database:', error);
    process.exit(1);
  }
})();
