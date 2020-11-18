const {DataSource} = require('apollo-datasource');

export class UserDatasource extends DataSource {

    constructor(users = []) {
        super()

        this.users = users || [
            {
                id: 1,
                name: 'Robert',
            },
            {
                id: 2,
                name: 'Youri',
            }
        ]
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    getUserByName(name) {
        return this.users.find(user => user.name === name);
    }

    allUsers() {
        return this.users;
    }

    addUser(name) {
        if (this.getUserByName(name) === undefined) {
            this.users.push({
                id : Math.max(...this.posts.map(post => post.id), 0) + 1,
                name: name
            });
        }
    }

    removeUser(id) {
        this.users = this.users.filter((user) => {
            return user.id !== id;
        });
    }
}

module.exports = UserDatasource