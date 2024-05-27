import pool from './db.js'
import bcrypt from 'bcrypt'
import UAParser from 'ua-parser-js';

// Returns where column=value in table
export async function select(attribute, table, column, value) {
    const ret = await pool.query(`
        SELECT ?
        FROM ?
        WHERE ? = ?;
    `, [attribute, table, column, value])

    return ret[0];
}

export async function getUsers() {
    const ret = await pool.query("SELECT * FROM users");

    return ret[0];
}

// Send query
export async function sendQuery(options, parameters) {
    const [ret] = await pool.query(options, parameters)

    return ret;
}
