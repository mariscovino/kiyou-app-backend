import Concert from "./Concert.js";
import pool from "./db.js";
import { sendQuery } from "./utils.js";

export default class List extends Concert {
    song_name;
    song_artist;

    constructor(pin, song_name, song_artist) {
        super(pin);
        this.song_name = song_name;
        this.song_artist = song_artist;
    }

    // Add song to queue
    async createSongQueue() {
        await this.sendListQuery(`
            INSERT
            INTO song_queue (concert_id, song_name, song_artist, queue_element_id, date_created)
            VALUES (?, ?, ?, NULL, CURRENT_TIMESTAMP);
        `);
    }

    // Remove song from song queue
    async removeSongQueue() {
        await this.sendListQuery(`
            DELETE
            FROM song_queue
            WHERE concert_id = ? AND song_name = ? AND song_artist = ?;
        `);
    }

    // Add song to queue
    async createSongRequests(email) {
        const concert_id = await this.getConcertId();
        
        if (await this.existsRequests()) {
            throw new Error("Sorry. This song was already requested.");
        }
    
        if (await this.existsPlayed()) {
            throw new Error("Sorry. This song was already played.");
        }
    
        if (await this.existsQueue()) {
            throw new Error("Sorry. This song is already in the queue.");
        }
    
        await pool.query(`
            INSERT
            INTO song_requests (concert_id, song_name, song_artist, request_id, user_email, status)
            VALUES (?, ?, ?, NULL, ?, 'pending');
        `, [concert_id, this.song_name, this.song_artist, email]);
    }

    // Update song status
    async updateStatus(status) {
        const concert_id = await this.getConcertId();
        
        await sendQuery(`
            UPDATE song_requests
            SET status = ?
            WHERE concert_id = ? AND song_name = ? AND song_artist = ?
        `, [status, concert_id, this.song_name, this.song_artist])
    }

    // Accept song
    async acceptSong() {
        this.updateStatus('accepted');

        this.createSongQueue();
    }

    // Deny song
    async denySong() {
        this.updateStatus('denied');
    }

    // Remove song from song queue
    async removeSongRequests() {
        await this.sendListQuery(`
            DELETE
            FROM song_requests
            WHERE concert_id = ? AND song_name = ? AND song_artist = ?
        `);
    }

    // Add song to queue
    async createSongsPlayed() {
        await this.sendListQuery(`
            INSERT
            INTO songs_played (concert_id, song_name, song_artist, played_element_id)
            VALUES (?, ?, ?, NULL)
        `)
    }

    // Remove song from song queue
    async removeSongsPlayed() {
        await this.sendListQuery(`
            DELETE
            FROM songs_played
            WHERE concert_id = ? AND song_name = ? AND song_artist = ?
        `);
    }

    // Send query passing email parameter
    async sendListQuery(options) {
        const concert_id = await this.getConcertId();

        const ret = await sendQuery(options, [concert_id, this.song_name, this.song_artist])

        return ret[0];
    }

    // Returns true if a song exists in a list
    async existsRequests() {
        const ret = await this.sendListQuery(`
            SELECT *
            FROM song_requests
            WHERE EXISTS
                (SELECT * FROM song_requests WHERE concert_id = ? AND song_name = ? AND song_artist = ?)
        `)

        return Boolean(ret);
    }

    // Returns true if a song exists in a list
    async existsPlayed() {
        const ret = await this.sendListQuery(`
            SELECT *
            FROM songs_played
            WHERE EXISTS
                (SELECT * FROM songs_played WHERE concert_id = ? AND song_name = ? AND song_artist = ?)
        `)

        return Boolean(ret);
    }

    // Returns true if a song exists in a list
    async existsQueue() {
        const ret = await this.sendListQuery(`
        SELECT *
        FROM song_queue
        WHERE EXISTS
            (SELECT * FROM song_queue WHERE concert_id = ? AND song_name = ? AND song_artist = ?)
        `)

        return Boolean(ret);
    }
}