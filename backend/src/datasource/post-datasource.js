import {Post, Vote} from "../classes/post"
import { graphCmsEndpoint } from "../config";
import { GraphQLDataSource } from "apollo-datasource-graphql"
import { gql } from "apollo-server"

const {DataSource} = require('apollo-datasource');

export class PostDatasource extends GraphQLDataSource {

    constructor(userDatasource, posts = null) {
        super()

        this.userDatasource = userDatasource;
        this.posts = posts || [
            new Post(1, 'Post 1', 1),
            new Post(2, 'Post 2', 2),
        ];
        this.baseURL = graphCmsEndpoint
    }

    allPosts() {
        return this.posts;
    }

    createPost(title, user_id) {
        if (!this.userDatasource.getUserById(user_id)){
            return null;
        }

        let new_post = new Post(Math.max(...this.posts.map(post => post.id), 0) + 1, title, user_id);
        this.posts.push(new_post);
        return new_post;
    }

    votePost(post_id, user_id, value) {
        let post = this.posts.find(post => post.id == parseInt(post_id));
        
        if (post) {
            let vote = post.votes.find(vote => vote.user_id == user_id)

            if (!vote) {
                post.votes.push(new Vote(user_id, value));
                this.posts = this.posts.map((local_post) => (local_post.post_id == post_id) ? post : local_post)
            }
            else {
                vote.value = value
                post.votes[post.votes.indexOf(vote)] = vote
                this.posts[this.posts.indexOf(post)] = post
            }

            return post;
        }

        return null;
    }

    getVotes(post_id) {
        let post = this.posts.find(post => post.id == post_id)
        let votesCounter = 0
        
        if (post) {
            post.votes.forEach(vote => {
                votesCounter += vote.value
            });
        }

        return votesCounter
    }

    deletePost(post_id) {
        let postToDelete = this.posts.find(post => post.id == post_id)

        if (postToDelete) {
            this.posts = this.posts.filter((post) => {
                return post.id != post_id;
            });
        }

        return postToDelete
    }

    getAllPostsFromUser(user_id) {
        return this.posts.filter((post) => {
            return post.user_id == user_id;
        })
    }

    async getPosts() {
        const {data} = await this.query(gql`{ posts { title }}`)

        return data.posts
    }

    async writePosts() {
        const {data} = await this.mutation(gql`{ write (post:{title:"testPost"}) { title } }`)

        return data.posts
    }
}