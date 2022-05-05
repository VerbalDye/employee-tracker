const inquirer = require('inquirer');
const { getDepartments, addDepartment } = require('./lib/departments');
const { getRoles, addRole } = require('./lib/roles');
const { getEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager } = require('./lib/employees')

function functionSelection() {
    inquirer.prompt({
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'Update Employee Manager', 'Exit']
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
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Update Employee Manger':
                    updateEmployeeManager();
                    break;
                case 'Exit':
                    process.exit(1);
            }
        })
        .then( () => {
            functionSelection();
        });
}

functionSelection();