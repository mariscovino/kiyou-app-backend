import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { json } from 'express';

dotenv.config()
const saltRounds = 10;

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getUsers() {
    const [ret] = await pool.query("SELECT * FROM users");

    return ret[0];
}

export async function getUser(email) {
    const [ret] = await pool.query(`
        SELECT *
        FROM users
        WHERE email = ?
    `, [email]);

    return ret[0];
}

export async function userExists(email) {
    const [ret] = await pool.query(`
        SELECT *
        FROM users
        WHERE EXISTS
            (SELECT * FROM users WHERE email = ?)
    `, [email])

    return Boolean(ret.length);
}

export async function authenticate(email, password) {
    const [hash] = await pool.query(`
        SELECT password
        FROM users
        WHERE email = ?
    `, [email]);

    const match = await bcrypt.compare(password, hash[0].password);
    console.log(match);

    return match;
}

export async function signIn(email, password) {
    if (await userExists(email)) {
        if (await authenticate(email, password)) {
            console.log("Success!");
        } else {
            throw new Error("Wrong email or password.");
        }
    } else {
        throw new Error("Invalid email.");
    }
}

export async function createUser(name, last_name, email, password) {
    const hash = encrypt(password);
        
    try {
        const [ret] = await pool.execute(`
        INSERT INTO users (user_id, name, last_name, email, password)
        VALUES (NULL, ?, ?, ?, ?)
        `, [name, last_name, email, hash]);

        return ret[0];
    } catch (error) {
        console.log(error.message);
    }
}

function encrypt(password) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
}