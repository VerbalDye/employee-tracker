const inquirer = require('inquirer');
const { getDepartments, addDepartment } = require('./lib/departments');
const { getRoles, addRole } = require('./lib/roles');
const { getEmployees, addEmployee, updateEmployee } = require('./lib/employees')

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