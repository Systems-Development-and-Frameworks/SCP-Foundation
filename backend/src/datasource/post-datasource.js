const {DataSource} = require('apollo-datasource');

export class PostDatasource extends DataSource {

    constructor(userDatasource, posts = null) {
        super()

        this.userDatasource = userDatasource;
        this.posts = posts || [
            {
                id: 1,
                title: 'Post 1',
                votes: [],
                user_id: 1//this.userDatasource.users[0].id
            },
            {
                id: 2,
                title: 'Post 2',
                votes: [
                    { user_id: 1, value: 1 }
                ],
                // votes: foo(),
                // votes_backend: [
                //     { name:'Robert', value:1 }
                // ],
                user_id: 2
            }

        ];
    }

    allPosts() {
        return this.posts;
    }

    createPost(title, user_id) {
        if (!this.userDatasource.getUserById(user_id)){
            return null;
        }

        let new_post = {
            id: Math.max(...this.posts.map(post => post.id), 0) + 1,
            title: title,
            votes: [],
            user_id: user_id
        }

        this.posts.push(new_post);
        return new_post;
    }

    votePost(post_id, user_id, value) {
        let post = this.posts.find(post => post.id === parseInt(post_id));
        
        if (post) {
            if (post.votes.find(vote => vote.user_id === user_id)) {
                post.votes.push({ user_id: user_id, value: value });
                this.posts = this.posts.map((local_post) => (local_post.post_id === post_id) ? post : local_post)
            }

            return post;
        }

        return null;
    }

    deletePost(post_id) {
        this.posts = this.posts.filter((post) => {
            return post.id !== post_id;
        });
    }
}

module.exports = PostDatasource