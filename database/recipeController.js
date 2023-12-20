import  pg  from 'pg'
import 'dotenv/config'
// TODO: ADD SUPPORT FOR IMAGES

async function connectDB() {
    const dbClient = new pg.Client({
        host: process.env.HOST,
        port: 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });
    await dbClient.connect()
    console.log("connected")
    return dbClient
}

const recipeController = {
    getAllRecipes: async (req, res) => {
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('SELECT id, title_name, instructions, origin FROM recipe')
            res.send(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    getRecipeById: async (req, res) => {
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('SELECT * FROM recipe WHERE id=$1', [itemId])
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    createRecipe: async (req, res) => {
        let dbClient = await connectDB()
        try {
            const requestData = req.body; 
            const queryResult = await dbClient.query('INSERT INTO recipe( title_name, instructions, origin )VALUES ($1,$2,$3) RETURNING id', [requestData['title_name'], requestData['instructions'], requestData['origin']])
            res.status(201)
            res.json(queryResult);
        } catch (err) {
            console.error(err);
            if(err.code == 23505){
                res.status(400)
                res.send(`The recipe already exits with id: ${(await dbClient.query('SELECT id FROM recipe WHERE title_name=$1', [req.body['title_name']])).rows[0].id}`)   
            }
        } finally {
            await dbClient.end()
        }
    },
    updateRecipe: async (req, res) => {
        //TODO: Literalmente hacerlo.
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('UPDATE recipe SET salario = 50000 WHERE id_empleado = 100;', [itemId])
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    deleteRecipe: async (req, res) => {
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('DELETE FROM recipe WHERE id=$1', [itemId])
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
};

export default recipeController