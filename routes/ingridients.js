import express from 'express'
import ingridientController from '../database/ingridientController.js';

const routerIngridient = express.Router();

routerIngridient.get('/', ingridientController.getAllingridients);

// POST: add to a table
routerIngridient.post('/add', ingridientController.createingridient);

// Define a route for getting a single item by ID
routerIngridient.get('/:id', ingridientController.getingridientById);

// Edit a entry of an object
routerIngridient.put('/:id', ingridientController.updateingridient);

//Define delete on an object
routerIngridient.delete('/:id', ingridientController.deleteingridient);

export default routerIngridient