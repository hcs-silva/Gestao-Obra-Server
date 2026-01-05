import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const isAuthenticated = (req: any, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Missing authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    // Attach payload to request as `payload` so role middleware can read it
    req.payload = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuthenticated;
module.exports = isAuthenticated;
