import pool from './db.js'
import bcrypt from 'bcrypt'
import UAParser from 'ua-parser-js';
import { sendQuery } from './utils.js'

export default class User {
    email;
    password;

    constructor(email, password){
        this.email = email;
        this.password = password;
    }

    // Sign up
    async signUp(name, last_name) {
        const hash = await this.encrypt(this.password);
            
        const [ret] = await pool.query(`
                INSERT INTO users (user_id, name, last_name, email, password)
                VALUES (NULL, ?, ?, ?, ?)
            `, [name, last_name, this.email, hash]);

            this.password = hash;

            return ret[0];
            
    }

    // Sign in
    async signIn(user_agent) {
        if (await this.exists()) {
            if (await this.passwordsMatch(this.password)) {
                this.getDeviceInfo(this.email, user_agent);
            } else {
                throw new Error("Wrong email or password.");
            }
        } else {
            throw new Error("Invalid email.");
        }
    }

    // Get concerts created by user
    async getArtistConcerts() {
        const ret = await this.sendEmailQuery(`
            SELECT *
            FROM concerts
            WHERE artist_email = ?
            `);

        return ret;
    }

    // Get concerts attended by user
    async getAudienceConcerts() {
        const ret = await this.sendEmailQuery(`
            SELECT *
            FROM concerts
            WHERE concert_id = (
                SELECT concert_id
                FROM audience
                WHERE user_email = ?
            )
            `);

        return ret;
    }
      
    // Sign Out
    async signOut() {
        try {
            await this.sendEmailQuery(`
                DELETE
                FROM user_sessions
                WHERE user_email = ?
            `);
        } catch (err) {
            throw err;
        }
    }

    // Send query passing email parameter
    async sendEmailQuery(options) {
        const ret = await sendQuery(options, this.email)

        return ret[0];
    }

    // Get user id with email
    async getUserId() {
        const ret = await this.sendEmailQuery(`
            SELECT user_id
            FROM users
            WHERE email = ?
            `);
    
        return ret;
    }

    // Returns true if a user exists
    async exists() {
        const ret = await this.sendEmailQuery(`
            SELECT *
            FROM users
            WHERE EXISTS
                (SELECT * FROM users WHERE email = ?)
        `)

        return Boolean(ret);
    }

    // Returns true if encrypted passwords match
    async passwordsMatch(password) {
        const hash = await this.sendEmailQuery(`
            SELECT password
            FROM users
            WHERE email = ?
        `);

        const match = await bcrypt.compare(password, hash.password);

        return match;
    }

    // Encrypt password
    async encrypt(password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        return hash;
    }

    // Detects and logs device information in user_sessions
    async getDeviceInfo(user_email, user_agent) {
        const parser = new UAParser(user_agent);
        const system_name = parser.getOS().name;
        const device_model = parser.getDevice().vendor + " " + parser.getDevice().model;

        const ret = pool.execute(`
            INSERT INTO user_sessions (
                session_id, 
                user_email, 
                date_logged, 
                system_name, 
                device_model) 
            VALUES (NULL, ?, CURRENT_TIMESTAMP, ?, ?)
        `, [user_email, system_name, device_model]);
    }
}