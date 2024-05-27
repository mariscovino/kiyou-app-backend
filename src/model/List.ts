import pool from "./db";

export class List {
    protected static concert_id: number
    protected static song_name: string;
    protected static song_artist: string;

    public constructor(concert_id, song_name, song_artist) {
        List.concert_id = concert_id;
        List.song_name = song_name;
        List.song_artist = song_artist;
    }

    // Remove from list
    protected async remove(list) {
        await pool.query(`
            DELETE
            FROM ?
            WHERE song_name = ? AND song_artist = ? AND concert_id = ?;
        `, [list, List.song_name, List.song_artist, List.concert_id]);
    }
}