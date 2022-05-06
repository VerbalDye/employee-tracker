// gets all required packages
const inquirer = require('inquirer');
const db = require('../db/connection');
const { getChoices, validateChoice } = require('../utils/choicesList');

// simple query to get all departments
async function getDepartments() {
    const sql = `SELECT * FROM department`;

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

async function deleteDepartment() {
    const departmentOptions = await getChoices('department', 'name');
    const initialResponse = await inquirer.prompt({
        type:'list',
        name:'department',
        message: "Please choose the department you'd like to delete",
        choices: departmentOptions
    });
    const response = await validateChoice('department', initialResponse, 'department');
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [response.department];

    const [rows, fields] = await db.promise().query(sql, params);
    return rows;
}

async function getDepartmentBudgets() {
    const sql = `SELECT department.name, SUM(role.salary) AS department_spending, 
                role.salary AS example_salary, employee.last_name AS example_employee
                FROM department
                LEFT JOIN role
                ON role.department_id = department.id
                LEFT JOIN employee
                ON employee.role_id = role.id
                GROUP BY department.id
                ORDER BY department_spending DESC
    `;

    const [rows, fields] = await db.promise().query(sql);
    return rows;
}

module.exports = {
    getDepartments,
    addDepartment,
    deleteDepartment,
    getDepartmentBudgets
}