import { GraphQLSpecifiedByDirective } from "graphql";
import User from "../classes/user";
import jwt from "jsonwebtoken"
import { privateKey } from "../private.key"
import bcrypt  from "bcrypt"

const {DataSource} = require('apollo-datasource');

export class UserDatasource extends DataSource {

    constructor(users = null) {
        super()

        this.users = users || [
            new User(1, 'Robert','Robert@htw.de', 'password'), 
            new User(2, 'Youri', 'Youri@htw.de', '12345678')
        ]
    }

    getUserById(id) {
        return this.users.find(user => user.id == id);
    }

    getUserByName(name) {
        return this.users.find(user => user.name == name);
    }

    getUserByEmail(email) {
        return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    allUsers() {
        return this.users;
    }

    addUser(name, email, password) {
        this.users.push(new User(Math.max(...this.users.map(user => user.id), 0) + 1, name, email, password));
    }

    removeUser(id) {
        this.users = this.users.filter((user) => {
            return user.id != id;
        });
    }

    signup(name, email, password) {
        if (this.getUserByEmail(email) == undefined) {
            if (this.passwordValid(password)) {
                jwToken = bcrypt.genSalt(10).then(salt => {
                    return bcrypt.hash(password, salt)
                }).then(hash => {
                    console.log("Hash: " + hash)

                    // bcrypt.compare(password, hash, function(err, result) {
                    //     console.log(result)
                    // })

                    //this.addUser(name, email, hash)
                    return "string"// this.createJWT(this.getUserByEmail(email))
                })
                console.log(jwToken)
                return "Password hashing failed. Try again."
            }
            return "Password invalid. Must be at least 8 characters long. User not added."
        }
        return "Email already exists. User not added."
    }

    passwordValid(password) {
        return password.length >= 8
    }

    login(email, password) {
        let user = this.getUserByEmail(email)

        if (user) {
            if (user.password == password){
                return this.createJWT(user)
            }
        }
        return "null"
    }

    createJWT(user) {
        return jwt.sign({userId: user.id}, privateKey, {algorithm:'HS256'})
    }
}