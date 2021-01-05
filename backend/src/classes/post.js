export class Post {
    constructor(id, title, user_id) {
        this.id = id;
        this.title = title;
        this.votes = [];
        this.user_id = user_id;
    }
}

export class Vote {
    constructor(user_id, value) {
        this.user_id = user_id;
        this.value = value;
    }
}
