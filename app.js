const inquirer = require('inquirer');
const { getDepartments, addDepartment } = require('./lib/departments');
const { getRoles, addRole } = require('./lib/roles');
const { getEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager } = require('./lib/employees')

function functionSelection() {
    return inquirer.prompt({
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'Update Employee Manager', 'Exit']
    })
}

function selectionLogic({ selection }) {
    switch (selection) {
        case 'View All Departments':
            return getDepartments();
        case 'View All Roles':
            return getRoles();
        case 'View All Employees':
            return getEmployees();
        case 'Add a Department':
            return addDepartment();
        case 'Add a Role':
            return addRole();
        case 'Add an Employee':
            return addEmployee();
        case 'Update Employee Role':
            return updateEmployeeRole();
        case 'Update Employee Manager':
            return updateEmployeeManager();
        case 'Exit':
            process.exit(1);
    }
}

function Main() {
    functionSelection()
        .then(selection => {
            return selectionLogic(selection);
        })
        .then(result => {
            console.table(result);
        })
        .then( () => {
            Main();
        });
}

Main();