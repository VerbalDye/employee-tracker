const inquirer = require('inquirer');
const db = require('../db/connection');

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

module.exports = {
    getDepartments,
    addDepartment
}