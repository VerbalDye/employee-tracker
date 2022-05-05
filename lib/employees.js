const inquirer = require('inquirer');
const db = require('../db/connection');
const { getChoices, validateChoice } = require('../utils/choicesList');

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
    return (rows);
}

async function addEmployee() {
    const [roleOptions, managerOptions] = await Promise.all([
        getChoices('role', 'title'),
        getChoices('employee', 'last_name')
    ]);
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
    const secondaryResponse = await validateChoice('role', initialResponse, 'role');
    const response = await validateChoice('employee', secondaryResponse, 'manager_id');
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const params = [response.first_name, response.last_name, response.role, response.manager_id];
    const [result, fields] = await db.promise().query(sql, params);
    return result;
}

async function updateEmployeeRole() {
    const roleOptions = await getChoices('role', 'title');
    const initialResponse = await inquirer.prompt([
        {
            type: 'number',
            name: 'employee_id',
            message: "Enter the employee's id that you want to update."
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Please select the new role for this employee.',
            choices: roleOptions
        }
    ]);
    const response = await validateChoice('role', initialResponse, 'role_id');
    const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
    const params = [response.role_id, response.employee_id];
    const [result, fields] = await db.promise().query(sql, params);
    return result;
}

async function updateEmployeeManager() {
    const managerOptions = await getChoices('employee', 'last_name');
    const initialResponse = await inquirer.prompt([
        {
            type: 'number',
            name: 'employee_id',
            message: "Enter the employee's id that you want to update."
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Please select the new manager for this employee.',
            choices: managerOptions
        }
    ]);
    const response = await validateChoice('employee', initialResponse, 'manager_id');
    const sql = `UPDATE employee SET manager_id = ? WHERE employee.id = ?`;
    const params = [response.manager_id, response.employee_id];
    const [result, fields] = await db.promise().query(sql, params);
    return result;
}

module.exports = {
    getEmployees,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager
}