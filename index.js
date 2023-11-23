import express from 'express'
import cors from 'cors'
import multer from 'multer'
import routerDefault from './routes/default.js'
import routerRecipe from './routes/recipes.js'
import routerIngridient from './routes/ingridients.js'
import routerImage from './routes/images.js'
import routerIngridientList from './routes/ingridientList.js'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

app.use(cors());

app.use('/', express.json(), routerDefault);
app.use('/recipes', express.json(), routerRecipe);
app.use('/ingridients', express.json(), routerIngridient);
app.use('/image', upload.any(), routerImage);
app.use('/ingridientsList', express.json(), routerIngridientList);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});