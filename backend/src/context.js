import jwt from "jsonwebtoken";
import { privateKey } from "./config";

export function context ({ req }) {
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