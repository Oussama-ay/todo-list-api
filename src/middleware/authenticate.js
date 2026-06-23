const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({
            error: 'Authentication token is required'
        });
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            error: 'Authorization header must use Bearer token format'
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: payload.userId,
            email: payload.email
        };

        next();
    } catch {
        return res.status(401).json({
            error: 'Invalid or expired token'
        });
    }
}

module.exports = authenticate;
