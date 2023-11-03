const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    // If there's no token, send a 401 Unauthorized response
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    // Verify the token using the JWT secret key
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            // If verification fails, send a 401 Unauthorized response
            return res.status(401).send('Unauthorized');
        }

        // If verification succeeds, store the decoded token on the request object
        // so that the route handler can use it
        req.userId = decoded.userId;
        next();  // Call the next middleware or route handler
    });
};

module.exports = authMiddleware;
