import express from 'express'
import cors from 'cors'
import multer from 'multer'
import auth from './middleware/auth.js';
import routerDefault from './routes/default.js'
import routerRecipe from './routes/recipes.js'
import routerIngridient from './routes/ingridients.js'
import routerImage from './routes/images.js'
import routerIngridientList from './routes/ingridientList.js'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

app.use(cors({ origin: "http://web.server.recipebook.s3-website.eu-central-1.amazonaws.com/"}));

const middleware = [auth, express.json()]
app.use('/', middleware, routerDefault);
app.use('/recipes', middleware , routerRecipe);
app.use('/ingridients', middleware, routerIngridient);
app.use('/ingridientsList', middleware, routerIngridientList);
app.use('/image', [auth, upload.any() ], routerImage);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});