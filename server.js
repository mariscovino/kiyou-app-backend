import express from 'express'
import userRouter from './src/routes/user.js'

const app = express();

app.use(express.json());
app.use(userRouter);

app.listen(8080, () => {
    console.log('Server is running on port 8080')
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})