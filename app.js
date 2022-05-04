const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

function getDepartments() {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
}

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

function getEmployees() {
    const sql = `SELECT employee.*, role.title AS role_name
                FROM employee
                LEFT JOIN role
                ON employee.role_id = role.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
}

function addDepartment() {
    inquirer.prompt({
        type: 'text',
        name: 'name',
        message: 'Please enter a department name.'
    })
        .then(({ name }) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;

            db.query(sql, name, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(result);
            });
        });
}

function addRole() {
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
            type: 'number',
            name: 'department_id',
            message: 'Please enter a department for this role.'
        }
    ])
        .then((response) => {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [response.title, response.salary, response.department_id];

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(result);
            });
        });
}

function addEmployee() {
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
            type: 'number',
            name: 'role_id',
            message: 'Please enter a role id for this employee.'
        },
        {
            type: 'number',
            name: 'manager_id',
            message: "Please enter a manager's id for this employee"
        }
    ])
        .then((response) => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            const params = [response.first_name, response.last_name, response.role_id, response.manager_id];

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(result);
            });
        });
}

inquirer.prompt({
    type: 'list',
    name: 'selection',
    message: 'What would you like to do?',
    choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
})
    .then(({ selection }) => {
        switch (selection) {
            case 'View All Departments':
                getDepartments();
                break;
            case 'View All Roles':
                getRoles();
                break;
            case 'View All Employees':
                getEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployee();
                break;
        }
    })