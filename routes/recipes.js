import express from 'express'
import recipeController from '../database/db.js';

const router = express.Router();

router.get('/', recipeController.getAllRecipes);

// POST: add to a table
router.post('/add', recipeController.createRecipe);

// Define a route for getting a single item by ID
router.get('/:id', recipeController.getRecipeById);

// Edit a entry of an object
router.put('/:id', recipeController.updateRecipe);

//Define delete on an object
router.delete('/:id', recipeController.deleteRecipe);

export default router