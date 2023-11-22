const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config/index');
const refreshTokenSchema = require('../models/token');

// const ACCESS_TOKEN_SECRET = "48e5344e92ed3ce5e37eea845258a148caacf851155b3ad0de48090f0d7d8b97d4dbe466f3447a443fcda7bd8302a26a7aa6634518273ce666590d5e93418795";

class JWTService{
    //sign access token
    static signAccessToken(payload, expiryTime){
        // console.log("sign access");
        return  jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: expiryTime});
    }

    //sign refresh token
    static signRefreshToken(payload, expiryTime){
        // console.log("sign refresh");
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn:expiryTime});
        // const tokenreturn = jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn:expiryTime});
        // console.log(tokenreturn);
        // return tokenreturn;
    }
    
    //verify access token
    static verifyAccessToken(token){
        // console.log("verify accesss");
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }

    //verify refresh token
    static verifyRefreshToken(token){
        // console.log("verify refresh");
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }

    //store refresh token
    static async storeRefreshToken(token, userId){
        try {
            const newToken = new refreshTokenSchema({
                token: token,
                userId: userId
            });

            //store
            await newToken.save();
        
        } 
        
        catch (error) {
            console.log(error);
        }
    }

}

module.exports = JWTService;

// > const crpyto = require('crypto');
// undefined
// > crpyto.randomBytes(64).toString('hex')
// '48e5344e92ed3ce5e37eea845258a148caacf851155b3ad0de48090f0d7d8b97d4dbe466f3447a443fcda7bd8302a26a7aa6634518273ce666590d5e93418795'
// >