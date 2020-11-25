import User from "../classes/user";

const {DataSource} = require('apollo-datasource');

export class UserDatasource extends DataSource {

    constructor(users = null) {
        super()

        this.users = users || [
            new User(1, 'Robert','Robert@htw.com', 'password'), 
            new User(2, 'Youri', 'Youri@htw.com', '12345678')
        ]
    }

    getUserById(id) {
        return this.users.find(user => user.id == id);
    }

    getUserByName(name) {
        return this.users.find(user => user.name == name);
    }

    allUsers() {
        return this.users;
    }

    addUser(name, email, password) {
        if (this.getUserByName(name) == undefined) {
            this.users.push(new User(Math.max(...this.users.map(user => user.id), 0) + 1, name, email, password));
        }
    }

    removeUser(id) {
        this.users = this.users.filter((user) => {
            return user.id != id;
        });
    }
}