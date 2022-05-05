const inquirer = require('inquirer');
const db = require('../db/connection');

async function getDepartments() {
    const sql = `SELECT * FROM department`;

    const [rows, fields] = await db.promise().query(sql);
    return rows;
}

async function getEmployeesByDepartment() {
    const sql = `SELECT department.name AS department_name, role.title AS role_name, employee.last_name AS employee_name
                FROM department
                RIGHT JOIN role
                ON department.id = role.department_id
                RIGHT JOIN employee
                ON role.id = employee.role_id
                GROUP BY employee.id;`
    const [rows, fields] = await db.promise().query(sql);
    return rows;
}

async function addDepartment() {
    const { name } = await inquirer.prompt({
        type: 'text',
        name: 'name',
        message: 'Please enter a department name.'
    });
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const [result, field] = await db.promise().query(sql, name);
    return (result);
}

module.exports = {
    getDepartments,
    getEmployeesByDepartment,
    addDepartment
}