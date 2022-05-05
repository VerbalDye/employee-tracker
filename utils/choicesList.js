const db = require('../db/connection');

async function getChoices(table, column) {
    const [rows, fields] = await db.promise().query(`SELECT * FROM ` + table + ` ORDER BY ID`);
    const roleOptions = [];
    rows.forEach((row, index) => {
        console.log(row);
        roleOptions.push(index + 1 + '. ' + row[column]);
    });
    return roleOptions;
}

async function validateChoice(table, column, response) {
    const [rows, fields] = await db.promise().query(`SELECT * FROM ` + table + ` ORDER BY ID`);
    rows.forEach((row, index) => {
        if (index === parseInt(response[column].split('.')[0]) - 1) {
            response[column] = row.id;
            return response;
        }
    });
    throw new Error;
}

module.exports = {
    getChoices,
    validateChoice
}