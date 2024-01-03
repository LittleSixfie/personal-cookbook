import { CognitoJwtVerifier } from "aws-jwt-verify";    
import 'dotenv/config';

const tokenBlacklist = new Set(); 

async function auth(req,res,next) {
    if(!req.originalUrl.match(/image\/\d+/) ){
        const verifier = CognitoJwtVerifier.create({
            userPoolId: process.env.COGNITO_POOL_ID,
            clientId: process.env.COGNITO_CLIENT_ID,
            tokenUse: 'access',
            includeRawJwtInErrors: true,
        });
        try {
            const token=req.headers.authorization.replace("Bearer","").trim();
            if(token && !tokenBlacklist.has(token)){
                if(req.headers.kill){
                    tokenBlacklist.add(token);
                    throw Error("Added to blacklist");
                } else {
                    const payload = await verifier.verify(token);
                    next()
                }
            } else {
                throw Error("No valid token");
            }
        } catch(err){
            console.log("ERROR:", err.message)
            return res.status(403).json({ statusCode: 403, message: "Forbidden" });
        } finally {
            
        }
    } else {
        next()
    }
}

export default auth