const {DataSource} = require('apollo-datasource');

export class PostDatasourceGraphCMS extends DataSource {
    userVoted(votes, userId) {
        return votes.find(vote => vote.person.id == userId) ? true : false
    }

    votePost(post_id, user_id, value) {
        
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
}