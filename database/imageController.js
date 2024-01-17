import  pg  from 'pg'
import 'dotenv/config'

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

const imageController = {
    getImage: async (req, res) => {
        const itemId = req.params.id;
        let dbClient = await connectDB()
        try {
            const queryResult = await dbClient.query('SELECT * FROM recipe WHERE id=$1', [itemId])
            res.status(201).contentType('image/jpeg').send(queryResult.rows[0].image);
        } catch (err) {
            console.error(err);
        } finally {
            await dbClient.end()
        }
    },
    addImage: async (req, res) => {
        let dbClient = await connectDB()
        try {
            const itemId = req.originalUrl.match(/\d+/)[0];
            const requestData = req.body; 
            const queryResult = await dbClient.query('UPDATE recipe SET image=$2 WHERE id=$1;', [itemId, req.files[0].buffer])
            res.status(201).json(queryResult)
        } catch (err) {
            console.error(err);
            if(err.code == 23505){
                res.status(400)
                res.send(`The recipe already exits with id: ${(await dbClient.query('SELECT id FROM recipe WHERE title_name=$1', [req.body['title_name']])).rows[0].id}`)   
            }
        } finally {
            await dbClient.end()
        }
    }
};

export default imageController