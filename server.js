import express from 'express'
import { getUsers, getUser, signIn, createUser } from './database.js';

const app = express();

app.use(express.json());

app.listen(8080, () => {
    console.log('Server is running on port 8080')
});

app.get("/users", async (req, res) => {
    const users = await getUsers();
    res.send(users);
})

app.get("/users/:email", async (req, res) => {
    const id = req.params.id
    const user = await getUser(id);
    res.send(user);
})

app.post("/users/signIn", async (req, res) => {
    const {email, password} = req.body;
    
    try {
        const user = await signIn(email, password);
        res.send(user);
    } catch (error) {
        console.log(error);
    }
})

app.post("/users/createUser", async (req, res) => {
    const { name, last_name, email, password } = req.body
    const user = await createUser(name, last_name, email, password);
    res.status(201).send(user);
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})