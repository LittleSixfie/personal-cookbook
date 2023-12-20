import { CognitoJwtVerifier } from "aws-jwt-verify";    

async function auth(req,res,next) {
    console.log("IMAGEN", req.originalUrl, ) 
    if( !req.originalUrl.match(/image\/\d+/) ) {
        const verifier = CognitoJwtVerifier.create({
            userPoolId: "eu-central-1_scuu9XSpL",
            tokenUse: 'access',
            clientId: "4mqtgj4vshuql0vfb22of6c7n4",
            includeRawJwtInErrors: true,
        });
        console.log(req.originalUrl, req.params, req.body)
        try {
            const payload = await verifier.verify(req.headers.authorization.replace("Bearer","").trim());
            next();
        } catch(err){
            console.log("ERROR:", err)
        }
    }
    next()
}

export default auth