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

// adds a new department by prompting for that name and querying the db
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

// deletes that department 
async function deleteDepartment() {

    // gets a list of all departments
    const departmentOptions = await getChoices('department', 'name');

    // asks the user for a choice
    const initialResponse = await inquirer.prompt({
        type:'list',
        name:'department',
        message: "Please choose the department you'd like to delete",
        choices: departmentOptions
    });

    // validates the response into an id
    const response = await validateChoice('department', initialResponse, 'department');
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [response.department];

    // deletes the department
    const [rows, fields] = await db.promise().query(sql, params);
    return rows;
}

// function to get the combined cost of all employees in each department
async function getDepartmentBudgets() {

    // groups result of the query by departments and sums that salary for each employee in the process
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

    // gets our result
    const [rows, fields] = await db.promise().query(sql);
    return rows;
}

// export functions
module.exports = {
    getDepartments,
    addDepartment,
    deleteDepartment,
    getDepartmentBudgets
}