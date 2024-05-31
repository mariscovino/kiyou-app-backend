import express from 'express'
import User from '../model/User.js';
import { getUsers } from '../model/utils.js';

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await getUsers();
        res.send(users);
    } catch (error) {
        console.log(error);
    }
});

router.post("/users/getUser", async (req, res) => {
    const { email } = req.body;

    const user = new User(email, "");

    try {
        const getUser = await user.getUser();

        res.status(200).send(getUser);
    } catch (error) {
        console.log(error);
    }
});

router.post("/users/signUp", async (req, res) => {
    const { name, last_name, email, password } = req.body;

    const user = new User(email, password);
    
    try {
        const newUser = await user.signUp(name, last_name);
    
        res.status(201).send(newUser);
    } catch (error) {
        console.log(error)
    }
});

router.post("/users/signIn", async (req, res) => {
    const {email, password} = req.body;
    const user = new User(email, password);
    
    try {
        const user_agent = req.headers['user-agent'];

        await user.signIn(user_agent);

        res.status(200).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/users/getUserSessions", async (req, res) => {
    const {email} = req.body;
    const user = new User(email, "");
    
    try {
        const user_sessions = await user.getUserSessions();

        res.status(200).send(user_sessions);
    } catch (error) {
        console.log(error);
    }
});

router.post("/users/getArtistConcerts", async (req, res) => {
    const {email} = req.body;
    const user = new User(email, "");
    
    try {
        const concerts = await user.getArtistConcerts();

        res.send(concerts).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/users/getAudienceConcerts", async (req, res) => {
    const {email} = req.body;
    const user = new User(email, "");
    
    try {
        const concerts = await user.getAudienceConcerts();

        res.send(concerts).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/users/getAllConcerts", async (req, res) => {
    const {email} = req.body;
    const user = new User(email, "");
    
    try {
        const concert = await user.getAllConcerts();

        res.status(200).send(concert);
    } catch (error) {
        console.log(error);
    }
});

router.post("/users/signOut", async (req, res) => {
    const {email} = req.body;
    const user = new User(email, "");
    
    try {
        await user.signOut();
        res.status(200).send("Success");
    } catch (error) {
        console.log(error);
    }
});

router.post("/users/joinConcert", async (req, res) => {
    const {email, pin} = req.body;
    const user = new User(email, "");
    
    try {
        const concert = await user.joinConcert(pin);
        res.status(200).send(concert);
    } catch (error) {
        console.log(error);
    }
});

router.post("/users/createConcert", async (req, res) => {
    const { concert_name, email } = req.body;

    const user = new User(email, "");
    
    try {
        const newConcert = await user.createConcert(concert_name);
    
        res.status(201).send(newConcert);
    } catch (error) {
        console.log(error);
    }
});

export default router;