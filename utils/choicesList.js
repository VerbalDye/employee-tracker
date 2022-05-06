// get the db connection
const db = require('../db/connection');

// an asynce function to get all the entries in a table and returns selected column values as an array
async function getChoices(table, column) {

    // use direct query construnction rather then param because param cannot be used to specify table
    // this is less secure but I believe it is fine in this context because this function is internal only
    // and not exposed to user input fields; also this app is meant to be server-side back end only
    const [rows, fields] = await db.promise().query(`SELECT * FROM ` + table + ` ORDER BY id`);

    // after we get the result from sql we iterate threw each column grabbing the value for each row
    const roleOptions = [];
    rows.forEach((row, index) => {

        // appends a number to the front prevent duplication problems in validation step
        roleOptions.push(index + 1 + '. ' + row[column].toString());
    });

    // returns result
    return roleOptions;
}

// validate that results from the array made by getChoices()
async function validateChoice(table, response, responseAttribute) {

    // same slight insecurity as getChoice() reasoing for this is above
    const [rows, fields] = await db.promise().query(`SELECT * FROM ` + table + ` ORDER BY id`);

    // extract the integer we put in the front of the choice in getChoices() and overwrite the attribute we got it from
    response[responseAttribute] = rows[parseInt(response[responseAttribute].toString().split('.')[0]) - 1].id
    return response;
}

// exports out utilited functions to be used by the main processes
module.exports = {
    getChoices,
    validateChoice
}