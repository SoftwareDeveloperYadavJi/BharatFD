import jwt from "jsonwebtoken";

/**
 * Checks if the Authorization header is present and if the token is valid.
 * Sets the `req.user` property if the token is valid.
 * Returns a 401 status code if the token is invalid or not present.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};