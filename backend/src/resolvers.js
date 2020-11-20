// const users = [...Array(5).keys()].map(key => ({
//     id: key + "",
//     name: `Name${key}`
//   }));
  
  // export const resolvers = {
  //   Query: {
  //     findUser: (parent, { id }) => {
  //       const user = users.find(user => user.id === id);
  //       if (user) {
  //         return user;
  //       } else {
  //         throw new Error("Not Found!");
  //       }
  //     }
  //   },
  
  //   Mutation: {
  //     deleteUser: (parent, { id }) => {
  //       const index = users.findIndex(user => user.id === id);
  //       if (index < 0) return false;
  //       users.splice(index, 1);
  //       return true;
  //     }
  //   }
  // };

  export const resolvers = {
    Query: {
      posts: (parent, args, context) => context.dataSources.pdb.allPosts(),
      users: (parent, args, context) => context.dataSources.udb.allUsers()
    },
    Mutation: {
      write: (parent, args, context) => context.dataSources.pdb.createPost(args.post.title, args.post.author.id),
      upvote: (parent, args, context) => context.dataSources.pdb.votePost(args.id, args.voter.id, 1),
      downvote: (parent, args, context) => context.dataSources.pdb.votePost(args.id, args.voter.id, -1),
      delete: (parent, args, context) => context.dataSources.pdb.deletePost(args.id)
    },
    Post:{
      author: (parent, args, context) => context.dataSources.udb.getUserById(parent.user_id),
      votes: (parent, args, context) => context.dataSources.pdb.getVotes(parent.id)
    },
    User: {
      posts: (parent, args, context) => context.dataSources.pdb.getAllPostsFromUser(parent.id)
    }
  };
  