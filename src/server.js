import express from 'express'
import userRouter from './routes/user.js'
import concertRouter from './routes/concert.js'
import listRouter from "./routes/list.js"
import http from 'http'
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(concertRouter);
app.use(listRouter);

const httpServer = http.createServer(app);

httpServer.listen(8080, () => {
    console.log('Server is running on port 8080')
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!');
    res.send(err.message);
})