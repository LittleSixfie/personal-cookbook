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
    return dbClient
}

const ingridientController = {
    getAllIngridients: async (req, res) => {
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('SELECT * FROM ingrediente')
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    getIngridientById: async (req, res) => {
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('SELECT * FROM ingrediente WHERE id=$1', [itemId])
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    createIngridient: async (req, res) => {
        let dbClient = await connectDB()
        try {
            const requestData = req.body; 
            console.log(requestData)
            const queryResult = await dbClient.query('INSERT INTO ingrediente( nombre, unidades )VALUES ($1,$2)', [requestData['nombre'], requestData['unidades']])
            res.json(queryResult);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    updateIngridient: async (req, res) => {
        //TODO: Literalmente hacerlo.
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('UPDATE ingrediente SET salario = 50000 WHERE id_empleado = 100;', [itemId])
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    deleteIngridient: async (req, res) => {
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('DELETE FROM ingrediente WHERE id=$1', [itemId])
            res.json(queryResult.rows);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
};

export default ingridientController