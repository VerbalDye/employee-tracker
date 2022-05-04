const inquirer = require('inquirer');
const db = require('../db/connection');
const cTable = require('console.table');

function getRoles() {
    const sql = `SELECT role.*, department.name AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
}

function addRole() {
    const options = []
    const departments = []

    db.query('SELECT * FROM department', (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        rows.forEach(row => {
            options.push(row.name);
            departments.push(row);
        });
    });
    inquirer.prompt([
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
        .then((response) => {
            let choice
            departments.forEach(row => {
                if (row.name === response.department) {
                    choice = row.id;
                }
            });

            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [response.title, response.salary, choice];

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(result);
            });
        });
}

module.exports = {
    getRoles,
    addRole
}