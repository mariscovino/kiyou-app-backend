import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import UAParser from 'ua-parser-js'

dotenv.config()
const saltRounds = 10;

// Connect to database
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

// Get user with email
export async function getUser(email) {
    const [ret] = await pool.query(`
        SELECT *
        FROM users
        WHERE email = ?
    `, [email]);

    return ret[0];
}

// Get user id with email
export async function getUserId(email) {
    const [ret] = await pool.query(`
        SELECT user_id
        FROM users
        WHERE email = ?
    `, [email]);

    return ret[0];
}

// Check if a user wih email exists
export async function userExists(email) {
    const [ret] = await pool.query(`
        SELECT *
        FROM users
        WHERE EXISTS
            (SELECT * FROM users WHERE email = ?)
    `, [email])

    return Boolean(ret.length);
}

// Encrypt password
function encrypt(password) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
}

// Authenticate login
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

// Detect and log device information
async function getDeviceInfo(user_id, user_agent) {
    const parser = new UAParser(user_agent);
    const system_name = parser.getOS();
    console.log(system_name);
    const device_model = parser.getDevice();

    const [ret] = await pool.query(`
        INSERT INTO user_sessions (
            session_id, 
            user_id, 
            date_logged, 
            system_name, 
            device_model) 
        VALUES (NULL, ?, CURRENT_TIMESTAMP, ?, ?)
    `, [user_id, system_name, device_model]);
}

// Sign in
export async function signIn(email, password, user_agent) {
    if (await userExists(email)) {
        if (await authenticate(email, password)) {
            const id = getUserId(email);
            getDeviceInfo(id, user_agent);

            console.log("Success!");
        } else {
            throw new Error("Wrong email or password.");
        }
    } else {
        throw new Error("Invalid email.");
    }
}

// Sign up
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