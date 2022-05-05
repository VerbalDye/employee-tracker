const inquirer = require('inquirer');
const db = require('../db/connection');
const { getChoices, validateChoice } = require('../utils/choicesList');

async function getEmployees() {
    const sql = `SELECT employee.*, role.title AS role_name
                FROM employee
                LEFT JOIN role
                ON employee.role_id = role.id`;

    const [rows, fields] = await db.promise().query(sql);
    return (rows);
}

async function addEmployee() {
    const roleOptions = await getChoices('role', 'title');
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
            type: 'number',
            name: 'manager_id',
            message: "Please enter a manager's id for this employee"
        }
    ]);
    const response = await validateChoice(initialResponse, 'role');
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
    const response = validateChoice('role','title', initialResponse);
    const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
    const params = [response.employee_id, choice];
    const [result, fields] = await db.promise().query(sql, params);
    return result;
}

function updateEmployeeManager() {

}

module.exports = {
    getEmployees,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager
}