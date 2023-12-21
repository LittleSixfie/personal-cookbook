import { CognitoJwtVerifier } from "aws-jwt-verify";    
import 'dotenv/config'

const tokenBlacklist = new Set(); 

async function auth(req,res,next) {
    if(!req.originalUrl.match(/image\/\d+/) ){
        const verifier = CognitoJwtVerifier.create({
            userPoolId: process.env.COGNITO_POOL_ID,
            clientId: process.env.COGNITO_CLIENT_ID,
            tokenUse: 'access',
            includeRawJwtInErrors: true,
        });
        console.log(req.originalUrl)
        try {
            const token=req.headers.authorization.replace("Bearer","").trim()
            console.log(tokenBlacklist, token && !tokenBlacklist.has(token), req.headers.kill, )
            if(token && !tokenBlacklist.has(token)){
                if(req.headers.kill){
                    console.log(req.headers)
                    tokenBlacklist.add(token)
                    console.log(tokenBlacklist)
                } else {
                    const payload = await verifier.verify(token);
                    console.log("Token is valid. Payload:");
                    next()
                }
            } else {
                throw Error("no valid token");
            }
        } catch(err){
            console.log("ERROR:", err)
            //console.log(req)
            return res.status(403).json({ statusCode: 403, message: "Forbidden" });
        } finally {
            
        }
    } else {
        next()
    }
}

export default auth