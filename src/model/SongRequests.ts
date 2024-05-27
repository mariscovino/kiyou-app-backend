import pool from "./db";
import { select } from "./utils";
import { List } from "./List";
import { SongQueue } from "./SongQueue";

enum stat {'accepted', 'denied', 'pending'}

export class SongRequests extends List {
    public constructor(concert_id, song_name, song_artist) {
        super(concert_id, song_name, song_artist);
    }

    // Get song requests
    public async getSongRequests() {
        const ret = await select("*", "song_requests", "concert_id", List.concert_id);

        return ret;
    }

    // Add song request
    public static async create(concert_id, song_name, song_artist, user_id) {
        if (await this.songExists("song_requests")) {
            throw new Error("Sorry. This song was already requested.");
        }
    
        if (await this.songExists("songs_played")) {
            throw new Error("Sorry. This song was already played.");
        }
    
        if (await this.songExists("song_queue")) {
            throw new Error("Sorry. This song is already in the queue.");
        }
    
        const [request] = await pool.query(`
            INSERT
            INTO song_requests (song_name, song_artist, user_id, status, request_id, concert_id)
            VALUES (?, ?, ?, 'pending', NULL, ?);
        `, [song_name, song_artist, user_id, concert_id]);

        const ret = request[0];

        SongRequests.concert_id = ret.concert_id;
        SongRequests.song_name = ret.song_name;
        SongRequests.song_artist = ret.song_artist;
    }

    // Returns true if a song exists in a list
    private static async songExists(table: String): Promise<boolean> {
        const [ret] = await pool.query(`
            SELECT
                CASE WHEN EXISTS
                    (SELECT * FROM ? WHERE song_name = ? AND song_artist = ? AND concert_id = ?)
                THEN 1 
                ELSE 0 
                END 
        `, [table, SongRequests.song_name, SongRequests.song_artist, SongRequests.concert_id])

        return Boolean(ret);
    }

    // Remove song from song requests
    public async removeRequest() {
        await this.remove("song_requests");
    }

    // Update song status
    private async updateStatus(status) {
        await pool.query(`
            UPDATE song_requests
            SET status = ?
            WHERE song_name = ? AND song_artist = ? AND concert_id = ?;
        `, [status, SongRequests.song_name, SongRequests.song_artist, SongRequests.concert_id])
    }

    // Accept song
    public async acceptSong() {
        this.updateStatus('accepted');

        SongQueue.create(SongRequests.concert_id, SongRequests.song_name, SongRequests.song_artist);
    }

    // Deny song
    public async denySong() {
        this.updateStatus('denied');
    }
}