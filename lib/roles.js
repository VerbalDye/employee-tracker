// get required packages
const inquirer = require('inquirer');
const db = require('../db/connection');
const { getChoices, validateChoice } = require('../utils/choicesList');

// returns all roles with a simple query
async function getRoles() {
    const sql = `SELECT role.*, department.name AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;

    const [rows, fields] = await db.promise().query(sql);
    return rows;
}

// adds a new role to our database
async function addRole() {

    // gets the choices for departments
    const departmentOptions = await getChoices('department', 'name');

    // get all fields to create the role
    const initialResponse = await inquirer.prompt([
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
            choices: departmentOptions
        }
    ]);

    // validates the users department choice into an id
    const response = await validateChoice('department', initialResponse, 'department');

    // performs the sql query to add the new role
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const params = [response.title, response.salary, response.department];
    const [result, fields] = await db.promise().query(sql, params);

    // returns the result
    return result;
}

// function to delete a row
async function deleteRole() {
    
    // get all roles so the user can choose
    const roleOptions = await getChoices('role', 'title');

    // prompt user
    const initialResponse = await inquirer.prompt({
        type:'list',
        name:'role',
        message: "Please choose the role you'd like to delete",
        choices: roleOptions
    });

    // validates their choice into an id
    const response = await validateChoice('role', initialResponse, 'role');
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [response.role]

    // queries the database to delete
    const [rows, fields] = await db.promise().query(sql, params);
    return rows;
}

// export our methods
module.exports = {
    getRoles,
    addRole,
    deleteRole
}