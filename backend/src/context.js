import jwt from "jsonwebtoken";
import { privateKey } from "./config";

export function context ({ req, res }) {
    let token = req.headers.authorization || "";
    token = token.replace("Bearer ", "");
    let userData;
    try {
      userData = jwt.verify(token, privateKey);
      res = { userData: userData }
      return res;
    } catch (e) {
      res = userData
      return res;
    }
  }