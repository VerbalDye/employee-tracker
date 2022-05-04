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
                console.table(result);
            });
        });
}

function updateEmployee() {
    inquirer.prompt([
        {
            type: 'number',
            name: 'employee_id',
            message: "Enter the employee's id that you want to update."
        },
        {
            type: 'number',
            name: 'role_id',
            message: 'Please enter the new role id for this employee.'
        }
    ])
        .then((response) => {
            const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
            const params = [response.employee_id, response.role_id];

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
    });