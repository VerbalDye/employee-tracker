const inquirer = require('inquirer');
const db = require('../db/connection');

function getDepartments() {
    const sql = `SELECT * FROM department`;

    return db.promise().query(sql)
        .then(([rows, fields]) => {
        return rows;
    });
}

function addDepartment() {
    return inquirer.prompt({
        type: 'text',
        name: 'name',
        message: 'Please enter a department name.'
    })
        .then(({ name }) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;

            return db.promise().query(sql, name)
            .then(([result, field]) => {
                return (result);
            });
        });
}

module.exports = {
    getDepartments,
    addDepartment
}