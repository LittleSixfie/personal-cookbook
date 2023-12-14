import express from 'express'
import ingridientController from '../database/ingridientController.js';

const routerIngridient = express.Router();

routerIngridient.get('/', ingridientController.getAllIngridients);

// POST: add to a table
routerIngridient.post('/add', ingridientController.createIngridient);

// Define a route for getting a single item by ID
routerIngridient.get('/listEnums/', ingridientController.getListEnums);

// Define a route for getting a single item by ID
routerIngridient.get('/:id', ingridientController.getIngridientById);

// Edit a entry of an object
routerIngridient.put('/:id', ingridientController.updateIngridient);

//Define delete on an object
routerIngridient.delete('/:id', ingridientController.deleteIngridient);

export default routerIngridient