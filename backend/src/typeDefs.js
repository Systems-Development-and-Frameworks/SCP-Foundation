import { gql } from "apollo-server";

// export const typeDefs = gql`
//   type User {
//     id: ID!
//     name: String!
//   }

//   type Query {
//     findUser(id: ID!): User
//   }

//   type Mutation {
//     deleteUser(id: ID!): Boolean
//   }
// `;

export const typeDefs = gql`
type Post {
  id: ID!
  title: String!
  votes: Int!
  author: User!
}

type User {
  id: ID!
  name: String!
  posts: [Post]
}

type Query {
  posts: [Post]
  users: [User]
}

type Mutation {
  write(post: PostInput!): Post
  # 🚀 OPTIONAL
  delete(id: ID!): Post

  # ⚠️ FIXME in exercise #4
  # mock voter until we have authentication
  upvote(id: ID!, voter: UserInput!): Post

  # 🚀 OPTIONAL
  downvote(id: ID!, voter: UserInput!): Post
}

input PostInput {
  title: String!

  # ⚠️ FIXME in exercise #4
  # mock author until we have authentication
  author: UserInput!
}

input UserInput {
  id: ID!
}
`;
