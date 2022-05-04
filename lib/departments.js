const inquirer = require('inquirer');
const db = require('../db/connection');
const cTable = require('console.table');

function getDepartments() {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
}

function addDepartment() {
    inquirer.prompt({
        type: 'text',
        name: 'name',
        message: 'Please enter a department name.'
    })
        .then(({ name }) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;

            db.query(sql, name, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(result);
            });
        });
}

module.exports = {
    getDepartments,
    addDepartment
}