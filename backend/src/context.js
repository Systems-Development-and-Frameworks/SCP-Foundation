import jwt from "jsonwebtoken";
import { privateKey } from "./private.key";

export function context ({ req, res }) {
    let token = req.headers.authorization || "";
    token = token.replace("Bearer ", "");
    let userData;
    try {
      userData = jwt.verify(token, privateKey);
      return { userData: userData };
    } catch (e) {
      return userData;
    }
  }