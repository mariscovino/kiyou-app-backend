import pool from "./db";
import { List } from "./List";
import { select } from "./utils";

export class SongQueue extends List {
    private static date_created: Date;

    public constructor(concert_id, song_name, song_artist) {
        super(concert_id, song_name, song_artist);
    }

    // Get song queue
    public async getQueue() {
        const ret = await select("*", "song_queue", "concert_id", List.concert_id);

        return ret;
    }

    // Add song to queue
    public static async create(concert_id, song_name, song_artist) {
        const [queue] = await pool.query(`
            INSERT
            INTO song_queue (concert_id, song_name, song_artist, queue_element_id, date_created)
            VALUES (?, ?, ?, NULL, CURRENT_TIMESTAMP);
        `, [concert_id, song_name, song_artist])

        const ret = queue[0];

        SongQueue.concert_id = concert_id;
        SongQueue.song_name = song_name;
        SongQueue.song_artist = song_artist;
        SongQueue.date_created = ret.date_created;
    }

    // Remove song from song queue
    public async removeQueue() {
        await this.remove("song_queue");
    }
}