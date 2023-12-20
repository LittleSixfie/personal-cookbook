import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { CognitoJwtVerifier } from "aws-jwt-verify";    

import routerDefault from './routes/default.js'
import routerRecipe from './routes/recipes.js'
import routerIngridient from './routes/ingridients.js'
import routerImage from './routes/images.js'
import routerIngridientList from './routes/ingridientList.js'
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

app.use(cors());

app.use(async (req,res,next) =>{
    if(!req.originalUrl.match(/image\/\d+/)){
        const verifier = CognitoJwtVerifier.create({
        userPoolId: "eu-central-1_scuu9XSpL",
        tokenUse: 'access',
        clientId: "4mqtgj4vshuql0vfb22of6c7n4",
        includeRawJwtInErrors: true,
        });
        console.log(req.originalUrl, req.params, req.headers.authorization )
        try {
            await verifier.verify(req.headers.authorization.replace("Bearer","").trim());
        } catch(err){
            console.log("ERROR:", err)
        } finally {
            next()
        }
    } else {
        next()
    }
})


app.use('/', express.json(), routerDefault);
app.use('/recipes', express.json() , routerRecipe);
app.use('/ingridients', express.json(), routerIngridient);
app.use('/ingridientsList', express.json(), routerIngridientList);
app.use('/image', upload.any(), routerImage);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});