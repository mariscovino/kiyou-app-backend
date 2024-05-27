import pool from "./db";
import { List } from "./List";
import { select } from "./utils";

export class SongsPlayed extends List {

    public constructor(concert_id, song_name, song_artist) {
        super(concert_id, song_name, song_artist);
    }

    // Get songs played
    public async getPlayed() {
        const ret = await select("*", "songs_played", "concert_id", List.concert_id);

        return ret;
    }

    // Add song to queue
    public static async create(concert_id, song_name, song_artist) {
        const [queue] = await pool.query(`
            INSERT
            INTO songs_played (concert_id, song_name, song_artist, played_element_id)
            VALUES (?, ?, ?, NULL);
        `, [concert_id, song_name, song_artist])

        const ret = queue[0];

        SongsPlayed.concert_id = concert_id;
        SongsPlayed.song_name = song_name;
        SongsPlayed.song_artist = song_artist;
    }

    // Remove song from songs played
    public async removePlayed() {
        await this.remove("songs_played");
    }
}