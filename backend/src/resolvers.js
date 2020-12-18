import { delegateToSchema } from '@graphql-tools/delegate'
  
  export default ({ schema }) => ({
    Query: {
      posts: (parent, args, context, info) => delegateToSchema({
        schema,
        operation: 'query',
        fieldName: 'posts',
        args: {
        },
        context,
        info,
      }),
      people: (parent, args, context, info) => delegateToSchema({
        schema,
        operation: 'query',
        fieldName: 'people',
        args: {
        },
        context,
        info,
      }),
      allposts: (parent, args, context) => context.dataSources.pdb.getPosts(),
      users: (parent, args, context) => context.dataSources.udb.allUsers()
    },
    Mutation: {
      write: (parent, args, context) => context.dataSources.pdb.writePosts(),
      //write: (parent, args, context) => context.dataSources.pdb.createPost(args.post.title, context.currentUser),
      upvote: (parent, args, context) => context.dataSources.pdb.votePost(args.id, context.currentUser, 1),
      downvote: (parent, args, context) => context.dataSources.pdb.votePost(args.id, context.currentUser, -1),
      delete: (parent, args, context) => context.dataSources.pdb.deletePost(args.id),
      signup: (parent, args, context) => context.dataSources.udb.signup(args.name, args.email, args.password),
      login: (parent, args, context) => context.dataSources.udb.login(args.email, args.password),
    },
    Post:{
      author: (parent, args, context) => context.dataSources.udb.getUserById(parent.user_id),
      votes: (parent, args, context) => context.dataSources.pdb.getVotes(parent.id)
    },
    User: {
      posts: (parent, args, context) => context.dataSources.pdb.getAllPostsFromUser(parent.id)
    }
  });
