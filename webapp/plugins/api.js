import login from "../gql/login.gql";
import posts from "../gql/posts.gql";
import vote from "../gql/vote.gql";

export const WRONG_CREDENTIALS = "User or password incorrect."

export default (_context, inject) => {
    inject('api', {
        async login({ email, password, apollo }) {
            let res = await apollo.mutate({
                mutation: login,
                variables: { email, password }
            })

            if (res.data.login == "User or Password incorrect") {
                throw new Error(WRONG_CREDENTIALS)
            }

            return { token: res.data.login }
        },
        async posts({ apollo }) {
            let res = await apollo.query({
                query: posts
            })
            return res;
        },
        async vote({ postId, voteValue, apollo }) {
          let res = await apollo.mutate({
              mutation: vote,
              variables: {postId, voteValue}
          })
          console.log(res)
      },
    })
}
