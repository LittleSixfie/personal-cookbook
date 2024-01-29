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
            console.error(err, new Date() );
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
            console.error(err, new Date() );
        } finally {
            await dbClient.end()
        }
    },
    getListEnums: async (req, res) => {
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query("select n.nspname as enum_schema, t.typname as enum_name, e.enumlabel as enum_value from pg_type t join pg_enum e on t.oid = e.enumtypid join pg_catalog.pg_namespace n ON n.oid = t.typnamespace;")
            
            res.json(queryResult.rows.map(element => element.enum_value));
        } catch (err) {
            console.error(err, new Date() );
        } finally {
            await dbClient.end()
        }
    },
    createIngridient: async (req, res) => {
        let dbClient = await connectDB()
        try {
            const requestData = req.body; 
            const queryResult = await dbClient.query('INSERT INTO ingrediente( nombre, unidades )VALUES ($1,$2) RETURNING id', [requestData['nombre'], requestData['unidades']])
            res.status(201)
            res.json(queryResult);
        } catch (err) {
            console.error(err, new Date() );
            if(err.code == 23505){
                res.status(208)
                res.json(await dbClient.query('SELECT id FROM ingrediente WHERE nombre=$1', [req.body['nombre']]))   
            }
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
            console.error(err, new Date() );
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
            console.error(err, new Date() );
        } finally {
            await dbClient.end()
        }
    },
};

export default ingridientController