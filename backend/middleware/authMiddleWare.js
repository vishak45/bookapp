
const jwt = require("jsonwebtoken"); 
// Imports the jsonwebtoken library, used for verifying JWT tokens.

const protect = async (req, res, next) => { 
    // Defines an async middleware function called 'protect' for route protection.

    const token = req.headers.authorization?.split(" ")[1]; 
    // Tries to get the token from the 'Authorization' header in the request.
    // The header is usually in the format: "Bearer <token>", so it splits by space and takes the second part.

    if (!token) { 
        // If no token is found,
        return res.status(401).json({ message: "Not authorized" }); 
        // Respond with 401 Unauthorized and a message.
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        // Verifies the token using your secret key from the .env file.
        // If valid, 'decoded' contains the payload (e.g., user info).

        req.user = decoded; 
        // Attaches the decoded user info to the request object for use in next middleware/routes.

        next(); 
        // Calls the next middleware or route handler.
    } catch (error) {
        return res.status(401).json({ message: "Not authorized" }); 
        // If verification fails, respond with 401 Unauthorized.
    }
}

module.exports = protect; 
// Exports the middleware so it can be used in your routes.