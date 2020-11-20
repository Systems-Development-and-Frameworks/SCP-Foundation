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
      write: (parent, args, context) => context.dataSources.pdb.createPost(args.post.title, 1),
    },
    Post:{
      author: (parent, args, context) => context.dataSources.udb.getUserById(parent.user_id)
    },
    User: {
      posts: (parent, args, context) => context.dataSources.pdb.getAllPostsFromUser(parent.id)
    }
  };
  