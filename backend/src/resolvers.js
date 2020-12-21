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
      write: (parent, args, context, info) => delegateToSchema({
        schema,
        operation: 'mutation',
        fieldName: 'createPost',
        context,
        info
      }),
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
      vote: async (parent, args, context) => {
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

        const response = await executor({ document: voteMutation })
        if (response.errors) throw new Error(response.errors.map((e) => e.message).join('\n'));

        return JSON.stringify(response.data)
      }
    },
    Post:{
      author: (parent, args, context) => context.dataSources.udb.getUserById(parent.user_id),
      votes: (parent, args, context) => context.dataSources.pdb.getVotes(parent.id)
    },
    User: {
      posts: (parent, args, context) => context.dataSources.pdb.getAllPostsFromUser(parent.id)
    }
  });
