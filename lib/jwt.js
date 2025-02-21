import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export function generateJWT(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export function verifyJWT(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};