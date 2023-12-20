import { CognitoJwtVerifier } from "aws-jwt-verify";    
import 'dotenv/config'

async function auth(req,res,next) {
    if(!req.originalUrl.match(/image\/\d+/)){
        const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_POOL_ID,
        clientId: process.env.COGNITO_CLIENT_ID,
        tokenUse: 'access',
        includeRawJwtInErrors: true,
        });
        console.log(req.originalUrl)
        try {
            await verifier.verify(req.headers.authorization.replace("Bearer","").trim());
        } catch(err){
            console.log("ERROR:", err)
            //console.log(req)
        } finally {
            next()
        }
    } else {
        next()
    }
}

export default auth