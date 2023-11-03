import express from 'express'
const routerDefault = express.Router();

routerDefault.get('/', (req, res) => {
    console.log("hola")
    res.send("<h1>Just a simple API to manage a Database for store recipes</h1>")
});

export default routerDefault