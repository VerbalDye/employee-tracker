const inquirer = require('inquirer');
const db = require('../db/connection');

function getEmployees() {
    const sql = `SELECT employee.*, role.title AS role_name
                FROM employee
                LEFT JOIN role
                ON employee.role_id = role.id`;

    return db.promise().query(sql)
        .then(([rows, fields]) => {
        return (rows);
    });
}

function addEmployee() {
    const roleOptions = []
    const roles = []

    db.query('SELECT id, title FROM role', (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        rows.forEach(row => {
            roleOptions.push(row.title);
            roles.push(row);
        });
    });
    
    inquirer.prompt([
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
    ])
        .then((response) => {
            let choice
            roles.forEach(row => {
                if (row.title === response.role) {
                    choice = row.id;
                }
            });

            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            const params = [response.first_name, response.last_name, choice, response.manager_id];

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                return result;
            });
        });
}

function updateEmployeeRole() {
    const roleOptions = []
    const roles = []

    db.query('SELECT id, title FROM role', (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        rows.forEach(row => {
            roleOptions.push(row.title);
            roles.push(row);
        });
    });

    inquirer.prompt([
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
    ])
        .then((response) => {
            let choice
            roles.forEach(row => {
                if (row.title === response.role) {
                    choice = row.id;
                }
            });

            const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
            const params = [response.employee_id, choice];

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                return (result);
            });
        });
}

function updateEmployeeManager() {

}

module.exports = {
    getEmployees,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager
}