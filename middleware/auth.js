const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // exemple de token: Bearer hfyfgdfqsflmddededdsferghthstrs

        const token = req.headers.authorization.split(' ')[1];  // On garde le 2eme mot apres le caractere 'espace'
        const tokenDecoded = jwt.verify(token, 'TEST_FOR_RAMDOM_TOKEN');  // Decodage du token avec la clef pour recuperer un objet (composé) Token
        const userId = tokenDecoded.userId;

        req.auth = {
            userId : userId
        }
        next();
    }
    catch(error) {
        res.status(401).json({error});
    }
};