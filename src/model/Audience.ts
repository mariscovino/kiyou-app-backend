import pool from "./db";
import { select } from "./utils";

// Join concert
export async function joinConcert(pin, email) {
    const concert_id = await select("concert_id", "concerts", "pin", pin);

    try {
        const [ret] = await pool.execute(`
        INSERT
        INTO audience (concert_id, user_email)
        VALUES (?, ?)
        `, [concert_id, email]);

        return ret[0];
    } catch (error) {
        throw error;
    }
}