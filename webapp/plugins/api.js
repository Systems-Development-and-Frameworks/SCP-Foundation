import login from "../gql/login.gql";

export const WRONG_CREDENTIALS = "User or password incorrect."

export default (_context, inject) => {
    inject('api', {
        async login({ email, password }) {
            let res = await this.$apollo.mutate({
                mutation: login,
                variables: { email, password }
            })

            console.log(res.data)
            if (res.data.login == "User or Password incorrect") {
                throw new Error(WRONG_CREDENTIALS)
            }

            return { token: res.data.login }
        },
    })
}
