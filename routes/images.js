import express from 'express'
import imageController from '../database/imageController.js';

const routerImage = express.Router();

// POST: add to a table
routerImage.get('/:id', imageController.getImage);

// POST: add to a tables
routerImage.post('/add/:id', imageController.addImage);

export default routerImage