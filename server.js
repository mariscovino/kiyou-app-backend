import express from 'express'
import userRouter from './src/routes/user.js'
import concertRouter from './src/routes/concert.js'

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(concertRouter);

app.listen(8080, () => {
    console.log('Server is running on port 8080')
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!');
    res.send(err.message);
})