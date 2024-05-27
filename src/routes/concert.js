import express from 'express'
import Concert from '../model/Concert.js';

const router = express.Router();

router.get("/concerts/getSongQueue", async (req, res) => {
    const { pin } = req.body;

    const concert = new Concert(pin);
    
    try {
        const songQueue = await concert.getSongQueue();
    
        res.status(200).send(songQueue);
    } catch (error) {
        console.log(error);
    }
});

router.get("/concerts/getSongRequests", async (req, res) => {
    const { pin } = req.body;

    const concert = new Concert(pin);
    
    try {
        const songRequests = await concert.getSongRequests();
    
        res.status(200).send(songRequests);
    } catch (error) {
        console.log(error);
    }
});

router.get("/concerts/getSongsPlayed", async (req, res) => {
    const { pin } = req.body;

    const concert = new Concert(pin);
    
    try {
        const songsPlayed = await concert.getSongsPlayed();
    
        res.status(200).send(songsPlayed);
    } catch (error) {
        console.log(error);
    }
});

export default router;