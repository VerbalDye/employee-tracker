const db = require('../db/connection');

async function getChoices(table, column) {
    const [rows, fields] = await db.promise().query(`SELECT * FROM ` + table + ` ORDER BY ID`);
    const roleOptions = [];
    rows.forEach((row, index) => {
        roleOptions.push(index + 1 + '. ' + row[column].toString());
    });
    return roleOptions;
}

async function validateChoice(table, response, responseAttribute) {
    const [rows, fields] = await db.promise().query(`SELECT * FROM ` + table + ` ORDER BY ID`);
    rows.forEach((row, index) => {
        if (index === parseInt(response[responseAttribute].toString().split('.')[0]) - 1) {
            response[responseAttribute] = row.id;
        }
    });
    return response;
}

module.exports = {
    getChoices,
    validateChoice
}