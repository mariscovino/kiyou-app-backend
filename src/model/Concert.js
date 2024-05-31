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
            SELECT song_name, song_artist
            FROM song_queue
            WHERE concert_id = ?
            ORDER BY date_created ASC
        `, [concert_id]);

        return ret[0];
    }

    async getSongRequests() {
        const concert_id = await this.getConcertId();

        const [ret] = await pool.query(`
            SELECT song_name, song_artist
            FROM song_requests
            WHERE concert_id = ?
        `, [concert_id]);

        return ret[0];
    }

    async getSongsPlayed() {
        const concert_id = await this.getConcertId();

        const [ret] = await pool.query(`
            SELECT song_name, song_artist
            FROM songs_played
            WHERE concert_id = ?
        `, [concert_id]);

        return ret[0];
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