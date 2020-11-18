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
    Post:{
      author: (parent, args, context) => context.dataSources.udb.getUserById(1)
    },
    User: {
    }
  };
  