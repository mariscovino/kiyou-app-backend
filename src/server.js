import express from 'express'
import userRoute from './routes/user.js'
import concertRoute from './routes/concert.js'
import listRoute from "./routes/list.js"
import http from 'http'
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors());
app.use(userRoute);
app.use(concertRoute);
app.use(listRoute);

const httpServer = http.createServer(app);

httpServer.listen(8080, () => {
    console.log('Server is running on port 8080')
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.message);
})