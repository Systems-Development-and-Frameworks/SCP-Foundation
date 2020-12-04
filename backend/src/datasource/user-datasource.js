import { GraphQLSpecifiedByDirective } from "graphql";
import User from "../classes/user";
import jwt from "jsonwebtoken";
import { privateKey } from "../private.key";
import bcrypt from "bcrypt";

const { DataSource } = require("apollo-datasource");

export class UserDatasource extends DataSource {
  constructor(users = null) {
    super();

    this.users = users || [
      new User(1, "Robert", "Robert@htw.de", "$2b$10$odTluiJJBK/hnsSOqBZaU.CyMYcvFytWOiqbel8ZUwt3rVP5l9jja"),   // password
      new User(2, "Youri", "Youri@htw.de", "$2b$10$Ejw.B8tK778rkgDKLko8pOoZpDD6XJYJVF61UNWpMYiAM78oQpuzy"),     // 12345678
    ];
  }

  getUserById(id) {
    return this.users.find((user) => user.id == id);
  }

  getUserByName(name) {
    return this.users.find((user) => user.name == name);
  }

  getUserByEmail(email) {
    return this.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  allUsers() {
    return this.users;
  }

  userExists(userId) {
      let user = this.getUserById(userId)
      return user ? true : false
  }

  addUser(name, email, password) {
    this.users.push(
      new User(
        Math.max(...this.users.map((user) => user.id), 0) + 1,
        name,
        email,
        password
      )
    );
  }

  removeUser(id) {
    this.users = this.users.filter((user) => {
      return user.id != id;
    });
  }

  async signup(name, email, password) {
    if (this.getUserByEmail(email) == undefined) {
      if (this.passwordValid(password)) {
        let jwtToken = await bcrypt
          .genSalt(10)
          .then((salt) => {
            return bcrypt.hash(password, salt);
          })
          .then((hash) => {
            this.addUser(name, email, hash)
            return this.createJWT(this.getUserByEmail(email))
          });
        
        return jwtToken;
      }
      return "Password invalid. Must be at least 8 characters long. User not added.";
    }
    return "Email already exists. User not added.";
  }

  passwordValid(password) {
    return password.length >= 8;
  }

  login(email, password) {
    let user = this.getUserByEmail(email);

    if (user) {
        let result = bcrypt.compare(password, user.password)
            .then(res => {
                return res ? this.createJWT(user) : "User or Password incorrect"
            }).catch(err => {
                console.log(err.message)
                return "User or Password incorrect"
            })
        return result
    }

    return "User or Password incorrect"
  }

  createJWT(user) {
    return jwt.sign({ userId: user.id }, privateKey, { algorithm: "HS256" });
  }
}
