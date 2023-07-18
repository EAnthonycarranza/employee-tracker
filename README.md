# SQL Employee Tracker

This command-line application allows you to manage a company's employee database. It is built using Node.js, Inquirer, and MySQL.

![Demo](assets/employee-tracker_pic.png)


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [Functionality](#functionality)
- [Walkthrough Video](#walkthrough-video)
- [License](#license)

## Installation

1. Clone the repository:

git clone https://github.com/EAnthonycarranza/employee-tracker.git

2. Install the required dependencies:

cd employee-tracker

npm install

npm install inquirer

3. Set up the database:

- Make sure you have MySQL installed on your machine.
- Open a MySQL client and execute the SQL statements in the `schema.sql` file to create the required database and tables.
- Optionally, you can populate the database with sample data by executing the statements in the `seeds.sql` file.

4. Configure the database connection:

- Open the `index.js` file.
- Locate the following lines of code:

  ```javascript
  const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'NEWUSER',
    password: 'Eac123456',
    database: 'employeeDB',
  });
  ```

- Update the `user` and `password` fields with your MySQL credentials.

5. Start the application:

node index.js


## Usage

Follow the prompts in the command line to interact with the application. Use the arrow keys to navigate and select options.

## Technologies Used

The application is built using the following technologies:

- [Node.js](https://nodejs.org/): A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Inquirer](https://www.npmjs.com/package/inquirer): A command-line interface for collecting user input.
- [MySQL](https://www.mysql.com/): An open-source relational database management system.
- [MySQL2](https://www.npmjs.com/package/mysql2): A MySQL client for Node.js that supports Promises and async/await.

## Database Schema

The application uses the following database schema:

- `department` table:
- `id`: INT PRIMARY KEY
- `name`: VARCHAR(30)

- `role` table:
- `id`: INT PRIMARY KEY
- `title`: VARCHAR(30)
- `salary`: DECIMAL
- `department_id`: INT (foreign key referencing `department.id`)

- `employee` table:
- `id`: INT PRIMARY KEY
- `first_name`: VARCHAR(30)
- `last_name`: VARCHAR(30)
- `role_id`: INT (foreign key referencing `role.id`)
- `manager_id`: INT (foreign key referencing `employee.id` or null)

## Functionality

The application provides the following functionality:

- View all departments: Displays a formatted table showing department names and IDs.
- View all roles: Displays a formatted table showing job titles, role IDs, departments, and salaries.
- View all employees: Displays a formatted table showing employee data, including IDs, names, job titles, departments, salaries, and managers.
- Add a department: Prompts you to enter the name of the department and adds it to the database.
- Add a role: Prompts you to enter the title, salary, and department for the role and adds it to the database.
- Add an employee: Prompts you to enter the employee's first name, last name, role, and manager, and adds the employee to the database.
- Update an employee role: Prompts you to select an employee to update and their new role, and updates the information in the database.
- View department budget: Calculates and displays the total budget of a department (the combined salaries of all employees in that department).

## Walkthrough Video

A video demonstration of the application's functionality can be found at the following link:

[Link to Video](insert_youtube_video_link_here)

## License

[MIT License](LICENSE)



