import express from 'express'
import router from './routes/recipes.js'

const app = express();

app.use(express.json());
app.use('/recipes', router);

app.get('/', (req, res) => {
    res.send('Node.js is working!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});