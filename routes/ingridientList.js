import express from 'express'
import ingridientListController from '../database/ingridientListController.js';

const routerIngridientList = express.Router();

routerIngridientList.get('/', ingridientListController.getAllIngridientsList);

// POST: add to a table
routerIngridientList.post('/add', ingridientListController.createIngridientList);

// Define a route for getting a single item by ID
routerIngridientList.get('/:id', ingridientListController.getIngridientListById);

// Edit a entry of an object
routerIngridientList.put('/:id', ingridientListController.updateIngridientList);

//Define delete on an object
routerIngridientList.delete('/:id', ingridientListController.deleteIngridientList);

export default routerIngridientList