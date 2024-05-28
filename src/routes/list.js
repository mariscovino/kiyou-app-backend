import express from 'express'
import List from '../model/List.js';

const router = express.Router();

router.post("/concert/list/createSongQueue", async (req, res) => {
    const { pin, song_name, song_artist } = req.body;

    const songQueue = new List(pin, song_name, song_artist);
    
    try {
        await songQueue.createSongQueue();
    
        res.status(201).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/concert/list/removeSongQueue", async (req, res) => {
    const { pin, song_name, song_artist } = req.body;

    const songQueue = new List(pin, song_name, song_artist);
    
    try {
        await songQueue.removeSongQueue();
    
        res.status(200).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/concert/list/createSongRequests", async (req, res) => {
    const { pin, song_name, song_artist, email } = req.body;

    const songRequests = new List(pin, song_name, song_artist);
    
    try {
        await songRequests.createSongRequests(email);
    
        res.status(201).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/concert/list/acceptSong", async (req, res) => {
    const { pin, song_name, song_artist } = req.body;

    const songRequests = new List(pin, song_name, song_artist);
    
    try {
        await songRequests.acceptSong();
    
        res.status(200).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/concert/list/denySong", async (req, res) => {
    const { pin, song_name, song_artist } = req.body;

    const songRequests = new List(pin, song_name, song_artist);
    
    try {
        await songRequests.denySong();
    
        res.status(200).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/concert/list/removeSongRequests", async (req, res) => {
    const { pin, song_name, song_artist } = req.body;

    const songRequests = new List(pin, song_name, song_artist);
    
    try {
        await songRequests.removeSongRequests();
    
        res.status(200).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/concert/list/createSongsPlayed", async (req, res) => {
    const { pin, song_name, song_artist } = req.body;

    const songsPlayed = new List(pin, song_name, song_artist);
    
    try {
        await songsPlayed.createSongsPlayed();
    
        res.status(201).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/concert/list/removeSongsPlayed", async (req, res) => {
    const { pin, song_name, song_artist } = req.body;

    const songsPlayed = new List(pin, song_name, song_artist);
    
    try {
        await songsPlayed.removeSongsPlayed();
    
        res.status(200).send("Success");
    } catch (error) {
        console.log(error);
    }
});

export default router;