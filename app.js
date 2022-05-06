const inquirer = require('inquirer');
const { getDepartments, getEmployeesByDepartment, addDepartment, deleteDepartment, getDepartmentBudgets } = require('./lib/departments');
const { getRoles, addRole, deleteRole } = require('./lib/roles');
const { getEmployees, addEmployee, deleteEmployee, updateEmployeeRole, updateEmployeeManager, getEmployeesByManager } = require('./lib/employees')

function functionSelection() {
    return inquirer.prompt({
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Employees By Manager', 'View Employees By Department', 'Add a Department', 'Add a Role', 'Add an Employee', 'Delete a Department', 'Delete a Role', 'Delete an Employee', 'Update Employee Role', 'Update Employee Manager', 'Get Budget by Department', 'Exit']
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
        case 'View Employees By Manager':
            return getEmployeesByManager();
        case 'View Employees By Department':
            return getEmployeesByDepartment();
        case 'Add a Department':
            return addDepartment();
        case 'Add a Role':
            return addRole();
        case 'Add an Employee':
            return addEmployee();
        case 'Delete a Department':
            return deleteDepartment();
        case 'Delete a Role':
            return deleteRole();
        case 'Delete an Employee':
            return deleteEmployee();
        case 'Update Employee Role':
            return updateEmployeeRole();
        case 'Update Employee Manager':
            return updateEmployeeManager();
        case 'Get Budget by Department':
            return getDepartmentBudgets();
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