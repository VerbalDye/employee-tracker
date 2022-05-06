const inquirer = require('inquirer');
const db = require('../db/connection');
const { getChoices, validateChoice } = require('../utils/choicesList');

async function getRoles() {
    const sql = `SELECT role.*, department.name AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;

    const [rows, fields] = await db.promise().query(sql);
    return rows;
}

async function addRole() {
    const departmentOptions = await getChoices('department', 'name');
    const initialResponse = await inquirer.prompt([
        {
            type: 'text',
            name: 'title',
            message: 'Please enter a role title.'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Please enter a salary for this role.'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Please select a department for this role.',
            choices: departmentOptions
        }
    ]);
    const response = await validateChoice('department', initialResponse, 'department');
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const params = [response.title, response.salary, response.department];
    const [result, fields] = await db.promise().query(sql, params);
    return result;
}

async function deleteRole() {
    const roleOptions = await getChoices('role', 'title');
    const initialResponse = await inquirer.prompt({
        type:'list',
        name:'role',
        message: "Please choose the role you'd like to delete",
        choices: roleOptions
    });
    const response = await validateChoice('role', initialResponse, 'role');
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [response.role]

    const [rows, fields] = await db.promise().query(sql, params);
    return rows;
}

module.exports = {
    getRoles,
    addRole,
    deleteRole
}