import  pg  from 'pg'
import 'dotenv/config'
// TODO: ADD SUPPORT FOR IMAGES

async function connectDB() {
    const dbClient = new pg.Client({
        host: process.env.DB_HOST,
        port: 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });
    await dbClient.connect()
    return dbClient
}

const ingridientListController = {
    getAllIngridientsList: async (req, res) => {
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('SELECT * FROM lista_ingredientes')
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    getIngridientListById: async (req, res) => {
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('SELECT * FROM lista_ingredientes WHERE id=$1', [itemId])
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    createIngridientList: async (req, res) => {
        let dbClient = await connectDB()
        try {
            const requestData = req.body; 
            console.log(requestData)
            const queryResult = await dbClient.query('INSERT INTO lista_ingredientes( idreceta, idingrediente, cantidad )VALUES ($1,$2,$3)', [requestData['idreceta'], requestData['idingrediente'], requestData['cantidad']])
            res.json(queryResult);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    updateIngridientList: async (req, res) => {
        //TODO: Literalmente hacerlo.
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('UPDATE lista_ingredientes SET salario = 50000 WHERE id_empleado = 100;', [itemId])
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    deleteIngridientList: async (req, res) => {
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('DELETE FROM lista_ingredientes WHERE id=$1', [itemId])
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
};

export default ingridientListController