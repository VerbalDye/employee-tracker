// gets the required packages
const inquirer = require('inquirer');
const db = require('../db/connection');
const { getChoices, validateChoice } = require('../utils/choicesList');

// get all employees and correlates both other table to get a complete picture of the data 
async function getEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name,
                CONCAT(m.first_name, ' ', m.last_name) AS manager_name,
                role.title AS role_name, department.name as department_name
                FROM employee
                LEFT JOIN role
                ON employee.role_id = role.id
                LEFT JOIN department
                ON role.department_id = department.id
                LEFT JOIN employee m ON m.id = employee.manager_id;`;

    const [rows, fields] = await db.promise().query(sql);
    return rows;
}

// get employee by their manager id
async function getEmployeesByManager() {
    const sql = `SELECT CONCAT(m.first_name, ' ', m.last_name) AS 'manager_name',
                CONCAT(e.first_name, ' ', e.last_name) AS 'employee_name' 
                FROM employee e
                INNER JOIN employee m ON m.id = e.manager_id;`;
    const [rows, fields] = await db.promise().query(sql);
    return rows;
}

async function getEmployeesByDepartment() {

    // get all choices for department
    const departmentOptions = await getChoices('department', 'name');

    // prompts the user which they'd like to see
    const initialResponse = await inquirer.prompt({
        type:'list',
        name:'department',
        message: "Please choose the department you'd like to list",
        choices: departmentOptions
    });

    // validates thier choice into an id
    const response = await validateChoice('department', initialResponse, 'department');
    const sql = `SELECT department.name AS department_name, role.title AS role_name, employee.first_name, employee.last_name
                FROM department
                RIGHT JOIN role
                ON department.id = role.department_id
                RIGHT JOIN employee
                ON role.id = employee.role_id
                WHERE department.id = 2;`
    const params = [response.department]

    // returns only the employees from that department
    const [rows, fields] = await db.promise().query(sql, params);
    return rows;
}

// adds a new employee
async function addEmployee() {
    
    // gets both sets of options using a parallel async function
    const [roleOptions, managerOptions] = await Promise.all([
        getChoices('role', 'title'),
        getChoices('employee', 'last_name')
    ]);

    // get the users choices for the new user
    const initialResponse = await inquirer.prompt([
        {
            type: 'text',
            name: 'first_name',
            message: "Enter the employee's first name."
        },
        {
            type: 'text',
            name: 'last_name',
            message: "Enter the employee's last name."
        },
        {
            type: 'list',
            name: 'role',
            message: 'Please select a role id for this employee.',
            choices: roleOptions
        },
        {
            type: 'list',
            name: 'manager_id',
            message: "Please enter a manager's id for this employee",
            choices: managerOptions
        }
    ]);

    // validates the users choices into id where applicable
    const secondaryResponse = await validateChoice('role', initialResponse, 'role');
    const response = await validateChoice('employee', secondaryResponse, 'manager_id');

    // queries the db to add out new employee
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const params = [response.first_name, response.last_name, response.role, response.manager_id];
    const [result, fields] = await db.promise().query(sql, params);

    // returns the result
    return result;
}

// delete and existing employee
async function deleteEmployee() {

    // gets an array of all employees
    const employeeOptions = await getChoices('employee', 'last_name');

    // asks the user to select one
    const initialResponse = await inquirer.prompt({
        type:'list',
        name:'employee',
        message: "Please choose the employee you'd like to delete",
        choices: employeeOptions
    });

    // validates thier choice into an id
    const response = await validateChoice('employee', initialResponse, 'employee');
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [response.employee]

    // deletes our entry
    const [rows, fields] = await db.promise().query(sql, params);
    return rows;
}

// updates an existing employee
async function updateEmployeeRole() {

    // gets the possible users and their roles as arrays
    const [roleOptions, employeeOptions] = await Promise.all([
        getChoices('role', 'title'),
        getChoices('employee', 'last_name')
    ]);

    // askes the user to select both
    const initialResponse = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: "Select the employee's name that you want to update.",
            choices: employeeOptions
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Please select the new role for this employee.',
            choices: roleOptions
        }
    ]);

    // validate user choice into an id
    const secondaryResponse = await validateChoice('role', initialResponse, 'role_id');
    const response = await validateChoice('employee', secondaryResponse, 'employee_id');

    // update the employee in sql
    const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
    const params = [response.role_id, response.employee_id];
    const [result, fields] = await db.promise().query(sql, params);
    return result;
}

async function updateEmployeeManager() {

    // gets a list of all employees as an array
    const employeeOptions = await getChoices('employee', 'last_name');

    // prompt the user for their choice in managers and employees
    const initialResponse = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: "Select the employee's name that you want to update.",
            choices: employeeOptions
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Please select the new manager for this employee.',
            choices: employeeOptions
        }
    ]);

    // validates the users responses into id's
    const secondaryResponse = await validateChoice('employee', initialResponse, 'manager_id');
    const response = await validateChoice('employee', secondaryResponse, 'employee_id');

    // updates our sql server to reflect the leadership change
    const sql = `UPDATE employee SET manager_id = ? WHERE employee.id = ?`;
    const params = [response.manager_id, response.employee_id];
    const [result, fields] = await db.promise().query(sql, params);
    return result;
}

// exports all our functions
module.exports = {
    getEmployees,
    addEmployee,
    deleteEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    getEmployeesByManager,
    getEmployeesByDepartment
}