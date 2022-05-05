const inquirer = require('inquirer');
const db = require('../db/connection');

async function getRoles() {
    const sql = `SELECT role.*, department.name AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;

    const [rows, fields] = await db.promise().query(sql);
    return rows;
}

async function addRole() {
    const departments = []

    const [rows, fields] = await db.promise().query('SELECT * FROM department');
    const options_1 = [];
    rows.forEach((row, index) => {
        options_1.push(index + 1 + '. ' + row.name);
        departments.push(row);
    });
    const options_2 = options_1;
    const response = await inquirer.prompt([
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
            choices: options_2
        }
    ]);
    let choice;
    departments.forEach((department, index_1) => {
        if (index_1 === parseInt(response.department.split('.')[0]) - 1) {
            choice = department.id;
        }
    });
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const params = [response.title, response.salary, choice];
    const [result, fields_1] = await db.promise().query(sql, params);
    return result;
}

module.exports = {
    getRoles,
    addRole
}