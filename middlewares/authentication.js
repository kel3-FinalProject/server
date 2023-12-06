const jwt = require("jsonwebtoken");
const secret = "rahasia";

async function authentication(req, res, next){
    try {
        const headers = req.headers;

        const bearer = headers.authorization;

        if (!bearer || !bearer.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        const token = bearer.slice(7);
        console.log(token);
        const decode = jwt.verify(token, secret);
        console.log(decode);
        req.userId = decode.id;
        req.email = decode.email ;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authentication;