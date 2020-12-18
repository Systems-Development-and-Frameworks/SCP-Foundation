import { delegateToSchema } from '@graphql-tools/delegate'
  
  export default ({ schema }) => ({
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

      //write: (parent, args, context) => context.dataSources.pdb.createPost(args.post.title, context.currentUser),
      // upvote: (parent, args, context) => context.dataSources.pdb.votePost(args.id, context.currentUser, 1),
      // downvote: (parent, args, context) => context.dataSources.pdb.votePost(args.id, context.currentUser, -1),
      // signup: (parent, args, context) => context.dataSources.udb.signup(args.name, args.email, args.password),
      // login: (parent, args, context) => context.dataSources.udb.login(args.email, args.password),
    },
    Post:{
      author: (parent, args, context) => context.dataSources.udb.getUserById(parent.user_id),
      votes: (parent, args, context) => context.dataSources.pdb.getVotes(parent.id)
    },
    User: {
      posts: (parent, args, context) => context.dataSources.pdb.getAllPostsFromUser(parent.id)
    }
  });
