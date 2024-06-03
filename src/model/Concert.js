import pool from './db.js'
import { sendQuery } from './utils.js';

export default class Concert {
    pin;

    constructor(pin) {
        this.pin = pin;
    }

    async getSongQueue() {
        const concert_id = await this.getConcertId();

        const [ret] = await pool.query(`
            SELECT *
            FROM song_queue
            WHERE concert_id = ?
            ORDER BY date_created ASC
        `, [concert_id]);

        return ret;
    }

    async getSongRequests() {
        const concert_id = await this.getConcertId();

        const [ret] = await pool.query(`
            SELECT *
            FROM song_requests
            WHERE concert_id = ?
        `, [concert_id]);

        return ret;
    }

    async getSongsPlayed() {
        const concert_id = await this.getConcertId();

        const [ret] = await pool.query(`
            SELECT *
            FROM songs_played
            WHERE concert_id = ?
        `, [concert_id]);

        return ret;
    }

    // Get concert id with pin
    async getConcertId() {
        const ret = await this.sendPinQuery(`
            SELECT concert_id
            FROM concerts
            WHERE pin = ?
            `);

        return ret.concert_id;
    }

    // Send query passing pin parameter
    async sendPinQuery(options) {
        const ret = await sendQuery(options, this.pin);

        return ret[0];
    }
}