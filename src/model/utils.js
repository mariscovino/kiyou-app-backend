import pool from './db.js'

export async function getUsers() {
    const ret = await pool.query("SELECT * FROM users");

    return ret[0];
}

// Send query
export async function sendQuery(options, parameters) {
    const [ret] = await pool.query(options, parameters)

    return ret;
}
