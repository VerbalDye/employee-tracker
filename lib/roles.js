const inquirer = require('inquirer');
const db = require('../db/connection');

function getRoles() {
    const sql = `SELECT role.*, department.name AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;

    return db.promise().query(sql)
        .then(([rows, fields]) => {
            return rows;
        });
}

function addRole() {
    const departments = []

    return db.promise().query('SELECT * FROM department')
        .then(([rows, fields]) => {
            const options = [];
            rows.forEach((row, index) => {
                options.push(index + 1 + '. ' + row.name);
                departments.push(row);
            });
            return options;
        })
        .then(options => {
            return inquirer.prompt([
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
                    choices: options
                }
            ])
        })
        .then((response) => {
            let choice
            departments.forEach((department, index) => {
                if (index === parseInt(response.department.split('.')[0]) - 1) {
                    choice = department.id;
                }
            });

            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [response.title, response.salary, choice];

            return db.promise().query(sql, params)
                .then(([result, fields]) => {
                    return result;
                });
        });
}

module.exports = {
    getRoles,
    addRole
}