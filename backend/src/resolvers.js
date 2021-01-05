import { delegateToSchema } from '@graphql-tools/delegate'
import { gql } from 'apollo-server'
  
  export default ({ schema, executor }) => ({
    Query: {
      posts: (parent, args, context, info) => delegateToSchema({
        schema,
        operation: 'query',
        fieldName: 'posts',
        context,
        info,
      }),
      people: (parent, args, context, info) => delegateToSchema({
        schema,
        operation: 'query',
        fieldName: 'people',
        context,
        info,
      })
    },
    Mutation: {
      write: async (parent, args, context, info) => {
        const createPostMutation = gql`
        mutation {
          createPost(data: {title: "${args.data.title}", author: {connect: {id: "${context.userData.userId}"}}}) {
            id
            title
            text
            votes {
              value
            }
            author {
              name
            }
          }
        }
        `;
        const { data, errors } = await executor({ document: createPostMutation })
        if (errors) throw new Error(errors.map((e) => e.message).join('\n'));
        
        return data.createPost
      },
      delete: (parent, args, context, info) => delegateToSchema({
        schema,
        operation: 'mutation',
        fieldName: 'deletePost',
        args: {
          where: { id: args.id }
        },
        context,
        info
      }),
      signup: async (parent, args, context) => {
        const getEmailQuery = gql`
        query {
          people (where: {email: "${args.email}"}) {
            email
          }
        }
        `;
        const { data, errors } = await executor({ document: getEmailQuery })
        if (errors) throw new Error(errors.map((e) => e.message).join('\n'));
        const { people } = data
        if (people.length > 0) return "Email already signed up.";

        const passwordHash = await context.dataSources.udbg.validateAndHashPassword(args.password)

        if (!passwordHash) return "Password invalid. Choose another password."

        const createUser = gql`
        mutation {
          createPerson(data: {name: "${args.name}", email: "${args.email}", password: "${passwordHash}"}) {
            id
          }
        }
        `;
        const response = await executor({ document: createUser })
        if (response.errors) throw new Error(response.errors.map((e) => e.message).join('\n'));

        return context.dataSources.udbg.createJWT(response.data.createPerson.id)
      },
      login: async (parent, args, context) => {
        const getEmailQuery = gql`
        query {
          people (where: {email: "${args.email}"}) {
            id
            email
            password
          }
        }
        `;
        const { data, errors } = await executor({ document: getEmailQuery })
        if (errors) throw new Error(errors.map((e) => e.message).join('\n'));
        const { people } = data
        if (people.length != 1) return "Email or Password incorrect.";

        return context.dataSources.udbg.checkPassword(people[0].id, args.password, people[0].password)
      },
      vote: async (parent, args, context, info) => {
        if (args.voteValue != 1 && args.voteValue != -1) throw new Error("Invalid vote value.")

        // get all votes of postId
        const getVotes = gql`
        query {
          posts (where: {id: "${args.postId}"}) {
            votes {
              id
              person {
                id
              }
            }
          }
        }
        `;
        const { data, errors } = await executor({ document: getVotes })
        if (errors) throw new Error(errors.map((e) => e.message).join('\n'));
        const { posts } = data
        // if the post does not exist  return
        if (posts.length != 1) return ("PostId " + args.postId + " does not exist.");

        let voteMutation
        
        // if post has no votes, create first vote
        if (!posts[0].votes) {
          voteMutation = gql`
            mutation {
              createVote(data: {value: ${args.voteValue}, person: {connect: {id: "${context.userData.userId}"}}, post: {connect: {id: "${args.postId}"}}}) {
                id
                value
              }
            }
          `;
        } else {  // if post has votes, either add a new vote or update an existing one
          // get vote from 
          let vote = posts[0].votes.find(vote => vote.person.id == context.userData.userId)
          // 
          if (vote) {
            // update existing vote
            voteMutation = gql`
              mutation {
                updateVote(data: {value: ${args.voteValue}}, where: {id: "${vote.id}"}) {
                  id
                  value
                }
              }
            `;
          } else {
            // create new vote
            voteMutation = gql`
              mutation {
                createVote(data: {value: ${args.voteValue}, person: {connect: {id: "${context.userData.userId}"}}, post: {connect: {id: "${args.postId}"}}}) {
                  id
                  value
                }
              }
            `;
          }
        }

        let response = await executor({ document: voteMutation })
        if (response.errors) throw new Error(response.errors.map((e) => e.message).join('\n'));

        const postQuery = gql`
        query {
          post (where: {id: "${args.postId}"}) {
            id
            title
            text
            votes {
              id
            }
            author {
              id
            }
          }
        }
        `;

        response = await executor({ document: postQuery })
        if (response.errors) throw new Error(response.errors.map((e) => e.message).join('\n'));

        return response.data.post
      }
    },
    Post:{
      author: async (parent, args, context) => {
        const authorQuery = gql`
        query {
          person (where: {id: "${parent.author.id}"}) {
            id
            name
            email
            posts {
              id
            }
          }
        }
        `;

        const response = await executor({ document: authorQuery })
        if (response.errors) throw new Error(response.errors.map((e) => e.message).join('\n'));

        return response.data.person
      },
      votes: async (parent, args, context) => {
        let votesCounter = 0
        let voteValueQuery = gql`
        query {
          votes (where: {post: {id:"${parent.id}"}}) {
            value
          }
        }
        `;
        const response = await executor({ document: voteValueQuery })
        if (response.errors) throw new Error(response.errors.map((e) => e.message).join('\n'));

        if (response.data.votes) {
          response.data.votes.forEach(vote => {
            votesCounter += vote.value
          });
        }

        return votesCounter
      },
    },
    Person: {
      posts: async (parent, args, context) => {
        const postQuery = gql`
        query {
          posts (where: {author: {id: "${parent.id}"}}) {
            id
            title
            text
            author {
              id
            }
            votes {
              id
            }
          }
        }
        `;

        const response = await executor({ document: postQuery })
        if (response.errors) throw new Error(response.errors.map((e) => e.message).join('\n'));

        return response.data.posts
      }
    }
  });
