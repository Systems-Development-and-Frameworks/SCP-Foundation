import jwt from "jsonwebtoken";
import { privateKey } from "../config";
import bcrypt from "bcrypt";
import { gql } from "apollo-server";
import { executor } from '../graphCms/schema';

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

  async userExists(userId){
    const getEmailQuery = gql`
        query {
          people (where: {id: "${userId}"}) {
            id
            email
            password
          }
        }
        `;
      const { data, errors } = await executor({ document: getEmailQuery });
      if (errors) throw new Error(errors.map((e) => e.message).join("\n"));
      const { people } = data;
      if (people.length != 1) return "Email or Password incorrect.";
  }
}
