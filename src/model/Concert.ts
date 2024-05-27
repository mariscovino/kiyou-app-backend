import pool from './db.js'
import { select } from './utils.js';

export class Concert {
    private static pin: number;

    public constructor(pin) {
        Concert.pin = pin;
    }

    // Create concert in the database and sets class fields
    public static async create(concert_name, artist_id) {
        const pin = Concert.getRandomPin(10000, 99999);

        try {
            const [concert] = await pool.execute(`
            INSERT INTO concerts (concert_id, concert_name, artist_id, pin)
            VALUES (NULL, ?, ?, ?)
            `, [concert_name, artist_id, pin]);

            const ret = concert[0];

            Concert.pin = pin;

            return ret[0];
        } catch (error) {
            throw error;
        }
    }

    public async getSongQueue() {
        const concert_id = await this.getConcertId();

        const ret = await select("*", "song_queue", "concert_id", concert_id);

        return ret;
    }

    public async getSongRequests() {
        const concert_id = await this.getConcertId();

        const ret = await select("*", "song_requests", "concert_id", concert_id);

        return ret;
    }

    public async getSongsPlayed() {
        const concert_id = await this.getConcertId();

        const ret = await select("*", "songs_played", "concert_id", concert_id);

        return ret;
    }

    // Get random pin
    private static getRandomPin(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Get concert with pin
    private async getConcertId() {
        const [ret] = await select("concert_id", "concerts", "pin", Concert.pin);

        return ret[0];
    }
}