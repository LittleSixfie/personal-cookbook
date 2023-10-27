import express from 'express'
import routerRecipe from './routes/recipes.js'
import routerIngridient from './routes/ingridients.js'
import routerIngridientList from './routes/ingridientList.js'

const app = express();
app.use(express.json());

app.use('/recipes', routerRecipe);
app.use('/ingridients', routerIngridient);
app.use('/ingridientsList', routerIngridientList);

app.get('/', (req, res) => {
    res.send('Node.js is working!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});