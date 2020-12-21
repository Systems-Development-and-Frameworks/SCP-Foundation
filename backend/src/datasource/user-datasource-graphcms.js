import jwt from "jsonwebtoken";
import { privateKey } from "../config";
import bcrypt from "bcrypt";

const { DataSource } = require("apollo-datasource");

export class UserDatasourceGraphCms extends DataSource {

  passwordValid(password) {
    return password.length >= 8;
  }

  createJWT(userId) {
    return jwt.sign({ userId: userId }, privateKey, { algorithm: "HS256" });
  }

  async validateAndHashPassword (password){
    if (this.passwordValid(password)) {
      return await bcrypt
        .genSalt(10)
        .then((salt) => {
          return bcrypt.hash(password, salt);
        });
    }
    return undefined;
  }

  async checkPassword(userId, plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
      .then(res => {
          return res ? this.createJWT(userId) : "User or Password incorrect"
      }).catch(err => {
          console.log("CheckPassword Error:", err.message)
          return "User or Password incorrect"
      })
  }
}
