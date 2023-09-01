const jwt = require('jsonwebtoken');

module.exports = {
    createToken: (payload, expire = '24h') => {
        let token = jwt.sign(payload, 'COFFEE_BEAN', {expiresIn: expire});
        return token;
    },
    readToken: (req, res, next) => {
        jwt.verify(req.token, 'COFFEE_BEAN', (error, decrypt) => {
            if(error) {
                console.log("Error :", error);
                return res.status(401).send({
                    success: false,
                    message: "Authentication failed",
                    error: error
                });
            }
            req.decrypt = decrypt;
            next();
        })
    }
}