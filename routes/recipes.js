import express from 'express'
import recipeController from '../database/recipeController.js';

const routerRecipe = express.Router();

routerRecipe.get('/', recipeController.getAllRecipes);

// POST: add to a table
routerRecipe.post('/add', recipeController.createRecipe);

// Define a route for getting a single item by ID
routerRecipe.get('/:id', recipeController.getRecipeById);

// Edit a entry of an object
routerRecipe.put('/:id', recipeController.updateRecipe);

//Define delete on an object
routerRecipe.delete('/:id', recipeController.deleteRecipe);

export default routerRecipe